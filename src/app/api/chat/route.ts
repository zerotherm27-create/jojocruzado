import { NextRequest, NextResponse } from "next/server";
import type OpenAI from "openai";
import { createOpenAIClient } from "@/lib/openai/client";
import { buildSystemPrompt } from "@/lib/chatbot/systemPrompt";
import { CAPTURE_LEAD_TOOL } from "@/lib/chatbot/tools";
import { captureLead } from "@/lib/chatbot/captureLead";
import { checkRateLimit } from "@/lib/chatbot/rateLimit";

// Bounds regardless of what the client sends -- cheap guards against both
// abuse and runaway token cost (see src/lib/chatbot/rateLimit.ts for the
// request-frequency side of this).
const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 800;
const HISTORY_WINDOW = 16;
const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 400;

type ChatMessage = { role: "user" | "assistant"; content: string };

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isValidChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const role = (value as Record<string, unknown>).role;
  const content = (value as Record<string, unknown>).content;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.length > 0 &&
    content.length <= MAX_MESSAGE_LENGTH
  );
}

const FALLBACK_REPLY =
  "Sorry, I'm having trouble right now — you can reach Jojo directly at /contact.";

/* Site-wide chat widget's backend (src/components/ChatWidget.tsx is the
   client). A Route Handler, not a Server Action: this is a repeated,
   open-ended exchange needing its own status codes (429/400), unlike this
   repo's existing one-shot form-submit actions (submitContactForm etc.).

   Stateless: conversation history lives in the client's React state and is
   resent in full (trimmed here to the last HISTORY_WINDOW messages) with
   every turn -- no new server-side session store. Non-streaming: replies are
   short qualifying-question turns, and streaming would meaningfully
   complicate the tool-call loop below for little UX benefit here. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { reply: "You've sent a lot of messages — try again in a bit, or reach Jojo directly at /contact." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }
  if (!rawMessages.every(isValidChatMessage)) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  const history = (rawMessages as ChatMessage[]).slice(-HISTORY_WINDOW);

  try {
    const openai = createOpenAIClient();

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: buildSystemPrompt() },
      ...history,
    ];

    const first = await openai.chat.completions.create({
      model: MODEL,
      messages,
      tools: [CAPTURE_LEAD_TOOL],
      max_tokens: MAX_TOKENS,
    });

    const firstMessage = first.choices[0]?.message;
    // tool_calls is a union of function-tool-calls and custom-tool-calls (SDK
    // v7+); this app only ever defines function tools (CAPTURE_LEAD_TOOL), so
    // narrow to that variant before reading `.function`.
    const toolCall = firstMessage?.tool_calls?.find(
      (call): call is OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall =>
        call.type === "function" && call.function.name === "capture_lead",
    );

    if (!toolCall || !firstMessage) {
      return NextResponse.json({
        reply: firstMessage?.content ?? FALLBACK_REPLY,
        leadCaptured: false,
      });
    }

    let captureResult: { success: boolean };
    try {
      const args = JSON.parse(toolCall.function.arguments);
      captureResult = await captureLead(args);
    } catch (parseError) {
      console.error("chat route: capture_lead argument parse failed", parseError);
      captureResult = { success: false };
    }

    const second = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        ...messages,
        firstMessage,
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(captureResult),
        },
      ],
      max_tokens: MAX_TOKENS,
    });

    return NextResponse.json({
      reply: second.choices[0]?.message?.content ?? FALLBACK_REPLY,
      leadCaptured: captureResult.success,
    });
  } catch (error) {
    // Matches this repo's existing soft-fail convention (getArticles,
    // getSiteSettings, etc.): log the real error, never surface a broken
    // widget or a raw 500 to the visitor.
    console.error("chat route: request failed", error);
    return NextResponse.json({ reply: FALLBACK_REPLY, leadCaptured: false });
  }
}

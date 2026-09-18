import type OpenAI from "openai";

/* Single source of truth for the capture_lead tool schema, shared by the
   route handler (passed to the OpenAI call) and captureLead.ts (which must
   defensively re-validate these same fields, since tool arguments come from
   the model, not a form a human reviewed before submitting). */
export const CAPTURE_LEAD_TOOL: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "capture_lead",
    description:
      "Call once the visitor has given a name, at least one contact method (email or mobile), and has explicitly agreed to being contacted.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "The visitor's name." },
        email: { type: "string", description: "Email address, if given." },
        mobile: { type: "string", description: "Mobile number, if given." },
        consent: {
          type: "boolean",
          description: "True only if the visitor explicitly agreed to being contacted.",
        },
        summary: {
          type: "string",
          description:
            "1-3 plain sentences summarizing the visitor's situation and concerns discussed, for Jojo's follow-up. Never include prices, quotes, or guarantees.",
        },
      },
      required: ["name", "consent", "summary"],
      additionalProperties: false,
    },
  },
};

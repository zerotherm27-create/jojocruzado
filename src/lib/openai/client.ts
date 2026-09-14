import OpenAI from "openai";

/* Same lazy-guard pattern as createServiceRoleClient() (src/lib/supabase/client.ts):
   reads the env var only when called, not at module load, so a missing key never
   breaks `next build` or any route that doesn't touch the chatbot. */
export function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set");
  }
  return new OpenAI({ apiKey });
}

import { createOpenAI } from "@ai-sdk/openai";

/** Default OpenAI model used when a conversation has no model override. */
export const DEFAULT_CHAT_MODEL =
  process.env.OPENAI_CHAT_MODEL || "qwen/qwen3.6-35b-a3b";

/**
 * OpenAI-compatible provider pointed at the configured base URL (e.g. a local
 * LM Studio server), instead of the `@ai-sdk/openai` default of api.openai.com.
 */
const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE,
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Returns an OpenAI-compatible language model instance for chat completions.
 *
 * Uses `.chat()` (Chat Completions API) instead of the default call signature
 * (Responses API) — local servers like LM Studio only implement
 * `/v1/chat/completions`, and reject the Responses API's structured `input`
 * once a conversation has more than one message.
 *
 * @param modelId - Optional model identifier; falls back to {@link DEFAULT_CHAT_MODEL}.
 */
export function getChatModel(modelId?: string | null) {
  return openai.chat(modelId || DEFAULT_CHAT_MODEL);
}

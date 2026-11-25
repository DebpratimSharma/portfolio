import OpenAI from "openai";
import {
  logGeminiApiUsage,
  withApiKeyFallback,
  type GeminiUsageMetadata,
} from "./llm-keys";

export type EmbeddingProvider = "openai" | "gemini";

export function getEmbeddingConfig(): {
  provider: EmbeddingProvider;
  model: string;
  baseURL?: string;
} {
  // EMBEDDING_PROVIDER lets you decouple the embedding provider from LLM_PROVIDER.
  // Falls back to LLM_PROVIDER, but clamps to a valid embedding provider:
  // Groq (and other generation-only APIs) don't have embedding endpoints,
  // so we default to gemini when GEMINI_API_KEY / LLM_API_KEY is present.
  const raw = (
    process.env.EMBEDDING_PROVIDER ||
    process.env.LLM_PROVIDER ||
    "openai"
  ).toLowerCase();

  const provider: EmbeddingProvider = raw === "gemini" ? "gemini" : "openai";

  // When LLM_PROVIDER is a generation-only provider (e.g. groq) and no explicit
  // EMBEDDING_PROVIDER is set, auto-select gemini if a Gemini API key exists.
  const resolvedProvider: EmbeddingProvider =
    raw !== "gemini" && raw !== "openai" &&
    !process.env.EMBEDDING_PROVIDER &&
    (process.env.GEMINI_API_KEY || process.env.LLM_API_KEY)
      ? "gemini"
      : provider;

  const defaultModel =
    resolvedProvider === "gemini" ? "gemini-embedding-001" : "text-embedding-3-small";

  return {
    provider: resolvedProvider,
    model: process.env.EMBEDDING_MODEL || defaultModel,
    baseURL: resolvedProvider === "openai" ? (process.env.LLM_BASE_URL || undefined) : undefined,
  };
}

/**
 * Generates embeddings for a batch of texts using the configured provider.
 * A per-attempt timeout is enforced so a hanging primary-key endpoint fails fast
 * and lets withApiKeyFallback switch to the backup key immediately.
 */
export async function embedTexts(
  texts: string[],
  signal?: AbortSignal
): Promise<number[][]> {
  if (texts.length === 0) return [];
  const cfg = getEmbeddingConfig();
  // 8 s per attempt — enough for a healthy embedding call; fails fast to the backup key if the
  // primary endpoint is hanging or rate-limited so the user isn't stuck waiting 15+ seconds.
  const EMBED_ATTEMPT_TIMEOUT_MS = 8_000;

  return withApiKeyFallback(async (apiKey, keyMeta) => {
    if (cfg.provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        cfg.model
      )}:batchEmbedContents?key=${encodeURIComponent(apiKey)}`;

      const attemptTimeout = AbortSignal.timeout(EMBED_ATTEMPT_TIMEOUT_MS);
      const requestSignal = signal
        ? AbortSignal.any([signal, attemptTimeout])
        : attemptTimeout;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: requestSignal,
        body: JSON.stringify({
          requests: texts.map((text) => ({
            model: `models/${cfg.model}`,
            content: { parts: [{ text }] },
          })),
        }),
      });

      if (!res.ok) {
        logGeminiApiUsage({
          api: "embed",
          model: cfg.model,
          keyIndex: keyMeta.keyIndex,
          status: res.status,
          headers: res.headers,
        });
        const body = await res.text();
        throw new Error(`Gemini embedding failed (${res.status}): ${body}`);
      }

      const data = (await res.json()) as {
        embeddings: { values: number[] }[];
        usageMetadata?: GeminiUsageMetadata;
      };
      logGeminiApiUsage({
        api: "embed",
        model: cfg.model,
        keyIndex: keyMeta.keyIndex,
        status: res.status,
        headers: res.headers,
        usageMetadata: data.usageMetadata,
      });
      return data.embeddings.map((e) => e.values);
    }

    const client = new OpenAI({
      apiKey,
      baseURL: cfg.baseURL,
    });

    const attemptTimeout = AbortSignal.timeout(EMBED_ATTEMPT_TIMEOUT_MS);
    const requestSignal = signal
      ? AbortSignal.any([signal, attemptTimeout])
      : attemptTimeout;

    const response = await client.embeddings.create(
      {
        model: cfg.model,
        input: texts,
      },
      { signal: requestSignal }
    );

    return response.data.map((item) => item.embedding);
  });
}

export async function embedQuery(
  text: string,
  signal?: AbortSignal
): Promise<number[]> {
  const [vec] = await embedTexts([text], signal);
  if (!vec) {
    throw new Error("Failed to generate query embedding.");
  }
  return vec;
}

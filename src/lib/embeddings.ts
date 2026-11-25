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
  const provider =
    (process.env.LLM_PROVIDER?.toLowerCase() as EmbeddingProvider) || "openai";

  const defaultModel =
    provider === "gemini" ? "gemini-embedding-001" : "text-embedding-3-small";

  return {
    provider,
    model: process.env.EMBEDDING_MODEL || defaultModel,
    baseURL: process.env.LLM_BASE_URL || undefined,
  };
}

/**
 * Generates embeddings for a batch of texts using the configured provider.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const cfg = getEmbeddingConfig();

  return withApiKeyFallback(async (apiKey, keyMeta) => {
    if (cfg.provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        cfg.model
      )}:batchEmbedContents?key=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    const response = await client.embeddings.create({
      model: cfg.model,
      input: texts,
    });

    return response.data.map((item) => item.embedding);
  });
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embedTexts([text]);
  if (!vec) {
    throw new Error("Failed to generate query embedding.");
  }
  return vec;
}

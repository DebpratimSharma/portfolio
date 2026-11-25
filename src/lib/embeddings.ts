import OpenAI from "openai";

export type EmbeddingProvider = "openai" | "gemini";

export function getEmbeddingConfig(): {
  provider: EmbeddingProvider;
  model: string;
  apiKey: string;
  baseURL?: string;
} {
  const provider =
    (process.env.LLM_PROVIDER?.toLowerCase() as EmbeddingProvider) || "openai";
  const apiKey =
    process.env.LLM_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    "";

  if (!apiKey) {
    throw new Error("LLM_API_KEY (or provider API key) is not configured.");
  }

  const defaultModel =
    provider === "gemini" ? "gemini-embedding-001" : "text-embedding-3-small";

  return {
    provider,
    model: process.env.EMBEDDING_MODEL || defaultModel,
    apiKey,
    baseURL: process.env.LLM_BASE_URL || undefined,
  };
}

/**
 * Generates embeddings for a batch of texts using the configured provider.
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const cfg = getEmbeddingConfig();

  if (cfg.provider === "gemini") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      cfg.model
    )}:batchEmbedContents?key=${encodeURIComponent(cfg.apiKey)}`;

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
      const body = await res.text();
      throw new Error(`Gemini embedding failed (${res.status}): ${body}`);
    }

    const data = (await res.json()) as {
      embeddings: { values: number[] }[];
    };
    return data.embeddings.map((e) => e.values);
  }

  const client = new OpenAI({
    apiKey: cfg.apiKey,
    baseURL: cfg.baseURL,
  });

  const response = await client.embeddings.create({
    model: cfg.model,
    input: texts,
  });

  return response.data.map((item) => item.embedding);
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embedTexts([text]);
  if (!vec) {
    throw new Error("Failed to generate query embedding.");
  }
  return vec;
}

import { getCollections, type PassageDoc } from "@/lib/db";
import { embedQuery } from "@/lib/embeddings";
import { CHAT_CONFIG } from "./config";

export type ScoredPassage = {
  id: string;
  sourceId: string;
  sourceType: string;
  title: string;
  section: string;
  text: string;
  citationUrl?: string;
  score: number;
  vectorScore: number;
  keywordScore: number;
};

export type RetrievalResult = {
  passages: ScoredPassage[];
  topScore: number;
  activeVersion: number;
};

type PassageCache = {
  version: number;
  loadedAt: number;
  passages: PassageDoc[];
};

const CACHE_TTL_MS = 5 * 60_000;

const globalForPassages = globalThis as typeof globalThis & {
  __portfolioPassageCache?: PassageCache;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export function computeKeywordScore(query: string, docText: string): number {
  const queryTokens = Array.from(new Set(tokenize(query)));
  if (queryTokens.length === 0) return 0;

  const docLower = docText.toLowerCase();
  const docTokens = new Set(tokenize(docText));

  let matches = 0;
  for (const token of queryTokens) {
    if (docTokens.has(token) || docLower.includes(token)) {
      matches += 1;
    }
  }
  return matches / queryTokens.length;
}

/**
 * Pure ranking function over passages so retrieval can be evaluated in isolation.
 */
export function rankPassages(
  query: string,
  queryEmbedding: number[],
  passages: Pick<
    PassageDoc,
    "_id" | "sourceId" | "sourceType" | "title" | "section" | "text" | "embedding" | "citationUrl"
  >[],
  topK: number = CHAT_CONFIG.TOP_K
): ScoredPassage[] {
  const scored: ScoredPassage[] = passages.map((p) => {
    const rawCosine = cosineSimilarity(queryEmbedding, p.embedding);
    // Normalize cosine [-1, 1] -> [0, 1] (typically [0, 1] for text embeddings)
    const vectorScore = Math.max(0, Math.min(1, rawCosine));
    const keywordScore = computeKeywordScore(
      query,
      `${p.title} ${p.section} ${p.text}`
    );
    const score =
      CHAT_CONFIG.VECTOR_WEIGHT * vectorScore +
      CHAT_CONFIG.KEYWORD_WEIGHT * keywordScore;

    return {
      id: String(p._id),
      sourceId: p.sourceId,
      sourceType: p.sourceType,
      title: p.title,
      section: p.section,
      text: p.text,
      citationUrl: p.citationUrl,
      score,
      vectorScore,
      keywordScore,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

async function loadActivePassages(): Promise<{
  version: number;
  passages: PassageDoc[];
}> {
  const { meta, passages } = await getCollections();
  const metaDoc = await meta.findOne({ _id: "active" });

  if (!metaDoc) {
    throw new Error("No active corpus version found. Run `pnpm ingest` first.");
  }

  const now = Date.now();
  const cached = globalForPassages.__portfolioPassageCache;
  if (
    cached &&
    cached.version === metaDoc.activeVersion &&
    now - cached.loadedAt < CACHE_TTL_MS
  ) {
    return { version: cached.version, passages: cached.passages };
  }

  const docs = await passages
    .find(
      { version: metaDoc.activeVersion, visibility: "public" },
      {
        projection: {
          _id: 1,
          sourceId: 1,
          sourceType: 1,
          title: 1,
          section: 1,
          text: 1,
          embedding: 1,
          citationUrl: 1,
        },
      }
    )
    .toArray();

  globalForPassages.__portfolioPassageCache = {
    version: metaDoc.activeVersion,
    loadedAt: now,
    passages: docs,
  };

  return { version: metaDoc.activeVersion, passages: docs };
}

/**
 * Retrieves top-k passages for a query from the active MongoDB corpus version.
 */
export async function retrievePassages(
  resolvedQuery: string,
  topK: number = CHAT_CONFIG.TOP_K,
  signal?: AbortSignal
): Promise<RetrievalResult> {
  const [{ version, passages }, queryEmbedding] = await Promise.all([
    loadActivePassages(),
    embedQuery(resolvedQuery, signal),
  ]);

  const ranked = rankPassages(resolvedQuery, queryEmbedding, passages, topK);
  return {
    passages: ranked,
    topScore: ranked[0]?.score ?? 0,
    activeVersion: version,
  };
}

export function meetsEvidenceThreshold(result: RetrievalResult): boolean {
  if (result.topScore < CHAT_CONFIG.MIN_TOP_SCORE) return false;
  const qualifying = result.passages.filter(
    (p) => p.score >= CHAT_CONFIG.MIN_PASSAGE_SCORE
  );
  return qualifying.length >= CHAT_CONFIG.MIN_PASSAGES;
}

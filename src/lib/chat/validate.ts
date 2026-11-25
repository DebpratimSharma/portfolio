import { CHAT_CONFIG } from "./config";
import { FIXED_RESPONSES } from "./responses";
import {
  ModelOutputSchema,
  type ChatResponse,
  type Citation,
} from "./schema";
import type { ScoredPassage } from "./retrieve";

/**
 * Strips any markdown links `[label](url)` or bare URLs that the model might
 * invent, keeping only clean prose. Citations are rendered strictly from DB fields.
 */
function stripRawUrls(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/gi, "$1")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function validateStreamedOutput(
  rawAnswer: string,
  citationIds: string[],
  retrievedPassages: ScoredPassage[]
): ChatResponse {
  const passageMap = new Map(retrievedPassages.map((p) => [p.id, p]));
  const validPassages: ScoredPassage[] = [];
  const seenSources = new Set<string>();

  for (const id of citationIds) {
    const match = passageMap.get(id.trim());
    if (!match) {
      console.warn("Chat stream validation failed: unknown citationId", id);
      return FIXED_RESPONSES.abstained();
    }
    if (!seenSources.has(match.sourceId)) {
      seenSources.add(match.sourceId);
      validPassages.push(match);
    }
  }

  if (validPassages.length === 0) {
    console.warn("Chat stream validation failed: answered with zero valid citations");
    return FIXED_RESPONSES.abstained();
  }

  const cleanedAnswer = stripRawUrls(rawAnswer).slice(0, CHAT_CONFIG.MAX_ANSWER_CHARS);
  if (!cleanedAnswer) {
    return FIXED_RESPONSES.abstained();
  }

  const citations: Citation[] = validPassages.map((p) => ({
    id: p.id,
    title: p.title,
    ...(p.citationUrl ? { url: p.citationUrl } : {}),
  }));

  return {
    status: "answered",
    answer: cleanedAnswer,
    citations,
  };
}

/**
 * Validates structured model output against retrieved passages and builds the
 * final ChatResponse with trusted DB citation URLs.
 */
export function validateModelOutput(
  rawOutput: unknown,
  retrievedPassages: ScoredPassage[]
): ChatResponse {
  const parsed = ModelOutputSchema.safeParse(rawOutput);
  if (!parsed.success) {
    console.warn("Chat validation failed: schema mismatch", parsed.error.issues);
    return FIXED_RESPONSES.abstained();
  }

  const { status, answer, citationIds } = parsed.data;

  if (status === "insufficient_evidence") {
    return FIXED_RESPONSES.abstained();
  }

  const passageMap = new Map(retrievedPassages.map((p) => [p.id, p]));
  const validPassages: ScoredPassage[] = [];
  const seenSources = new Set<string>();

  for (const id of citationIds) {
    const match = passageMap.get(id);
    if (!match) {
      // Model cited an ID not in the retrieved set -> reject to prevent fabrication
      console.warn("Chat validation failed: unknown citationId", id);
      return FIXED_RESPONSES.abstained();
    }
    if (!seenSources.has(match.sourceId)) {
      seenSources.add(match.sourceId);
      validPassages.push(match);
    }
  }

  if (validPassages.length === 0) {
    console.warn("Chat validation failed: answered with zero valid citations");
    return FIXED_RESPONSES.abstained();
  }

  const cleanedAnswer = stripRawUrls(answer).slice(0, CHAT_CONFIG.MAX_ANSWER_CHARS);
  if (!cleanedAnswer) {
    return FIXED_RESPONSES.abstained();
  }

  const citations: Citation[] = validPassages.map((p) => ({
    id: p.id,
    title: p.title,
    ...(p.citationUrl ? { url: p.citationUrl } : {}),
  }));

  return {
    status: "answered",
    answer: cleanedAnswer,
    citations,
  };
}

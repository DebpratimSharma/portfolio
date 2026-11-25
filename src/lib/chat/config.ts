/**
 * Central configuration constants for the Portfolio AI Chatbot ("ACE").
 * Thresholds and retrieval parameters should be tuned using `pnpm evals`.
 */
export const CHAT_CONFIG = {
  /** Number of top passages to retrieve per query. */
  TOP_K: 3,

  /**
   * Minimum combined hybrid score (0..1) required for the top passage.
   * Queries below this threshold abstain without calling the LLM.
   */
  MIN_TOP_SCORE: 0.24,

  /** Minimum number of passages meeting MIN_PASSAGE_SCORE. */
  MIN_PASSAGES: 1,
  MIN_PASSAGE_SCORE: 0.16,

  /** Hybrid retrieval weights (vector similarity + keyword overlap). */
  VECTOR_WEIGHT: 0.72,
  KEYWORD_WEIGHT: 0.28,

  /** Input & request caps. */
  MAX_BODY_BYTES: 16 * 1024, // 16 KB
  MAX_QUESTION_CHARS: 500,
  MAX_RECENT_TURNS: 2,
  MAX_TURN_CHARS: 400,

  /** Output caps. */
  MAX_OUTPUT_TOKENS: 512,
  MAX_ANSWER_CHARS: 1800,

  /** Versioning for prompt / cache invalidation. */
  PROMPT_VERSION: "v1",

  /** Rate limits. */
  IP_WINDOW_LIMIT: 10,
  IP_WINDOW_SECONDS: 60,
  IP_DAILY_LIMIT: 60,
  DEFAULT_DAILY_BUDGET: 200,
} as const;

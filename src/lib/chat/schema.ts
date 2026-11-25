import { z } from "zod";
import { CHAT_CONFIG } from "./config";

export const ChatTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(CHAT_CONFIG.MAX_TURN_CHARS),
});

export const ChatRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Please enter a question.")
    .max(
      CHAT_CONFIG.MAX_QUESTION_CHARS,
      `Question must be at most ${CHAT_CONFIG.MAX_QUESTION_CHARS} characters.`
    ),
  recentTurns: z
    .array(ChatTurnSchema)
    .max(CHAT_CONFIG.MAX_RECENT_TURNS)
    .optional()
    .default([]),
  turnstileToken: z.string().trim().max(2048).optional(),
  stream: z.boolean().optional().default(false),
});

export type ChatTurn = z.infer<typeof ChatTurnSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/** Structured JSON output required from the LLM. */
export const ModelOutputSchema = z.object({
  status: z.enum(["answered", "insufficient_evidence"]),
  answer: z.string().trim().min(1).max(CHAT_CONFIG.MAX_ANSWER_CHARS),
  citationIds: z.array(z.string().trim().min(1)).max(CHAT_CONFIG.TOP_K),
});

export type ModelOutput = z.infer<typeof ModelOutputSchema>;

export const CitationSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().optional(),
});

export type Citation = z.infer<typeof CitationSchema>;

export type ChatStatus =
  | "answered"
  | "abstained"
  | "refused"
  | "rate_limited"
  | "error";

export type ChatResponse = {
  status: ChatStatus;
  answer: string;
  citations: Citation[];
};

/** Frontmatter schema for Markdown files in `content/`. */
export const ContentFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  type: z.enum(["project", "experience", "skill", "faq", "about", "resume", "case_study"]),
  url: z.string().url().optional(),
  repo: z.string().url().optional(),
  date: z.union([z.string(), z.date()]).optional(),
  visibility: z.enum(["public", "private"]).default("private"),
});

export type ContentFrontmatter = z.infer<typeof ContentFrontmatterSchema>;

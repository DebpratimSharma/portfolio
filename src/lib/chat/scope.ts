export type ScopeDecision =
  | { action: "allow" }
  | { action: "greeting" }
  | { action: "capabilities" }
  | { action: "refuse"; reason: string };

const GREETING_PATTERNS = [
  /^(hi|hello|hey|yo|sup|hiya|greetings|good\s+(morning|afternoon|evening))[!.,?\s]*$/i,
  /^how\s+are\s+you[?!.\s]*$/i,
];

const CAPABILITY_PATTERNS = [
  /^(what\s+can\s+you\s+do|who\s+are\s+you|what\s+are\s+you|help|how\s+does\s+this\s+work)[?!.\s]*$/i,
];

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+|any\s+)?(previous|prior|above|system)\s+(instructions?|prompts?|rules?)/i,
  /disregard\s+(all\s+|any\s+)?(previous|prior|above|system)/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions?|rules?|developer\s+prompt)/i,
  /what\s+(is|are)\s+your\s+(system\s+prompt|hidden\s+instructions?|rules?)/i,
  /you\s+are\s+now\s+(a|an|my)\s+/i,
  /act\s+as\s+(a|an|my)\s+(?!portfolio|assistant)/i,
  /pretend\s+to\s+be\s+/i,
  /jailbreak|dan\s+mode|developer\s+mode/i,
  /<\s*\/?\s*(system|untrusted_passages|instructions?)\s*>/i,
];

const OUT_OF_SCOPE_PATTERNS = [
  /\b(write|create|generate|build|fix|debug|refactor|implement|explain)\s+(me\s+)?(a\s+|an\s+|some\s+)?(html|css|javascript|typescript|python|java|c\+\+|rust|sql|bash|react\s+component|function|script|algorithm|regex|dockerfile)\b/i,
  /\b(solve\s+this\s+leetcode|homework|essay|write\s+a\s+poem|tell\s+me\s+a\s+joke|translate\s+this|weather\s+in|stock\s+price|recipe\s+for)\b/i,
  /\bhow\s+to\s+(hack|exploit|bypass|crack|scrape)\b/i,
];

/**
 * Deterministic scope gate that runs before retrieval and LLM calls.
 * Blocks prompt injections and out-of-scope requests without spending tokens.
 */
export function checkScope(question: string): ScopeDecision {
  const normalized = question.trim();

  if (GREETING_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "greeting" };
  }

  if (CAPABILITY_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "capabilities" };
  }

  if (INJECTION_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "refuse", reason: "prompt_injection" };
  }

  if (OUT_OF_SCOPE_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "refuse", reason: "out_of_scope" };
  }

  return { action: "allow" };
}

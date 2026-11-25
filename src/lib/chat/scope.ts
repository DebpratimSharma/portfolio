export type ScopeDecision =
  | { action: "allow" }
  | { action: "greeting" }
  | { action: "identity" }
  | { action: "capabilities" }
  | { action: "personal" }
  | { action: "refuse"; reason: string };

const GREETING_PATTERNS = [
  /^(hi|hello|hey|yo|sup|hiya|greetings|good\s+(morning|afternoon|evening))[!.,?\s]*$/i,
  /^how\s+are\s+you[?!.\s]*$/i,
];

const IDENTITY_PATTERNS = [
  /^(who|what)\s+(are|r)\s+you[?!.\s]*$/i,
  /^(what('?s|\s+is)\s+your\s+name|introduce\s+yourself|tell\s+me\s+about\s+yourself)[?!.\s]*$/i,
  /\b(who|what)\s+(is|are)\s+(this\s+)?(chatbot|chat\s*bot|assistant|ai\s+assistant|bot|ace(\s+ai)?)\b/i,
  /\btell\s+me\s+about\s+(this\s+)?(chatbot|chat\s*bot|assistant|ace(\s+ai)?)\b/i,
  /\bwho\s+(built|created|made|developed|trained|owns)\s+(you|this\s+(chatbot|chat\s*bot|assistant|bot)|ace(\s+ai)?)\b/i,
];

const CAPABILITY_PATTERNS = [
  /^(what\s+can\s+you\s+do|help|how\s+does\s+this\s+work)[?!.\s]*$/i,
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

const PERSONAL_PATTERNS = [
  /\b(girlfriend|boyfriend|gf|bf|wife|husband|partner|spouse|dating|married|single|relationship\s+status|crush|love\s+life)\b/i,
  /\b(personal\s+life|private\s+life|family\s+details|parents?|siblings?|mother|father|sister|brother|religion|caste|political|politics|zodiac|horoscope)\b/i,
  /\b(salary|ctc|package|income|net\s+worth|bank\s+account|aadhaar|pan\s+card|passport|home\s+address|phone\s+number|whatsapp\s+number|date\s+of\s+birth|dob|how\s+old\s+is\s+(he|debpratim))\b/i,
];

/**
 * Deterministic scope gate that runs before retrieval and LLM calls.
 * Blocks prompt injections, private/personal queries, and out-of-scope requests without spending tokens.
 */
export function checkScope(question: string): ScopeDecision {
  const normalized = question.trim();

  if (GREETING_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "greeting" };
  }

  if (IDENTITY_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "identity" };
  }

  if (CAPABILITY_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "capabilities" };
  }

  if (INJECTION_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "refuse", reason: "prompt_injection" };
  }

  if (PERSONAL_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "personal" };
  }

  if (OUT_OF_SCOPE_PATTERNS.some((re) => re.test(normalized))) {
    return { action: "refuse", reason: "out_of_scope" };
  }

  return { action: "allow" };
}

const RATE_LIMIT_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes for quota/rate-limit errors
const TRANSIENT_COOLDOWN_MS = 60 * 1000; // 1 minute for transient 503/502/504 errors

export type ApiKeyMeta = {
  keyIndex: number;
  keyLabel: string;
};

type DailyTokenUsage = {
  date: string;
  generateTokens: number;
  embedRequests: number;
  lastRateLimitHeaders?: Record<string, string>;
};

type KeyState = {
  activeIndex: number;
  cooldownUntil: Record<number, number>;
  dailyUsage: Record<number, DailyTokenUsage>;
};

const globalForKeys = globalThis as typeof globalThis & {
  __portfolioLlmKeyState?: KeyState;
};

function getTodayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function getKeyState(): KeyState {
  if (!globalForKeys.__portfolioLlmKeyState) {
    globalForKeys.__portfolioLlmKeyState = {
      activeIndex: 0,
      cooldownUntil: {},
      dailyUsage: {},
    };
  }
  const state = globalForKeys.__portfolioLlmKeyState;
  if (!state.cooldownUntil) state.cooldownUntil = {};
  if (!state.dailyUsage) state.dailyUsage = {};
  return state;
}

function getKeyLabel(index: number): string {
  return index === 0 ? "primary" : `backup-${index}`;
}

function getOrResetDailyUsage(state: KeyState, index: number): DailyTokenUsage {
  const today = getTodayUtc();
  const existing = state.dailyUsage[index];
  if (!existing || existing.date !== today) {
    state.dailyUsage[index] = {
      date: today,
      generateTokens: 0,
      embedRequests: 0,
    };
  }
  return state.dailyUsage[index];
}

export function getConfiguredApiKeys(): string[] {
  const primary =
    process.env.LLM_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    "";
  const backup = process.env.LLM_API_KEY_BKP || "";

  const keys = [primary, backup]
    .map((k) => k.trim())
    .filter((k, idx, arr) => k.length > 0 && arr.indexOf(k) === idx);

  if (keys.length === 0) {
    throw new Error("LLM_API_KEY (or provider API key) is not configured.");
  }

  return keys;
}

function getFailoverCooldownMs(err: unknown): number | null {
  if (!err || typeof err !== "object") return null;
  const status = (err as { status?: unknown }).status;
  if (status === 429) return RATE_LIMIT_COOLDOWN_MS;
  if (status === 502 || status === 503 || status === 504) {
    return TRANSIENT_COOLDOWN_MS;
  }

  const code = (err as { code?: unknown }).code;
  if (code === "rate_limit_exceeded" || code === "insufficient_quota") {
    return RATE_LIMIT_COOLDOWN_MS;
  }

  const message = err instanceof Error ? err.message : String(err);
  if (/\b429\b|rate.?limit|quota|resource_exhausted|too many requests/i.test(message)) {
    return RATE_LIMIT_COOLDOWN_MS;
  }
  if (/\b(502|503|504)\b|unavailable|overloaded/i.test(message)) {
    return TRANSIENT_COOLDOWN_MS;
  }
  return null;
}

/**
 * Runs an API call using the currently active key. If it hits a rate/quota limit
 * or transient 503, puts that key on cooldown, switches activeIndex to the other
 * key for this and subsequent calls, and retries once.
 */
export async function withApiKeyFallback<T>(
  run: (apiKey: string, meta: ApiKeyMeta) => Promise<T>
): Promise<T> {
  const keys = getConfiguredApiKeys();
  const state = getKeyState();
  const now = Date.now();

  if (state.activeIndex >= keys.length) {
    state.activeIndex = 0;
  }

  // If the current active key is still in cooldown and another key is free, switch to it.
  const activeCooldown = state.cooldownUntil[state.activeIndex] ?? 0;
  if (activeCooldown > now && keys.length > 1) {
    const freeIndex = keys.findIndex(
      (_, idx) => (state.cooldownUntil[idx] ?? 0) <= now
    );
    if (freeIndex !== -1) {
      state.activeIndex = freeIndex;
    }
  }

  const currentIndex = state.activeIndex;

  try {
    return await run(keys[currentIndex], {
      keyIndex: currentIndex,
      keyLabel: getKeyLabel(currentIndex),
    });
  } catch (err) {
    const cooldownMs = getFailoverCooldownMs(err);
    if (cooldownMs === null || keys.length < 2) {
      throw err;
    }

    state.cooldownUntil[currentIndex] = Date.now() + cooldownMs;
    const nextIndex = (currentIndex + 1) % keys.length;
    state.activeIndex = nextIndex;

    return await run(keys[nextIndex], {
      keyIndex: nextIndex,
      keyLabel: getKeyLabel(nextIndex),
    });
  }
}

export type GeminiUsageMetadata = {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  thoughtsTokenCount?: number;
  totalTokenCount?: number;
};

const RATE_LIMIT_HEADER_NAMES = [
  "x-ratelimit-limit-tokens",
  "x-ratelimit-remaining-tokens",
  "x-ratelimit-reset-tokens",
  "x-ratelimit-limit-requests",
  "x-ratelimit-remaining-requests",
  "retry-after",
] as const;

function extractRateLimitHeaders(headers: Headers): Record<string, string> {
  const found: Record<string, string> = {};
  for (const name of RATE_LIMIT_HEADER_NAMES) {
    const val = headers.get(name);
    if (val) found[name] = val;
  }
  return found;
}

/**
 * Logs Gemini API token usage and per-key status after a Gemini endpoint is hit.
 * Note: Google's Gemini API does not return remaining token quota in responses;
 * if GEMINI_DAILY_TOKEN_LIMIT is set, remaining tokens are estimated from
 * in-memory daily totals per key.
 */
export function logGeminiApiUsage(params: {
  api: "generate" | "embed";
  model: string;
  keyIndex: number;
  status: number;
  headers: Headers;
  usageMetadata?: GeminiUsageMetadata;
}): void {
  const keys = getConfiguredApiKeys();
  const state = getKeyState();
  const now = Date.now();
  const usage = getOrResetDailyUsage(state, params.keyIndex);

  const totalTokens = params.usageMetadata?.totalTokenCount ?? 0;
  if (params.api === "generate") {
    usage.generateTokens += totalTokens;
  } else {
    usage.embedRequests += 1;
    if (totalTokens > 0) {
      usage.generateTokens += totalTokens;
    }
  }

  const rateHeaders = extractRateLimitHeaders(params.headers);
  if (Object.keys(rateHeaders).length > 0) {
    usage.lastRateLimitHeaders = rateHeaders;
  }

  const configuredLimit = Number(process.env.GEMINI_DAILY_TOKEN_LIMIT || "0");
  const hasLimit = Number.isFinite(configuredLimit) && configuredLimit > 0;

  const allKeysSummary = keys.map((_, idx) => {
    const keyUsage = getOrResetDailyUsage(state, idx);
    const cooldownUntil = state.cooldownUntil[idx] ?? 0;
    const cooldownSec =
      cooldownUntil > now ? Math.ceil((cooldownUntil - now) / 1000) : 0;

    return {
      key: getKeyLabel(idx),
      active: idx === state.activeIndex,
      cooldownSec,
      tokensUsedToday: keyUsage.generateTokens,
      tokensLeftToday: hasLimit
        ? Math.max(0, configuredLimit - keyUsage.generateTokens)
        : "unknown (not returned by Gemini API)",
      embedRequestsToday: keyUsage.embedRequests,
      ...(keyUsage.lastRateLimitHeaders
        ? { rateLimitHeaders: keyUsage.lastRateLimitHeaders }
        : {}),
    };
  });

  console.info(
    `[Gemini Monitor] api=${params.api} model=${params.model} key=${getKeyLabel(
      params.keyIndex
    )} status=${params.status}`,
    JSON.stringify({
      requestUsage: params.usageMetadata ?? null,
      rateLimitHeaders: Object.keys(rateHeaders).length > 0 ? rateHeaders : null,
      apis: allKeysSummary,
    })
  );
}

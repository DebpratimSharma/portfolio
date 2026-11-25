import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { CHAT_CONFIG } from "./chat/config";

export type RateLimitResult = {
  allowed: boolean;
  reason?: "ip_window" | "ip_daily" | "global_daily" | "limiter_unavailable";
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __upstashRedis?: Redis;
  __ipWindowLimiter?: Ratelimit;
  __ipDailyLimiter?: Ratelimit;
};

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!globalForRateLimit.__upstashRedis) {
    globalForRateLimit.__upstashRedis = new Redis({ url, token });
  }
  return globalForRateLimit.__upstashRedis;
}

function getLimiters(redis: Redis) {
  if (!globalForRateLimit.__ipWindowLimiter) {
    globalForRateLimit.__ipWindowLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        CHAT_CONFIG.IP_WINDOW_LIMIT,
        `${CHAT_CONFIG.IP_WINDOW_SECONDS} s`
      ),
      prefix: "portfolio_chat:ip_win",
    });
  }

  if (!globalForRateLimit.__ipDailyLimiter) {
    globalForRateLimit.__ipDailyLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(CHAT_CONFIG.IP_DAILY_LIMIT, "1 d"),
      prefix: "portfolio_chat:ip_day",
    });
  }

  return {
    ipWindow: globalForRateLimit.__ipWindowLimiter,
    ipDaily: globalForRateLimit.__ipDailyLimiter,
  };
}

/**
 * Checks per-IP short-window, per-IP daily, and global daily request budgets.
 * Fails closed in production if Upstash Redis is unconfigured or unreachable,
 * unless RATELIMIT_FAIL_OPEN=true is explicitly set for local development.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const failOpen = process.env.RATELIMIT_FAIL_OPEN === "true";
  const redis = getRedisClient();

  if (!redis) {
    if (failOpen && process.env.NODE_ENV !== "production") {
      return { allowed: true };
    }
    return { allowed: false, reason: "limiter_unavailable" };
  }

  try {
    const { ipWindow, ipDaily } = getLimiters(redis);

    const [winRes, dayRes] = await Promise.all([
      ipWindow.limit(ip),
      ipDaily.limit(ip),
    ]);

    if (!winRes.success) {
      return { allowed: false, reason: "ip_window" };
    }
    if (!dayRes.success) {
      return { allowed: false, reason: "ip_daily" };
    }

    const dailyBudget =
      Number(process.env.CHAT_DAILY_BUDGET) || CHAT_CONFIG.DEFAULT_DAILY_BUDGET;
    const todayKey = `portfolio_chat:global_day:${new Date().toISOString().slice(0, 10)}`;

    const currentCount = await redis.incr(todayKey);
    if (currentCount === 1) {
      await redis.expire(todayKey, 60 * 60 * 25);
    }

    if (currentCount > dailyBudget) {
      return { allowed: false, reason: "global_daily" };
    }

    return { allowed: true };
  } catch (err) {
    console.error("Rate limiter error:", err);
    if (failOpen && process.env.NODE_ENV !== "production") {
      return { allowed: true };
    }
    return { allowed: false, reason: "limiter_unavailable" };
  }
}

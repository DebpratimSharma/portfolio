import { NextResponse, type NextRequest } from "next/server";
import { CHAT_CONFIG } from "@/lib/chat/config";
import { ChatRequestSchema, type ChatResponse } from "@/lib/chat/schema";
import { FIXED_RESPONSES } from "@/lib/chat/responses";
import { checkScope } from "@/lib/chat/scope";
import {
  retrievePassages,
  meetsEvidenceThreshold,
} from "@/lib/chat/retrieve";
import { generateAnswer, streamAnswer } from "@/lib/chat/generate";
import {
  validateModelOutput,
  validateStreamedOutput,
} from "@/lib/chat/validate";
import { checkRateLimit } from "@/lib/ratelimit";

export const maxDuration = 30;

const RESPONSE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_ENTRIES = 200;

type CachedChatEntry = {
  response: ChatResponse;
  expiresAt: number;
};

const globalForChatCache = globalThis as typeof globalThis & {
  __portfolioChatResponseCache?: Map<string, CachedChatEntry>;
};

function getResponseCache(): Map<string, CachedChatEntry> {
  if (!globalForChatCache.__portfolioChatResponseCache) {
    globalForChatCache.__portfolioChatResponseCache = new Map();
  }
  return globalForChatCache.__portfolioChatResponseCache;
}

function getCacheKey(
  question: string,
  recentTurns: { role: "user" | "assistant"; content: string }[]
): string {
  const normQ = question.trim().toLowerCase().replace(/\s+/g, " ");
  // Standalone questions (or repeating an already-asked question) share the same cache key.
  const isStandalone =
    recentTurns.length === 0 ||
    (question.split(/\s+/).length > 8 &&
      !/\b(it|that|this|they|them|those|other|more|details)\b/i.test(question));
  if (isStandalone) {
    return `${CHAT_CONFIG.PROMPT_VERSION}::${normQ}`;
  }
  const turnsKey = recentTurns
    .map((t) => `${t.role}:${t.content.trim().toLowerCase().slice(0, 120)}`)
    .join("|");
  return `${CHAT_CONFIG.PROMPT_VERSION}::${normQ}::${turnsKey}`;
}

function jsonResponse(payload: ChatResponse, statusCode = 200) {
  return NextResponse.json(payload, { status: statusCode });
}

function ndjsonSingleResponse(payload: ChatResponse) {
  return new Response(
    JSON.stringify({ type: "final", response: payload }) + "\n",
    {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    }
  );
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
}

function isOriginAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) {
    // Allow same-origin requests without Origin header only in dev
    return process.env.NODE_ENV !== "production";
  }

  const host = req.headers.get("host");
  if (host && (origin === `https://${host}` || origin === `http://${host}`)) {
    return true;
  }

  const allowed = (process.env.CHAT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return allowed.includes(origin);
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Feature flag off
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: ip,
        }),
      }
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

function resolveFollowUpQuery(
  question: string,
  recentTurns: { role: "user" | "assistant"; content: string }[]
): string {
  if (recentTurns.length === 0) return question;
  const lastUserTurn = [...recentTurns]
    .reverse()
    .find((t) => t.role === "user");
  if (!lastUserTurn) return question;

  // Heuristic: only prepend prior user context for short/pronoun follow-ups
  const isFollowUp =
    question.split(/\s+/).length <= 8 ||
    /\b(it|that|this|they|them|those|other|more|details)\b/i.test(question);

  return isFollowUp ? `${lastUserTurn.content} — ${question}` : question;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Body size check
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (contentLength > CHAT_CONFIG.MAX_BODY_BYTES) {
      return jsonResponse(FIXED_RESPONSES.error(), 413);
    }

    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, "utf8") > CHAT_CONFIG.MAX_BODY_BYTES) {
      return jsonResponse(FIXED_RESPONSES.error(), 413);
    }

    let bodyJson: unknown;
    try {
      bodyJson = JSON.parse(rawBody);
    } catch {
      return jsonResponse(FIXED_RESPONSES.error(), 400);
    }

    // 2. Origin check
    if (!isOriginAllowed(req)) {
      return jsonResponse(FIXED_RESPONSES.refused(), 403);
    }

    // 3. Zod validation
    const parsedReq = ChatRequestSchema.safeParse(bodyJson);
    if (!parsedReq.success) {
      return jsonResponse(
        {
          status: "error",
          answer:
            parsedReq.error.issues[0]?.message ||
            "Invalid request format.",
          citations: [],
        },
        400
      );
    }

    const { question, recentTurns, turnstileToken, stream } = parsedReq.data;
    const ip = getClientIp(req);

    // 4. Optional Turnstile verification
    const turnstileOk = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileOk) {
      return jsonResponse(FIXED_RESPONSES.refused(), 403);
    }

    // 5. Rate limiting (per-IP + global daily budget)
    const rateRes = await checkRateLimit(ip);
    if (!rateRes.allowed) {
      return jsonResponse(FIXED_RESPONSES.rateLimited(), 429);
    }

    const respond = (payload: ChatResponse) =>
      stream ? ndjsonSingleResponse(payload) : jsonResponse(payload);

    // 6. Scope gate (before retrieval and LLM)
    const scope = checkScope(question);
    if (scope.action === "greeting") {
      return respond(FIXED_RESPONSES.greeting());
    }
    if (scope.action === "identity") {
      return respond(FIXED_RESPONSES.identity());
    }
    if (scope.action === "capabilities") {
      return respond(FIXED_RESPONSES.capabilities());
    }
    if (scope.action === "personal") {
      return respond(FIXED_RESPONSES.abstained());
    }
    if (scope.action === "refuse") {
      return respond(FIXED_RESPONSES.refused());
    }

    // 6b. Check in-memory response cache for identical/repeated questions
    const cache = getResponseCache();
    const cacheKey = getCacheKey(question, recentTurns);
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return respond(cached.response);
    }

    // 7. Streaming path (NDJSON)
    if (stream) {
      const encoder = new TextEncoder();
      const CITATION_MARKER = "---CITATIONS---";
      const INSUFFICIENT_TOKEN = "INSUFFICIENT_EVIDENCE";

      const readable = new ReadableStream({
        async start(controller) {
          const send = (obj: unknown) => {
            controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
          };

          try {
            const resolvedQuery = resolveFollowUpQuery(question, recentTurns);
            const retrieval = await retrievePassages(
              resolvedQuery,
              CHAT_CONFIG.TOP_K,
              req.signal
            );

            if (!meetsEvidenceThreshold(retrieval)) {
              send({ type: "final", response: FIXED_RESPONSES.abstained() });
              controller.close();
              return;
            }

            let fullRaw = "";
            let sentLen = 0;
            let confirmedAnswer = false;
            let hitCitations = false;

            for await (const delta of streamAnswer({
              question,
              recentTurns,
              passages: retrieval.passages,
              signal: req.signal,
            })) {
              fullRaw += delta;

              if (hitCitations) continue;

              // Wait until we know it's not INSUFFICIENT_EVIDENCE before streaming to UI
              if (!confirmedAnswer) {
                const trimmed = fullRaw.trimStart();
                if (
                  trimmed.length < INSUFFICIENT_TOKEN.length &&
                  INSUFFICIENT_TOKEN.startsWith(trimmed)
                ) {
                  continue;
                }
                if (trimmed.startsWith(INSUFFICIENT_TOKEN)) {
                  send({ type: "final", response: FIXED_RESPONSES.abstained() });
                  controller.close();
                  return;
                }
                confirmedAnswer = true;
              }

              const markerIdx = fullRaw.indexOf(CITATION_MARKER);
              if (markerIdx !== -1) {
                hitCitations = true;
                const safeEnd = Math.max(sentLen, markerIdx);
                const tail = fullRaw.slice(sentLen, safeEnd).replace(/\s+$/, "");
                if (tail) {
                  send({ type: "delta", text: tail });
                }
                sentLen = safeEnd;
                continue;
              }

              // Hold back enough characters so a split `---CITATIONS---` never flashes
              const safeEnd = Math.max(sentLen, fullRaw.length - CITATION_MARKER.length);
              if (safeEnd > sentLen) {
                send({ type: "delta", text: fullRaw.slice(sentLen, safeEnd) });
                sentLen = safeEnd;
              }
            }

            const trimmedRaw = fullRaw.trim();
            if (!trimmedRaw || trimmedRaw.startsWith(INSUFFICIENT_TOKEN)) {
              send({ type: "final", response: FIXED_RESPONSES.abstained() });
              controller.close();
              return;
            }

            const markerIdx = fullRaw.indexOf(CITATION_MARKER);
            let answerPart = fullRaw;
            let citationIds: string[] = [];

            if (markerIdx !== -1) {
              answerPart = fullRaw.slice(0, markerIdx).trim();
              const metaRaw = fullRaw
                .slice(markerIdx + CITATION_MARKER.length)
                .trim()
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/\s*```$/, "");
              try {
                const parsedIds = JSON.parse(metaRaw);
                if (Array.isArray(parsedIds)) {
                  citationIds = parsedIds.filter(
                    (x): x is string => typeof x === "string"
                  );
                }
              } catch {
                citationIds = [];
              }
            }

            const validated = validateStreamedOutput(
              answerPart,
              citationIds,
              retrieval.passages
            );

            if (validated.status === "answered") {
              if (cache.size >= MAX_CACHE_ENTRIES) {
                const oldestKey = cache.keys().next().value;
                if (oldestKey !== undefined) cache.delete(oldestKey);
              }
              cache.set(cacheKey, {
                response: validated,
                expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
              });
            }

            send({ type: "final", response: validated });
          } catch (err) {
            const isAbort = err instanceof Error && err.name === "AbortError";
            if (!isAbort) {
              console.error(
                "Chat stream error:",
                err instanceof Error ? err.message : "unknown"
              );
              try {
                send({ type: "final", response: FIXED_RESPONSES.error() });
              } catch {
                // Stream already closed
              }
            }
          } finally {
            try {
              controller.close();
            } catch {
              // Already closed
            }
          }
        },
      });

      return new Response(readable, {
        status: 200,
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    }

    // 7b. Non-streaming path (used by evals & direct JSON callers)
    const resolvedQuery = resolveFollowUpQuery(question, recentTurns);
    const retrieval = await retrievePassages(resolvedQuery, CHAT_CONFIG.TOP_K);

    // 8. Evidence threshold check (abstain without LLM call if weak)
    if (!meetsEvidenceThreshold(retrieval)) {
      return jsonResponse(FIXED_RESPONSES.abstained());
    }

    // 9. Generation — no server-side timeout; the platform maxDuration ceiling applies.
    const rawModelOutput = await generateAnswer({
      question,
      recentTurns,
      passages: retrieval.passages,
      signal: req.signal,
    });

    // 10. Validate & return DB-sourced citations
    const validated = validateModelOutput(rawModelOutput, retrieval.passages);
    if (validated.status === "answered") {
      if (cache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey !== undefined) cache.delete(oldestKey);
      }
      cache.set(cacheKey, {
        response: validated,
        expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
      });
    }
    return jsonResponse(validated);
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error("Chat route error:", err instanceof Error ? err.message : "unknown");
    return jsonResponse(FIXED_RESPONSES.error(), isAbort ? 504 : 500);
  }
}

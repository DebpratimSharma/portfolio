import { NextResponse, type NextRequest } from "next/server";
import { CHAT_CONFIG } from "@/lib/chat/config";
import { ChatRequestSchema, type ChatResponse } from "@/lib/chat/schema";
import { FIXED_RESPONSES } from "@/lib/chat/responses";
import { checkScope } from "@/lib/chat/scope";
import {
  retrievePassages,
  meetsEvidenceThreshold,
} from "@/lib/chat/retrieve";
import { generateAnswer } from "@/lib/chat/generate";
import { validateModelOutput } from "@/lib/chat/validate";
import { checkRateLimit } from "@/lib/ratelimit";

export const maxDuration = 30;

function jsonResponse(payload: ChatResponse, statusCode = 200) {
  return NextResponse.json(payload, { status: statusCode });
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

    const { question, recentTurns, turnstileToken } = parsedReq.data;
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

    // 6. Scope gate (before retrieval and LLM)
    const scope = checkScope(question);
    if (scope.action === "greeting") {
      return jsonResponse(FIXED_RESPONSES.greeting());
    }
    if (scope.action === "capabilities") {
      return jsonResponse(FIXED_RESPONSES.capabilities());
    }
    if (scope.action === "refuse") {
      return jsonResponse(FIXED_RESPONSES.refused());
    }

    // 7. Follow-up resolution + Retrieval
    const resolvedQuery = resolveFollowUpQuery(question, recentTurns);
    const retrieval = await retrievePassages(resolvedQuery);

    // 8. Evidence threshold check (abstain without LLM call if weak)
    if (!meetsEvidenceThreshold(retrieval)) {
      return jsonResponse(FIXED_RESPONSES.abstained());
    }

    // 9. Generation with timeout
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      CHAT_CONFIG.LLM_TIMEOUT_MS
    );

    let rawModelOutput: unknown;
    try {
      rawModelOutput = await generateAnswer({
        question,
        recentTurns,
        passages: retrieval.passages,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    // 10. Validate & return DB-sourced citations
    const validated = validateModelOutput(rawModelOutput, retrieval.passages);
    return jsonResponse(validated);
  } catch (err) {
    console.error("Chat route error:", err instanceof Error ? err.message : "unknown");
    return jsonResponse(FIXED_RESPONSES.error(), 500);
  }
}

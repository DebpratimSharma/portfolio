"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ExternalLink, RotateCcw, Sparkles, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./useChat";

const SUGGESTED_QUESTIONS = [
  "What is TellWeb and how does it prevent spam?",
  "Tell me about Debpratim's work at Narratives Creative Labs.",
  "What tech stack does he use for production apps?",
  "Is Debpratim available for full-time or freelance roles?",
];

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  canRetry: boolean;
  onSelectSuggestion: (q: string) => void;
  onRetry: () => void;
}

export function ChatMessages({
  messages,
  isLoading,
  canRetry,
  onSelectSuggestion,
  onRetry,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [messages, isLoading, prefersReducedMotion]);

  return (
    <div
      data-lenis-prevent
      aria-live="polite"
      aria-label="Conversation messages"
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain"
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col justify-between py-2">
          <div className="space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono uppercase tracking-wider text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Evidence-Grounded Assistant</span>
            </div>
            <h3 className="font-syne text-lg font-semibold text-white">
              Ask about Debpratim&apos;s work
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Answers are grounded strictly in Debpratim&apos;s portfolio
              projects, engineering experience, and skills—with source
              citations.
            </p>
          </div>

          <div className="space-y-2 pt-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              Suggested questions
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onSelectSuggestion(q)}
                  className="text-left text-xs sm:text-sm text-neutral-200 px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const isRefusalOrLimit =
              msg.status === "refused" || msg.status === "rate_limited";

            return (
              <motion.div
                key={msg.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                className={cn(
                  "flex flex-col gap-2",
                  isUser ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    isUser
                      ? "bg-white text-black font-medium rounded-br-sm"
                      : isRefusalOrLimit
                      ? "bg-amber-500/10 border border-amber-500/25 text-amber-100 rounded-bl-sm"
                      : msg.isError
                      ? "bg-red-500/10 border border-red-500/25 text-red-200 rounded-bl-sm"
                      : "bg-white/[0.05] border border-white/10 text-neutral-100 rounded-bl-sm"
                  )}
                >
                  {isRefusalOrLimit && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-300 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>
                        {msg.status === "rate_limited"
                          ? "Rate Limit"
                          : "Out of Scope"}
                      </span>
                    </div>
                  )}
                  <p>{msg.content}</p>
                </div>

                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div
                    aria-label="Sources"
                    className="flex flex-wrap gap-1.5 max-w-[90%]"
                  >
                    {msg.citations.map((c) =>
                      c.url ? (
                        <a
                          key={c.id}
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        >
                          <span>{c.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span
                          key={c.id}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] bg-white/[0.04] border border-white/10 text-neutral-400"
                        >
                          {c.title}
                        </span>
                      )
                    )}
                  </div>
                )}

                {!isUser && msg.isError && canRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                )}
              </motion.div>
            );
          })}

          {isLoading && (
            <div className="flex items-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.05] border border-white/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                <span className="sr-only">ACE is thinking</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}

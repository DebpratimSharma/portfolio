"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, RotateCcw } from "lucide-react";
import { useChat, type ChatMessage } from "./useChat";
import type { Citation } from "@/lib/chat/schema";
import {
  ThinkingPromptInput,
  type ThinkingStatus,
  type ThinkingStep,
  type ThinkingSubmitOptions,
} from "@/components/ui/thinking-prompt-input";

const SUGGESTED_QUESTIONS = [
  "What is TellWeb and how does it prevent spam?",
  "Tell me about Debpratim's work at Narratives Creative Labs.",
  "What tech stack does he use for production apps?",
  "Is Debpratim available for full-time or freelance roles?",
];

const INITIAL_STEPS: ThinkingStep[] = [
  { id: "search", text: "Searching portfolio…", status: "active" },
  { id: "context", text: "Gathering context…", status: "active" },
  { id: "draft", text: "Drafting answer…", status: "active" },
];

function CitationList({ citations }: { citations: Citation[] }) {
  if (!citations.length) return null;
  return (
    <div aria-label="References" className="pt-2 flex flex-wrap items-center gap-2">
      {citations.map((c) =>
        c.url ? (
          <a
            key={c.id}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/[0.06] hover:bg-white/[0.12] text-white/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <span>{c.title}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        ) : (
          <span
            key={c.id}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/[0.06] text-white/60"
          >
            {c.title}
          </span>
        )
      )}
    </div>
  );
}

export default function ChatPanel() {
  const { messages, isLoading, canRetry, sendMessage, retryLast, abort, clear } =
    useChat();

  const [uiStatus, setUiStatus] = useState<ThinkingStatus>("idle");
  const [activePrompt, setActivePrompt] = useState("");
  const [think, setThink] = useState(true);
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const lastAssistantIdRef = useRef<string | null>(null);
  const streamTimerRef = useRef<number | null>(null);

  const latestAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  // Messages belonging to earlier turns (everything before the current turn).
  const previousMessages: ChatMessage[] = (() => {
    if (uiStatus === "idle" || messages.length === 0) return [];
    const last = messages[messages.length - 1];
    if (isLoading || last.role === "user") {
      return messages.slice(0, -1);
    }
    return messages.slice(0, -2);
  })();

  // Derive live streaming UI state during render to avoid cascading setState in effects.
  const lastMessage = messages[messages.length - 1];
  const isActivelyStreaming = Boolean(isLoading && latestAssistant?.isStreaming);
  const isFinishedStream = Boolean(
    !isLoading &&
      uiStatus !== "idle" &&
      lastMessage?.role === "assistant" &&
      lastMessage.wasStreamed
  );

  const effectiveUiStatus: ThinkingStatus = isActivelyStreaming
    ? "answering"
    : isFinishedStream
      ? "done"
      : uiStatus;

  const effectiveDisplayedAnswer =
    isActivelyStreaming || isFinishedStream
      ? (latestAssistant?.content ?? "")
      : displayedAnswer;

  const effectiveSteps: ThinkingStep[] =
    isActivelyStreaming || isFinishedStream
      ? think
        ? (steps.length ? steps : INITIAL_STEPS).map((s) => ({
            ...s,
            status: "complete",
          }))
        : []
      : steps;

  // Tick elapsed seconds and advance thinking steps while waiting for the first token.
  useEffect(() => {
    if (effectiveUiStatus !== "thinking") return;

    const start = Date.now();
    const secondInterval = window.setInterval(() => {
      setElapsedSeconds(Math.max(1, Math.floor((Date.now() - start) / 1000)));
    }, 900);

    const t1 = window.setTimeout(() => {
      setSteps([
        { ...INITIAL_STEPS[0], status: "complete" },
        { ...INITIAL_STEPS[1], status: "active" },
      ]);
    }, 650);

    const t2 = window.setTimeout(() => {
      setSteps([
        { ...INITIAL_STEPS[0], status: "complete" },
        { ...INITIAL_STEPS[1], status: "complete" },
        { ...INITIAL_STEPS[2], status: "active" },
      ]);
    }, 1450);

    return () => {
      window.clearInterval(secondInterval);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [effectiveUiStatus]);

  // Reveal non-streamed responses (e.g. cached/fixed/error) once the API request completes.
  useEffect(() => {
    if (isLoading || !latestAssistant) return;
    if (latestAssistant.wasStreamed) {
      lastAssistantIdRef.current = latestAssistant.id;
      return;
    }
    if (latestAssistant.id === lastAssistantIdRef.current) return;

    lastAssistantIdRef.current = latestAssistant.id;
    const fullText = latestAssistant.content;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const startTimer = window.setTimeout(() => {
      if (think) {
        setSteps((prev) =>
          (prev.length ? prev : INITIAL_STEPS).map((s) => ({
            ...s,
            status: "complete",
          }))
        );
      } else {
        setSteps([]);
      }

      if (reducedMotion || !fullText) {
        setDisplayedAnswer(fullText);
        setUiStatus("done");
        return;
      }

      setUiStatus("answering");
      setDisplayedAnswer("");

      let index = 0;
      const stepSize = Math.max(3, Math.ceil(fullText.length / 45));
      streamTimerRef.current = window.setInterval(() => {
        index += stepSize;
        if (index >= fullText.length) {
          setDisplayedAnswer(fullText);
          setUiStatus("done");
          if (streamTimerRef.current !== null) {
            window.clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
          }
        } else {
          setDisplayedAnswer(fullText.slice(0, index));
        }
      }, 20);
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      if (streamTimerRef.current !== null) {
        window.clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    };
  }, [isLoading, latestAssistant, think]);

  function handleSubmit(prompt: string, options: ThinkingSubmitOptions) {
    if (streamTimerRef.current !== null) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setActivePrompt(prompt);
    setDisplayedAnswer("");
    setElapsedSeconds(0);
    setSteps(options.think ? [{ ...INITIAL_STEPS[0], status: "active" }] : []);
    setUiStatus(options.think ? "thinking" : "answering");
    void sendMessage(prompt);
  }

  function handleStop() {
    if (streamTimerRef.current !== null) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    abort();
    if (latestAssistant && displayedAnswer) {
      setUiStatus("done");
    } else {
      setUiStatus("idle");
      setInputValue(activePrompt);
    }
  }

  function handleRetry() {
    if (streamTimerRef.current !== null) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setDisplayedAnswer("");
    setElapsedSeconds(0);
    setSteps(think ? [{ ...INITIAL_STEPS[0], status: "active" }] : []);
    setUiStatus(think ? "thinking" : "answering");
    retryLast();
  }

  function handleClear() {
    if (streamTimerRef.current !== null) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    lastAssistantIdRef.current = null;
    setUiStatus("idle");
    setActivePrompt("");
    setSteps([]);
    setDisplayedAnswer("");
    setElapsedSeconds(0);
    setInputValue("");
    clear();
  }

  const showCitations =
    effectiveUiStatus === "done" &&
    latestAssistant &&
    !latestAssistant.isError &&
    latestAssistant.citations &&
    latestAssistant.citations.length > 0;

  const showRetry =
    effectiveUiStatus === "done" && latestAssistant?.isError && canRetry;

  const historyNode =
    previousMessages.length > 0 ? (
      <div className="space-y-5">
        {previousMessages.map((msg) =>
          msg.role === "user" ? (
            <div
              key={msg.id}
              className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-white/[0.08] px-4 py-2.5 text-sm leading-6 text-white"
            >
              <p className="break-words">{msg.content}</p>
            </div>
          ) : (
            <div key={msg.id} className="min-w-0 space-y-2.5 break-words text-sm leading-6 text-white/90">
              {msg.content.split("\n").filter(Boolean).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              {!msg.isError && msg.citations && msg.citations.length > 0 && (
                <CitationList citations={msg.citations} />
              )}
            </div>
          )
        )}
      </div>
    ) : null;

  const answerFooterNode =
    showCitations || showRetry ? (
      <div className="pt-1 flex flex-wrap items-center gap-2">
        {showCitations && <CitationList citations={latestAssistant.citations!} />}
        {showRetry && (
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    ) : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-black px-5 pb-5 pt-2 font-syne">
      {uiStatus !== "idle" && (
        <div className="flex justify-end pb-2 shrink-0">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1 text-xs text-white/70 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <RotateCcw className="w-3 h-3" />
            <span>New chat</span>
          </button>
        </div>
      )}

      {uiStatus === "idle" && (
        <div className="flex-1 min-h-0 flex flex-col justify-end pb-5">
          <div className="flex flex-col gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSubmit(q, { think })}
                className="text-left text-xs sm:text-sm text-white/80 hover:text-white px-4 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={
          uiStatus === "idle"
            ? "shrink-0"
            : "flex-1 min-h-0 flex flex-col"
        }
      >
        <ThinkingPromptInput
          status={effectiveUiStatus}
          prompt={activePrompt}
          steps={effectiveSteps}
          answer={effectiveDisplayedAnswer}
          elapsedSeconds={elapsedSeconds}
          value={inputValue}
          onValueChange={setInputValue}
          think={think}
          onThinkChange={setThink}
          onSubmit={handleSubmit}
          onStop={handleStop}
          history={historyNode}
          answerFooter={answerFooterNode}
          placeholder="Ask anything"
          followUpPlaceholder="Ask a follow-up"
          className="max-w-none"
        />
      </div>
    </div>
  );
}

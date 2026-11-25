"use client";

import { useState, useRef, useCallback } from "react";
import { CHAT_CONFIG } from "@/lib/chat/config";
import type { ChatResponse, ChatStatus, ChatTurn, Citation } from "@/lib/chat/schema";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: ChatStatus;
  citations?: Citation[];
  isError?: boolean;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedQuestion, setLastFailedQuestion] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (rawQuestion: string) => {
      const question = rawQuestion.trim();
      if (!question || isLoading) return;

      setLastFailedQuestion(null);

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: question,
      };

      const recentTurns: ChatTurn[] = messages
        .filter((m) => !m.isError)
        .slice(-CHAT_CONFIG.MAX_RECENT_TURNS)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, CHAT_CONFIG.MAX_TURN_CHARS),
        }));

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, recentTurns }),
          signal: controller.signal,
        });

        const data = (await res.json()) as ChatResponse;

        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          status: data.status,
          citations: data.citations ?? [],
          isError: data.status === "error",
        };

        if (data.status === "error") {
          setLastFailedQuestion(question);
        }

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: "assistant",
              content: "Request cancelled.",
              status: "abstained",
            },
          ]);
        } else {
          setLastFailedQuestion(question);
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: "assistant",
              content:
                "Could not reach the assistant right now. Please check your connection and retry.",
              status: "error",
              isError: true,
            },
          ]);
        }
      } finally {
        abortRef.current = null;
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const retryLast = useCallback(() => {
    if (!lastFailedQuestion || isLoading) return;
    const q = lastFailedQuestion;
    setMessages((prev) => prev.slice(0, -1));
    void sendMessage(q);
  }, [isLoading, lastFailedQuestion, sendMessage]);

  const clear = useCallback(() => {
    abort();
    setMessages([]);
    setLastFailedQuestion(null);
  }, [abort]);

  return {
    messages,
    isLoading,
    canRetry: Boolean(lastFailedQuestion),
    sendMessage,
    retryLast,
    abort,
    clear,
  };
}

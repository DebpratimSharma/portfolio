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
  isStreaming?: boolean;
  wasStreamed?: boolean;
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
      const assistantId = `a-${Date.now()}`;
      let receivedAnyDelta = false;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, recentTurns, stream: true }),
          signal: controller.signal,
        });

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("ndjson") || !res.body) {
          const data = (await res.json()) as ChatResponse;
          const assistantMsg: ChatMessage = {
            id: assistantId,
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
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let finalReceived = false;

        const upsertAssistant = (updater: (prev: ChatMessage | undefined) => ChatMessage) => {
          setMessages((prev) => {
            const idx = prev.findIndex((m) => m.id === assistantId);
            if (idx === -1) {
              return [...prev, updater(undefined)];
            }
            const next = [...prev];
            next[idx] = updater(prev[idx]);
            return next;
          });
        };

        const handleEvent = (line: string) => {
          const trimmed = line.trim();
          if (!trimmed) return;
          const event = JSON.parse(trimmed) as
            | { type: "delta"; text: string }
            | { type: "final"; response: ChatResponse };

          if (event.type === "delta" && event.text) {
            receivedAnyDelta = true;
            upsertAssistant((existing) => ({
              id: assistantId,
              role: "assistant",
              content: (existing?.content ?? "") + event.text,
              status: "answered",
              isStreaming: true,
              wasStreamed: true,
            }));
          } else if (event.type === "final") {
            finalReceived = true;
            const data = event.response;
            if (data.status === "error") {
              setLastFailedQuestion(question);
            }
            upsertAssistant((existing) => ({
              id: assistantId,
              role: "assistant",
              content: data.answer,
              status: data.status,
              citations: data.citations ?? [],
              isError: data.status === "error",
              isStreaming: false,
              wasStreamed: existing?.wasStreamed ?? false,
            }));
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            handleEvent(line);
          }
        }
        if (buffer.trim()) {
          handleEvent(buffer);
        }

        if (!finalReceived && receivedAnyDelta) {
          upsertAssistant((existing) => ({
            ...(existing ?? { id: assistantId, role: "assistant", content: "" }),
            isStreaming: false,
          }));
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setMessages((prev) => {
            const idx = prev.findIndex((m) => m.id === assistantId);
            if (idx !== -1 && prev[idx].content) {
              const next = [...prev];
              next[idx] = { ...next[idx], isStreaming: false };
              return next;
            }
            return [
              ...prev,
              {
                id: assistantId,
                role: "assistant",
                content: "Stopped.",
                status: "abstained",
              },
            ];
          });
        } else {
          setLastFailedQuestion(question);
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== assistantId),
            {
              id: assistantId,
              role: "assistant",
              content: "Could not reach the assistant right now. Please check your connection and retry.",
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

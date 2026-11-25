"use client";

import React, { useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { CHAT_CONFIG } from "@/lib/chat/config";

interface ChatInputProps {
  isLoading: boolean;
  onSend: (question: string) => void;
  onAbort: () => void;
}

export function ChatInput({ isLoading, onSend, onAbort }: ChatInputProps) {
  const [value, setValue] = useState("");

  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSend(trimmed);
        setValue("");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-white/10 bg-neutral-950/90"
    >
      <label htmlFor="ace-chat-input" className="sr-only">
        Ask a question about Debpratim&apos;s portfolio
      </label>
      <div className="flex items-end gap-2 rounded-2xl bg-white/[0.04] border border-white/10 focus-within:border-white/30 px-3 py-2 transition-colors">
        <textarea
          id="ace-chat-input"
          rows={1}
          value={value}
          maxLength={CHAT_CONFIG.MAX_QUESTION_CHARS}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about projects, stack, experience..."
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none max-h-28 py-1.5"
        />

        {isLoading ? (
          <button
            type="button"
            onClick={onAbort}
            aria-label="Stop generating"
            className="shrink-0 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="shrink-0 w-8 h-8 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-neutral-500 font-mono">
        <span>Grounded in portfolio sources</span>
        <span>
          {value.length}/{CHAT_CONFIG.MAX_QUESTION_CHARS}
        </span>
      </div>
    </form>
  );
}

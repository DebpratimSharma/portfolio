"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { useChat } from "./useChat";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

export default function ChatPanel() {
  const { messages, isLoading, canRetry, sendMessage, retryLast, abort, clear } =
    useChat();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {messages.length > 0 && (
        <div className="flex justify-end px-4 pt-2">
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded px-1.5 py-0.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>New chat</span>
          </button>
        </div>
      )}

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        canRetry={canRetry}
        onSelectSuggestion={sendMessage}
        onRetry={retryLast}
      />

      <ChatInput isLoading={isLoading} onSend={sendMessage} onAbort={abort} />
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
  timestamp?: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * MessageBubble component for displaying chat messages
 * with support for user and AI messages, loading state, and timestamps.
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isUser = false,
  timestamp,
  isLoading = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[80%] md:max-w-[70%] rounded-lg p-4",
        isUser
          ? "bg-primary text-primary-foreground self-end"
          : "bg-secondary text-secondary-foreground self-start",
        className
      )}
    >
      {isLoading ? (
        <div className="flex space-x-2 items-center">
          <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
        </div>
      ) : (
        <>
          <div className="whitespace-pre-wrap break-words">{content}</div>
          {timestamp && (
            <div className="text-xs opacity-70 mt-1 self-end">{timestamp}</div>
          )}
        </>
      )}
    </div>
  );
};

export { MessageBubble }; 
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { debugLog } from "@/lib/debug";

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * MessageBubble component for displaying chat messages
 * with support for user and AI messages, loading state, and timestamps.
 */
const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ content, isUser, timestamp, isLoading = false, className }, ref) => {
    // Log state changes
    React.useEffect(() => {
      debugLog('MessageBubble state', {
        isLoading,
        hasContent: !!content,
        timestamp,
        isUser
      });
    }, [isLoading, content, timestamp, isUser]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col max-w-[80%] md:max-w-[70%] rounded-lg p-3 mb-2",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          className
        )}
        data-loading={isLoading}
        data-testid="message-bubble"
      >
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Thinking...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">{content}</div>
          )}
          {timestamp && (
            <div
              className={cn(
                "text-xs opacity-50",
                isUser ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {timestamp}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export { MessageBubble };
export type { MessageBubbleProps }; 
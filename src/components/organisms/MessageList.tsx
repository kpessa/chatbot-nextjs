"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/components/molecules/MessageBubble";
import { FileAttachment } from "@/components/molecules/FileAttachment";

export type MessageFile = {
  name: string;
  type: string;
  url: string;
  size?: number;
};

export type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  files?: MessageFile[];
  isLoading?: boolean;
};

export interface MessageListProps {
  messages: Message[];
  className?: string;
}

/**
 * MessageList component to display chat messages
 * with support for user and AI messages, loading states, and file attachments.
 */
const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      return timestamp; // Return as is if it's already formatted
    }
  };

  return (
    <div className={cn("flex flex-col space-y-4 p-4 overflow-y-auto", className)}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex flex-col",
            message.isUser ? "items-end" : "items-start"
          )}
        >
          {/* Message bubble */}
          <MessageBubble
            content={message.content}
            isUser={message.isUser}
            timestamp={formatTimestamp(message.timestamp)}
            isLoading={message.isLoading}
          />

          {/* File attachments */}
          {message.files && message.files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 max-w-[80%] md:max-w-[70%]">
              {message.files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="w-full sm:w-48">
                  <FileAttachment file={file} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export { MessageList }; 
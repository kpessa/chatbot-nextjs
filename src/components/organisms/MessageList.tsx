"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/components/molecules/MessageBubble";
import { FileAttachment } from "@/components/molecules/FileAttachment";
import { Message } from "@/lib/types";
import { debugLog } from "@/lib/debug";

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

  // Debug log messages when they change
  React.useEffect(() => {
    messages.forEach(message => {
      debugLog('Processing message', {
        id: message.id,
        role: message.role,
        hasAttachments: !!message.attachments?.length,
        isLoading: message.isLoading
      });
    });
  }, [messages]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format timestamp
  const formatTimestamp = (timestamp: string | number | undefined) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true 
      });
    } catch (error) {
      debugLog('Error formatting timestamp', { timestamp, error });
      return '';
    }
  };

  return (
    <div className={cn("flex flex-col space-y-4 p-4 overflow-y-auto", className)}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex flex-col",
            message.role === 'user' ? "items-end" : "items-start"
          )}
        >
          {/* Message bubble */}
          <MessageBubble
            content={message.content}
            isUser={message.role === 'user'}
            timestamp={formatTimestamp(message.timestamp)}
            isLoading={message.isLoading}
          />

          {/* File attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 max-w-[80%] md:max-w-[70%]">
              {message.attachments.map((file, index) => (
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
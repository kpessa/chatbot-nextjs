"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChatHeader } from "@/components/organisms/ChatHeader";
import { MessageList, type Message } from "@/components/organisms/MessageList";
import { ChatInput } from "@/components/organisms/ChatInput";
import { type Model } from "@/components/molecules/ModelSelector";
import { Message as ChatMessage } from "@/lib/types";

export interface ChatInterfaceProps {
  title?: string;
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  messages: Message[];
  onSendMessage?: (message: string, files?: File[]) => void;
  onSettingsClick?: () => void;
  onInfoClick?: () => void;
  allowFiles?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  className?: string;
  disabled?: boolean;
}

/**
 * ChatInterface template component that combines all chat components
 * into a complete chat interface.
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  title,
  models,
  selectedModel,
  onModelChange,
  messages,
  onSendMessage,
  onSettingsClick,
  onInfoClick,
  allowFiles,
  maxFileSize,
  allowedFileTypes,
  className,
  disabled = false,
}) => {
  // Convert MessageList Message type to ChatMessage type for export
  const chatMessages: ChatMessage[] = messages.map(msg => ({
    id: msg.id,
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.content,
    timestamp: new Date(msg.timestamp).getTime(),
    attachments: msg.files?.map(file => ({
      id: file.name,
      name: file.name,
      type: file.type,
      url: file.url,
      size: file.size || 0,
    })),
    isLoading: msg.isLoading,
  }));

  return (
    <div className={cn("flex flex-col h-full border rounded-lg overflow-hidden", className)}>
      <ChatHeader
        title={title}
        models={models}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        onSettingsClick={onSettingsClick}
        onInfoClick={onInfoClick}
        messages={chatMessages}
      />
      
      <MessageList
        messages={messages}
        className="flex-1"
      />
      
      <ChatInput
        placeholder="Type your message..."
        disabled={disabled}
        allowFiles={allowFiles}
        maxFileSize={maxFileSize}
        allowedFileTypes={allowedFileTypes}
        className="border-t"
      />
    </div>
  );
};

export { ChatInterface }; 
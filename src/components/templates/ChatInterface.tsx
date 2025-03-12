"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChatHeader } from "@/components/organisms/ChatHeader";
import { MessageList, type Message } from "@/components/organisms/MessageList";
import { ChatInput } from "@/components/organisms/ChatInput";
import { type Model } from "@/components/molecules/ModelSelector";

export interface ChatInterfaceProps {
  title?: string;
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  messages: Message[];
  onSendMessage: (message: string, files?: File[]) => void;
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
  return (
    <div className={cn("flex flex-col h-full border rounded-lg overflow-hidden", className)}>
      <ChatHeader
        title={title}
        models={models}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        onSettingsClick={onSettingsClick}
        onInfoClick={onInfoClick}
      />
      
      <MessageList
        messages={messages}
        className="flex-1"
      />
      
      <ChatInput
        onSendMessage={onSendMessage}
        disabled={disabled}
        allowFiles={allowFiles}
        maxFileSize={maxFileSize}
        allowedFileTypes={allowedFileTypes}
      />
    </div>
  );
};

export { ChatInterface }; 
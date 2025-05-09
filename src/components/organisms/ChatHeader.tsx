"use client";

import * as React from "react";
import { Settings, Info, Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { ModelSelector } from "@/components/molecules/ModelSelector";
import { ExportMenu } from "@/components/molecules/ExportMenu";
import { Message, ChatModel } from "@/lib/types";

export interface ChatHeaderProps {
  title?: string;
  models: ChatModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onSettingsClick?: () => void;
  onInfoClick?: () => void;
  onClearConversation?: () => void;
  onRetry?: () => void;
  messages?: Message[];
  className?: string;
}

/**
 * ChatHeader component for the chat interface
 * with model selection, settings, and info buttons.
 */
const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "Chat",
  models,
  selectedModel,
  onModelChange,
  onSettingsClick,
  onInfoClick,
  onClearConversation,
  onRetry,
  messages = [],
  className,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between p-4 border-b bg-background",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-48">
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />
        </div>

        {messages.length > 0 && (
          <>
            <ExportMenu messages={messages} />
            
            {onRetry && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRetry}
                aria-label="Retry last message"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}

            {onClearConversation && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearConversation}
                aria-label="Clear conversation"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </>
        )}

        {onInfoClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onInfoClick}
            aria-label="Information"
          >
            <Info className="w-5 h-5" />
          </Button>
        )}

        {onSettingsClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export { ChatHeader }; 
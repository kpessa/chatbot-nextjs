"use client";

import * as React from "react";
import { Settings, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { ModelSelector, type Model } from "@/components/molecules/ModelSelector";

export interface ChatHeaderProps {
  title?: string;
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onSettingsClick?: () => void;
  onInfoClick?: () => void;
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
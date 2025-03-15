"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChatHeader } from "@/components/organisms/ChatHeader";
import { MessageList } from "@/components/organisms/MessageList";
import { ChatInput } from "@/components/organisms/ChatInput";
import { Message, Attachment, ChatModel } from "@/lib/types";
import { enableVerboseLogging, disableVerboseLogging, debugLog } from "@/lib/debug";
import { Button } from "@/components/atoms/Button";
import { Bug } from "lucide-react";
import { toast } from "sonner";

export interface ChatInterfaceProps {
  title: string;
  models: ChatModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  messages: Message[];
  onSendMessage: (message: string, attachments?: Attachment[]) => void;
  onSettingsClick?: () => void;
  onInfoClick?: () => void;
  onClearConversation?: () => void;
  onRetry?: () => void;
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
  onClearConversation,
  onRetry,
  allowFiles,
  maxFileSize,
  allowedFileTypes,
  className,
  disabled = false,
}) => {
  const [isDebugEnabled, setIsDebugEnabled] = React.useState(false);

  // Log component initialization
  React.useEffect(() => {
    debugLog('ChatInterface initialized', {
      selectedModel,
      allowFiles,
      maxFileSize,
      allowedFileTypes,
      disabled
    });
  }, [selectedModel, allowFiles, maxFileSize, allowedFileTypes, disabled]);

  // Log when messages change
  React.useEffect(() => {
    debugLog('Messages updated', {
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]
    });
  }, [messages]);

  // Log when model changes
  React.useEffect(() => {
    debugLog('Model changed', {
      newModel: selectedModel,
      availableModels: models.map(m => m.id)
    });
  }, [selectedModel, models]);

  // Convert ChatMessage type to MessageList Message type for display
  const displayMessages: Message[] = messages.map(msg => {
    debugLog('Processing message', {
      id: msg.id,
      role: msg.role,
      hasAttachments: Boolean(msg.attachments?.length)
    });
    
    return {
      id: msg.id,
      content: msg.content,
      role: msg.role,
      timestamp: msg.timestamp,
      attachments: msg.attachments,
      isLoading: msg.isLoading,
    };
  });

  // Create a wrapper for onSendMessage to convert File[] to Attachment[]
  const handleSendMessage = React.useCallback(
    (message: string, attachments?: Attachment[]) => {
      debugLog('Preparing to send message', {
        messageLength: message.length,
        attachmentCount: attachments?.length || 0,
        attachmentTypes: attachments?.map(a => a.type)
      });

      if (onSendMessage) {
        onSendMessage(message, attachments);
        debugLog('Message sent to handler', {
          timestamp: new Date().toISOString()
        });
      }
    },
    [onSendMessage]
  );

  // Toggle debug mode
  const handleToggleDebug = React.useCallback(() => {
    debugLog('Toggling debug mode', {
      currentState: isDebugEnabled,
      newState: !isDebugEnabled
    });

    if (isDebugEnabled) {
      disableVerboseLogging();
      toast("Debug mode disabled");
    } else {
      enableVerboseLogging();
      toast("Debug mode enabled. Check console for API logs.");
    }
    setIsDebugEnabled(!isDebugEnabled);
  }, [isDebugEnabled]);

  // Log when component is disabled/enabled
  React.useEffect(() => {
    debugLog('Component state changed', {
      disabled,
      isDebugEnabled
    });
  }, [disabled, isDebugEnabled]);

  return (
    <div className={cn("flex flex-col h-full border rounded-lg overflow-hidden", className)}>
      <ChatHeader
        title={title}
        models={models}
        selectedModel={selectedModel}
        onModelChange={(modelId) => {
          debugLog('Model selection changed', { modelId });
          onModelChange(modelId);
        }}
        onSettingsClick={() => {
          debugLog('Settings clicked');
          onSettingsClick?.();
        }}
        onInfoClick={() => {
          debugLog('Info clicked');
          onInfoClick?.();
        }}
        onClearConversation={() => {
          debugLog('Clear conversation clicked');
          onClearConversation?.();
        }}
        onRetry={() => {
          debugLog('Retry clicked');
          onRetry?.();
        }}
        messages={displayMessages}
      />
      
      <MessageList
        messages={displayMessages}
        className="flex-1"
      />
      
      <div className="flex items-center justify-end px-4 py-1 border-t border-b">
        <Button
          variant={isDebugEnabled ? "secondary" : "ghost"}
          size="sm"
          onClick={handleToggleDebug}
          className={cn(
            "text-xs",
            isDebugEnabled ? "text-primary" : "text-muted-foreground"
          )}
          leftIcon={<Bug className="h-3 w-3" />}
        >
          Debug ({isDebugEnabled ? "On" : "Off"})
        </Button>
      </div>
      
      <ChatInput
        placeholder="Type your message..."
        disabled={disabled}
        allowFiles={allowFiles}
        maxFileSize={maxFileSize}
        allowedFileTypes={allowedFileTypes}
        className="border-t"
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export { ChatInterface }; 
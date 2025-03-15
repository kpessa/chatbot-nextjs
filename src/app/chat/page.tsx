"use client";

import { useEffect } from "react";
import { ChatInterface } from "@/components/templates/ChatInterface";
import { useRouter } from "next/navigation";
import { useChat } from "@/lib/chat-context";
import { useChatQuery } from "@/lib/use-chat-query";
import { ChatModel, Attachment } from "@/lib/types";
import { useSettings } from "@/lib/stores/settings";
import { toast } from "sonner";
import { debugLog } from "@/lib/debug";

// Mock models data
const mockModels: ChatModel[] = [
  {
    id: "gpt-4-turbo-preview",
    name: "GPT-4 Turbo",
    provider: "openai",
    description: "Latest GPT-4 model with improved performance and features",
    maxTokens: 128000,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg"],
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    description: "Most capable GPT-4 model for complex tasks",
    maxTokens: 8192,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    description: "Fast and efficient model, great for most tasks",
    maxTokens: 16385,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Most capable Claude model for complex tasks",
    maxTokens: 100000,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg"],
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    description: "Fast and efficient Claude model",
    maxTokens: 100000,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg"],
  },
  {
    id: "deepseek-chat",
    name: "Deepseek Chat",
    provider: "deepseek",
    description: "Advanced chat model from Deepseek",
    maxTokens: 8192,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: false,
  },
];

export default function ChatPage() {
  const router = useRouter();
  const { state, addMessage, setModel, setMessages } = useChat();
  const { sendMessage, isProcessing } = useChatQuery();
  const settings = useSettings();
  
  // Check if API key is set for the selected model
  useEffect(() => {
    const provider = state.settings.selectedModel.provider;
    // Only check for providers that have API keys in the settings
    if (provider === 'openai' || provider === 'anthropic' || provider === 'deepseek') {
      const apiKey = settings.apiKeys[provider];
      
      if (!apiKey && state.settings.selectedModel.apiKeyRequired) {
        toast.error(
          `API key for ${provider} is not set. Please add it in the settings.`,
          {
            action: {
              label: 'Settings',
              onClick: () => router.push('/settings'),
            },
          }
        );
      }
    }
  }, [state.settings.selectedModel, settings.apiKeys, router]);

  // Initialize chat with welcome message if empty
  useEffect(() => {
    if (state.messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: "Hello! How can I assist you today?",
      });
    }
  }, [state.messages.length, addMessage]);

  // Handle sending a message
  const handleSendMessage = async (content: string, attachments?: Attachment[]) => {
    debugLog('ChatPage: Sending message', { 
      content, 
      attachmentCount: attachments?.length,
      selectedModel: state.settings.selectedModel,
      apiKey: settings.apiKeys[state.settings.selectedModel.provider as keyof typeof settings.apiKeys] ? 'present' : 'missing'
    });
    
    // Validate API key before sending
    const provider = state.settings.selectedModel.provider;
    if (provider === 'openai' || provider === 'anthropic' || provider === 'deepseek') {
      const apiKey = settings.apiKeys[provider];
      
      if (!apiKey && state.settings.selectedModel.apiKeyRequired) {
        const error = `API key required for ${state.settings.selectedModel.name}`;
        debugLog('ChatPage: Error sending message', { error });
        toast.error(error, {
          action: {
            label: 'Settings',
            onClick: () => router.push('/settings'),
          },
        });
        return;
      }
    }
    
    try {
      await sendMessage(content, attachments);
      debugLog('ChatPage: Message sent successfully');
    } catch (error) {
      debugLog('ChatPage: Error sending message', { error });
      toast.error(
        error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        {
          action: {
            label: 'Settings',
            onClick: () => router.push('/settings'),
          },
        }
      );
    }
  };

  // Handle model change
  const handleModelChange = (modelId: string) => {
    debugLog('ChatPage: Changing model', { modelId });
    const newModel = mockModels.find((model) => model.id === modelId);
    if (newModel) {
      // Convert Model to ChatModel
      const chatModel: ChatModel = {
        id: newModel.id,
        name: newModel.name,
        provider: newModel.provider as "openai" | "anthropic" | "deepseek" | "custom",
        maxTokens: newModel.maxTokens,
        temperature: 0.7,
        apiKeyRequired: true,
      };
      setModel(chatModel);
    }
  };

  // Handle settings click
  const handleSettingsClick = () => {
    debugLog('ChatPage: Opening settings');
    router.push('/settings');
  };

  // Convert messages from chat context to MessageList format
  const messages = state.messages;

  // Find the current model in mockModels
  const currentModel = mockModels.find((model) => model.id === state.settings.selectedModel.id);

  return (
    <div className="container h-screen py-4">
      <ChatInterface
        title="AI Chat"
        models={mockModels}
        selectedModel={state.settings.selectedModel.id}
        onModelChange={handleModelChange}
        messages={messages}
        onSendMessage={handleSendMessage}
        onSettingsClick={handleSettingsClick}
        onInfoClick={() => {}}
        onClearConversation={() => setMessages([])}
        allowFiles={currentModel?.supportsFiles ?? false}
        maxFileSize={10 * 1024 * 1024} // 10MB
        allowedFileTypes={currentModel?.fileTypes}
        disabled={isProcessing}
      />
    </div>
  );
} 
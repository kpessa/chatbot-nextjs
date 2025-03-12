"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/templates/ChatInterface";
import { type Message } from "@/components/organisms/MessageList";
import { type Model } from "@/components/molecules/ModelSelector";
import { useRouter } from "next/navigation";

// Mock models data
const mockModels: Model[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    description: "Most capable OpenAI model for complex tasks",
    maxTokens: 8192,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    description: "Fast and efficient OpenAI model",
    maxTokens: 4096,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Most powerful Anthropic model",
    maxTokens: 100000,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    description: "Balanced Anthropic model for most tasks",
    maxTokens: 100000,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "deepseek-chat",
    name: "Deepseek Chat",
    provider: "deepseek",
    description: "General purpose chat model from Deepseek",
    maxTokens: 8192,
    supportsFiles: false,
  },
];

// Initial messages
const initialMessages: Message[] = [
  {
    id: "welcome",
    content: "Hello! How can I assist you today?",
    isUser: false,
    timestamp: new Date().toISOString(),
  },
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle sending a message
  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      isUser: true,
      timestamp: new Date().toISOString(),
      files: files?.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size,
      })),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add loading message
    setIsLoading(true);
    const loadingId = `loading-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      {
        id: loadingId,
        content: "",
        isUser: false,
        timestamp: new Date().toISOString(),
        isLoading: true,
      },
    ]);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Remove loading message and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingId);
        return [
          ...filtered,
          {
            id: `ai-${Date.now()}`,
            content: `I received your message: "${content}"${files ? ` and ${files.length} file(s)` : ""}. This is a simulated response as we're not connected to a real AI API yet.`,
            isUser: false,
            timestamp: new Date().toISOString(),
          },
        ];
      });
    }, 2000);
  };

  // Handle model change
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  // Handle settings click
  const handleSettingsClick = () => {
    router.push("/settings");
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatInterface
        title="AI Assistant"
        models={mockModels}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        messages={messages}
        onSendMessage={handleSendMessage}
        onSettingsClick={handleSettingsClick}
        allowFiles={true}
        maxFileSize={10}
        allowedFileTypes={["image/png", "image/jpeg", "application/pdf", "text/plain"]}
        disabled={isLoading}
        className="h-full"
      />
    </div>
  );
} 
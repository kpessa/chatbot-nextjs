"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { ChatInterface } from "./ChatInterface";
import { QueryProvider } from "@/lib/query-provider";
import { ChatProvider } from "@/lib/chat-context";
import { ThemeProvider } from "@/components/theme-provider";
import type { Message, Attachment } from "@/lib/types";
import { type ReactNode, type ComponentType, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Create a wrapper component that provides all necessary context
const StorybookProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <QueryProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </QueryProvider>
  </ThemeProvider>
);

const meta = {
  title: "Templates/ChatInterface",
  component: ChatInterface,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story: ComponentType) => (
      <StorybookProvider>
        <Story />
      </StorybookProvider>
    ),
  ],
} satisfies Meta<typeof ChatInterface>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Hello! Can you help me with something?",
    timestamp: Date.now(),
  },
  {
    id: "2",
    role: "assistant",
    content: "Of course! I'd be happy to help. What do you need assistance with?",
    timestamp: Date.now(),
  },
];

export const Default: Story = {
  args: {
    title: "Chat Interface",
    models: [
      {
        id: "gpt-4",
        name: "GPT-4",
        description: "Most capable model",
        provider: "openai",
        maxTokens: 8192,
        temperature: 0.7,
        apiKeyRequired: true
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5",
        description: "Fast and efficient",
        provider: "openai",
        maxTokens: 4096,
        temperature: 0.7,
        apiKeyRequired: true
      },
    ],
    selectedModel: "gpt-4",
    onModelChange: (modelId: string) => console.log("Model changed:", modelId),
    messages: mockMessages,
    onSendMessage: (content: string) => console.log("Message sent:", content),
    onSettingsClick: () => console.log("Settings clicked"),
    onInfoClick: () => console.log("Info clicked"),
    onClearConversation: () => console.log("Clear conversation clicked"),
    onRetry: () => console.log("Retry clicked"),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    messages: [],
  },
};

export const WithFiles: Story = {
  args: {
    ...Default.args,
    allowFiles: true,
    maxFileSize: 1024 * 1024 * 10, // 10MB
    allowedFileTypes: ["image/*", "application/pdf", "text/plain"],
  },
};

// Interactive story that demonstrates sending messages
const InteractiveChatTemplate = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4");

  const handleSendMessage = useCallback((content: string, attachments?: Attachment[]) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
      attachments,
    };
    setMessages((prevMessages: Message[]) => [...prevMessages, newMessage]);
  }, []);

  return (
    <ChatInterface
      title="Interactive Chat"
      models={[
        {
          id: "gpt-4",
          name: "GPT-4",
          description: "Most capable model",
          provider: "openai",
          maxTokens: 8192,
          temperature: 0.7,
          apiKeyRequired: true
        },
        {
          id: "gpt-3.5-turbo",
          name: "GPT-3.5",
          description: "Fast and efficient",
          provider: "openai",
          maxTokens: 4096,
          temperature: 0.7,
          apiKeyRequired: true
        },
      ]}
      selectedModel={selectedModel}
      onModelChange={setSelectedModel}
      messages={messages}
      onSendMessage={handleSendMessage}
      onSettingsClick={() => console.log("Settings clicked")}
      onInfoClick={() => console.log("Info clicked")}
      onClearConversation={() => setMessages([])}
      onRetry={() => console.log("Retry clicked")}
      allowFiles={true}
      maxFileSize={1024 * 1024 * 10}
      allowedFileTypes={["image/*", "application/pdf", "text/plain"]}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveChatTemplate />,
  args: Default.args,
  parameters: {
    docs: {
      description: {
        story: 'An interactive example that demonstrates sending messages and receiving responses. This story simulates the chat interface with loading states and file attachment support.',
      },
    },
  },
}; 
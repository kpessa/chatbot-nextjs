import type { Meta, StoryObj } from "@storybook/react";
import { ChatInterface } from "./ChatInterface";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "@/lib/chat-context";
import { useState } from "react";
import { StorybookDecorator } from "../StorybookDecorator";
import type { Message, ChatModel } from "@/lib/types";

// Create a QueryClient for Storybook
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const meta: Meta<typeof ChatInterface> = {
  title: "Templates/ChatInterface",
  component: ChatInterface,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const [queryClient] = useState(() => createQueryClient());
      
      return (
        <StorybookDecorator>
          <QueryClientProvider client={queryClient}>
            <ChatProvider>
              <Story />
            </ChatProvider>
          </QueryClientProvider>
        </StorybookDecorator>
      );
    },
  ],
} satisfies Meta<typeof ChatInterface>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Hello, how are you?",
    timestamp: Date.now(),
  },
  {
    id: "2",
    role: "assistant",
    content: "I am doing well, thank you for asking! How can I help you today?",
    timestamp: Date.now(),
  },
];

const mockModels: ChatModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    maxTokens: 8192,
    temperature: 0.7,
    apiKeyRequired: true,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
];

const loadingMessage: Message = {
  id: "loading",
  role: "assistant",
  content: "Thinking...",
  timestamp: Date.now(),
};

export const Default: Story = {
  args: {
    title: "Chat Interface",
    messages: mockMessages,
    onSendMessage: (message: string) => {
      console.log("Message sent:", message);
    },
    onRetry: () => console.log("Retrying"),
    onClearConversation: () => console.log("Clearing conversation"),
    models: mockModels,
    selectedModel: mockModels[0].id,
    onModelChange: (modelId: string) => console.log("Model changed:", modelId),
    status: "idle",
  },
};

export const WithLoadingMessage: Story = {
  args: {
    ...Default.args,
    messages: [...mockMessages, loadingMessage],
    status: "loading",
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    messages: [],
    status: "idle",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const DarkMode: Story = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story) => {
      const [queryClient] = useState(() => createQueryClient());
      
      return (
        <StorybookDecorator isDark>
          <QueryClientProvider client={queryClient}>
            <ChatProvider>
              <Story />
            </ChatProvider>
          </QueryClientProvider>
        </StorybookDecorator>
      );
    },
  ],
};

export const WithCurrentMessage: Story = {
  args: {
    title: "Chat Interface",
    messages: mockMessages,
    onSendMessage: (message) => console.log("Sending message:", message),
    onRetry: () => console.log("Retrying"),
    onClearConversation: () => console.log("Clearing conversation"),
    currentMessage: {
      id: "current",
      role: "assistant",
      content: "I'm thinking...",
      timestamp: Date.now()
    },
    models: [],
    selectedModel: "",
    onModelChange: () => {}
  }
};

export const Loading: Story = {
  args: {
    title: "Chat Interface",
    messages: mockMessages,
    onSendMessage: (message) => console.log("Sending message:", message),
    onRetry: () => console.log("Retrying"),
    onClearConversation: () => console.log("Clearing conversation"),
    currentMessage: {
      id: "current",
      role: "assistant",
      content: "I'm thinking...",
      timestamp: Date.now()
    },
    status: "loading",
    models: [],
    selectedModel: "",
    onModelChange: () => {}
  }
}; 
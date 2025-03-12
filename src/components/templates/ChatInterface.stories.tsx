import type { Meta, StoryObj } from "@storybook/react";
import { ChatInterface } from "./ChatInterface";

const meta: Meta<typeof ChatInterface> = {
  title: "Templates/ChatInterface",
  component: ChatInterface,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatInterface>;

const mockModels = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai" as const,
    description: "Most capable OpenAI model for complex tasks",
    maxTokens: 8192,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai" as const,
    description: "Fast and efficient OpenAI model",
    maxTokens: 4096,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic" as const,
    description: "Most powerful Anthropic model",
    maxTokens: 100000,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
];

const mockMessages = [
  {
    id: "1",
    content: "Hello! How can I assist you today?",
    isUser: false,
    timestamp: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    content: "I need help with my project. Can you explain how to use React hooks?",
    isUser: true,
    timestamp: "2023-06-15T10:31:00Z",
  },
  {
    id: "3",
    content: "React hooks are functions that let you use state and other React features without writing a class. Here's a simple example of the useState hook:",
    isUser: false,
    timestamp: "2023-06-15T10:32:00Z",
  },
  {
    id: "4",
    content: "```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```",
    isUser: false,
    timestamp: "2023-06-15T10:32:30Z",
  },
  {
    id: "5",
    content: "That's really helpful, thank you! Can you also explain useEffect?",
    isUser: true,
    timestamp: "2023-06-15T10:33:00Z",
  },
  {
    id: "6",
    content: "Here's a diagram that explains the React component lifecycle with useEffect:",
    isUser: false,
    timestamp: "2023-06-15T10:34:00Z",
    files: [
      {
        name: "react-lifecycle.png",
        type: "image/png",
        url: "https://via.placeholder.com/300x200",
        size: 1024 * 50, // 50KB
      },
    ],
  },
];

export const Default: Story = {
  args: {
    title: "AI Assistant",
    models: mockModels,
    selectedModel: "gpt-4",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
    messages: mockMessages,
    onSendMessage: (message, files) => {
      console.log("Message:", message);
      console.log("Files:", files);
    },
    onSettingsClick: () => console.log("Settings clicked"),
    onInfoClick: () => console.log("Info clicked"),
    allowFiles: true,
    maxFileSize: 10,
    allowedFileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const WithLoadingMessage: Story = {
  args: {
    ...Default.args,
    messages: [
      ...mockMessages,
      {
        id: "loading",
        content: "",
        isUser: false,
        timestamp: new Date().toISOString(),
        isLoading: true,
      },
    ],
  },
};

export const EmptyChat: Story = {
  args: {
    ...Default.args,
    messages: [],
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}; 
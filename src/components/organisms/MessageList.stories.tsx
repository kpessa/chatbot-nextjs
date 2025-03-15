import type { Meta, StoryObj } from "@storybook/react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatProvider } from "@/lib/chat-context";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Message, Attachment } from "@/lib/types";

// Create a wrapper component that provides all necessary context
const StorybookProvider = ({ children }: { children: React.ReactNode }) => {
  return (
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
};

const meta: Meta<typeof MessageList> = {
  title: "Organisms/MessageList",
  component: MessageList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StorybookProvider>
        <Story />
      </StorybookProvider>
    ),
  ],
};

export default meta;

const mockMessages = [
  {
    id: "1",
    content: "Hello! How can I assist you today?",
    role: "assistant" as const,
    timestamp: Date.parse("2023-06-15T10:30:00Z"),
  },
  {
    id: "2",
    content: "I need help with my project. Can you explain how to use React hooks?",
    role: "user" as const,
    timestamp: Date.parse("2023-06-15T10:31:00Z"),
  },
  {
    id: "3",
    content: "React hooks are functions that let you use state and other React features without writing a class. Here's a simple example of the useState hook:",
    role: "assistant" as const,
    timestamp: Date.parse("2023-06-15T10:32:00Z"),
  },
  {
    id: "4",
    content: "```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```",
    role: "assistant" as const,
    timestamp: Date.parse("2023-06-15T10:32:30Z"),
  },
  {
    id: "5",
    content: "That's really helpful, thank you! Can you also explain useEffect?",
    role: "user" as const,
    timestamp: Date.parse("2023-06-15T10:33:00Z"),
  },
];

const mockMessagesWithFiles = [
  ...mockMessages,
  {
    id: "6",
    content: "Here's a diagram that explains the React component lifecycle with useEffect:",
    role: "assistant" as const,
    timestamp: Date.parse("2023-06-15T10:34:00Z"),
    attachments: [
      {
        id: "file1",
        name: "react-lifecycle.png",
        type: "image/png",
        url: "https://via.placeholder.com/300x200",
        size: 1024 * 50, // 50KB
      },
    ],
  },
  {
    id: "7",
    content: "I've also attached a PDF with more detailed explanations.",
    role: "assistant" as const,
    timestamp: Date.parse("2023-06-15T10:35:00Z"),
    attachments: [
      {
        id: "file2",
        name: "react-hooks-guide.pdf",
        type: "application/pdf",
        url: "#",
        size: 1024 * 1024 * 2.5, // 2.5MB
      },
    ],
  },
  {
    id: "8",
    content: "Thanks for the resources! Here's a screenshot of my current code:",
    role: "user" as const,
    timestamp: Date.parse("2023-06-15T10:36:00Z"),
    attachments: [
      {
        id: "file3",
        name: "my-code.png",
        type: "image/png",
        url: "https://via.placeholder.com/300x200",
        size: 1024 * 75, // 75KB
      },
    ],
  },
];

export const Default: StoryObj<typeof MessageList> = {
  args: {
    messages: mockMessages,
  },
};

export const WithFiles: StoryObj<typeof MessageList> = {
  args: {
    messages: mockMessagesWithFiles,
  },
};

export const WithLoadingMessage: StoryObj<typeof MessageList> = {
  args: {
    messages: [
      ...mockMessages,
      {
        id: "loading",
        content: "",
        role: "assistant" as const,
        timestamp: Date.parse(new Date().toISOString()),
        isLoading: true,
      },
    ],
  },
};

export const Empty: StoryObj<typeof MessageList> = {
  args: {
    messages: [],
  },
};

// Interactive story that demonstrates sending messages
const InteractiveChatTemplate = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    loadingMessageId?: string;
    lastUpdate?: string;
  }>({});

  const handleSendMessage = useCallback((content: string, attachments?: Attachment[]) => {
    const timestamp = Date.now();
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp,
      attachments,
    };
    setMessages(prev => [...prev, userMessage]);

    // Show loading state
    setIsProcessing(true);

    // Add loading message
    const loadingMessageId = uuidv4();
    const loadingMessage: Message = {
      id: loadingMessageId,
      content: "",
      role: 'assistant',
      timestamp,
      isLoading: true,
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    setDebugInfo({ loadingMessageId, lastUpdate: 'Added loading message' });

    // Simulate AI response after a delay
    setTimeout(() => {
      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg.id === loadingMessageId
            ? {
                ...msg,
                content: `I received your message: "${content}"`,
                isLoading: false,
                timestamp: Date.now(),
              }
            : msg
        );
        setDebugInfo(prev => ({
          ...prev,
          lastUpdate: `Updated message ${loadingMessageId} with content`
        }));
        return updatedMessages;
      });
      setIsProcessing(false);
    }, 2000);
  }, []);

  // Debug display for message states
  const debugDisplay = (
    <div className="p-4 border-t text-xs font-mono">
      <div>Loading Message ID: {debugInfo.loadingMessageId || 'none'}</div>
      <div>Last Update: {debugInfo.lastUpdate || 'none'}</div>
      <div>Processing: {isProcessing ? 'true' : 'false'}</div>
      <div className="mt-2">Message States:</div>
      {messages.map(msg => (
        <div key={msg.id} className="ml-2">
          ID: {msg.id ? `${msg.id.slice(0, 8)}...` : 'no-id'} | Role: {msg.role} | Loading: {msg.isLoading ? 'true' : 'false'}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-[800px] border rounded-lg overflow-hidden">
      <MessageList messages={messages} className="flex-1" />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        className="p-4 border-t"
        disabled={isProcessing}
        allowFiles={true}
        maxFileSize={10}
        allowedFileTypes={["image/png", "image/jpeg", "application/pdf"]}
      />
      {debugDisplay}
    </div>
  );
};

export const Interactive: StoryObj<typeof MessageList> = {
  render: () => <InteractiveChatTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'An interactive example that demonstrates sending messages and receiving responses. This story simulates the chat interface with loading states and file attachment support.',
      },
    },
  },
}; 
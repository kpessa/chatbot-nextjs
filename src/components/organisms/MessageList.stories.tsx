import type { Meta, StoryObj } from "@storybook/react";
import { MessageList } from "./MessageList";

const meta: Meta<typeof MessageList> = {
  title: "Organisms/MessageList",
  component: MessageList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MessageList>;

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
];

const mockMessagesWithFiles = [
  ...mockMessages,
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
  {
    id: "7",
    content: "I've also attached a PDF with more detailed explanations.",
    isUser: false,
    timestamp: "2023-06-15T10:35:00Z",
    files: [
      {
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
    isUser: true,
    timestamp: "2023-06-15T10:36:00Z",
    files: [
      {
        name: "my-code.png",
        type: "image/png",
        url: "https://via.placeholder.com/300x200",
        size: 1024 * 75, // 75KB
      },
    ],
  },
];

export const Default: Story = {
  args: {
    messages: mockMessages,
  },
};

export const WithFiles: Story = {
  args: {
    messages: mockMessagesWithFiles,
  },
};

export const WithLoadingMessage: Story = {
  args: {
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

export const Empty: Story = {
  args: {
    messages: [],
  },
}; 
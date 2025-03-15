"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { MessageBubble } from "./MessageBubble";
import { StorybookDecorator } from "../StorybookDecorator";
import React from "react";

const meta: Meta<typeof MessageBubble> = {
  title: "Molecules/MessageBubble",
  component: MessageBubble,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <div style={{ width: "400px" }}>
          <Story />
        </div>
      </StorybookDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const UserMessage: Story = {
  args: {
    content: "Hello! How are you?",
    isUser: true,
    timestamp: "12:30 PM",
    isLoading: false,
  },
};

export const AssistantMessage: Story = {
  args: {
    content: "I am doing well, thank you for asking! How can I help you today?",
    isUser: false,
    timestamp: "12:31 PM",
    isLoading: false,
  },
};

export const LoadingMessage: Story = {
  args: {
    content: "",
    isUser: false,
    timestamp: "12:32 PM",
    isLoading: true,
  },
};

export const LongMessage: Story = {
  args: {
    content: "This is a very long message that should wrap properly. ".repeat(10),
    isUser: false,
    timestamp: "12:33 PM",
    isLoading: false,
  },
};

export const WithoutTimestamp: Story = {
  args: {
    content: "Message without a timestamp",
    isUser: true,
    isLoading: false,
  },
};

export const LoadingWithContent: Story = {
  args: {
    content: "This content should not be visible while loading",
    isUser: false,
    timestamp: "12:34 PM",
    isLoading: true,
  },
};

// Story to demonstrate the message list behavior
export const MessageSequence: Story = {
  render: () => (
    <div className="flex flex-col space-y-4 w-[600px] p-4">
      <MessageBubble
        content="Hi there!"
        isUser={true}
        timestamp="12:30 PM"
        isLoading={false}
      />
      <MessageBubble
        content="Hello! How can I help you today?"
        isUser={false}
        timestamp="12:31 PM"
        isLoading={false}
      />
      <MessageBubble
        content="Can you help me with a coding problem?"
        isUser={true}
        timestamp="12:32 PM"
        isLoading={false}
      />
      <MessageBubble
        content=""
        isUser={false}
        timestamp="12:32 PM"
        isLoading={true}
      />
    </div>
  ),
};

// Story to test loading state transitions
export const LoadingTransition: Story = {
  render: function LoadingTransitionRenderer() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [content, setContent] = React.useState('');
    
    React.useEffect(() => {
      if (isLoading) {
        const timer = setTimeout(() => {
          setIsLoading(false);
          setContent('Here is the response after loading!');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [isLoading]);

    return (
      <div className="w-[600px]">
        <MessageBubble
          content={content}
          isUser={false}
          timestamp="12:35 PM"
          isLoading={isLoading}
        />
      </div>
    );
  },
};

export const CodeBlock: Story = {
  args: {
    content: `Here's a simple React component:

\`\`\`jsx
function HelloWorld() {
  return <div>Hello, World!</div>;
}
\`\`\`

You can use it like this:

\`\`\`jsx
<HelloWorld />
\`\`\``,
    isUser: false,
    timestamp: "12:37 PM",
  },
};

export const DarkMode: Story = {
  args: {
    content: "This is a message in dark mode.",
    isUser: false,
    timestamp: "12:38 PM",
  },
  decorators: [
    (Story) => (
      <StorybookDecorator isDark>
        <div style={{ width: "400px" }}>
          <Story />
        </div>
      </StorybookDecorator>
    ),
  ],
}; 
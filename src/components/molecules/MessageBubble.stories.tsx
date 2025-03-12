import type { Meta, StoryObj } from "@storybook/react";
import { MessageBubble } from "./MessageBubble";
import { StorybookDecorator } from "../StorybookDecorator";

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

export const AIMessage: Story = {
  args: {
    content: "Hello! How can I assist you today?",
    isUser: false,
    timestamp: "12:34 PM",
  },
};

export const UserMessage: Story = {
  args: {
    content: "I need help with my project.",
    isUser: true,
    timestamp: "12:35 PM",
  },
};

export const LongMessage: Story = {
  args: {
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    isUser: false,
    timestamp: "12:36 PM",
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

export const LoadingMessage: Story = {
  args: {
    content: "",
    isUser: false,
    isLoading: true,
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
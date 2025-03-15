import type { Meta, StoryObj } from "@storybook/react";
import { ChatInput } from "./ChatInput";
import { StorybookDecorator } from "../StorybookDecorator";
import { StorybookChatDecorator } from "../StorybookChatDecorator";
import { Attachment } from "@/lib/types";

// Create a mock implementation of onSendMessage for Storybook
const mockSendMessage = async (message: string, attachments?: Attachment[]) => {
  console.log("Sending message:", message, attachments);
  return Promise.resolve();
};

const meta: Meta<typeof ChatInput> = {
  title: "Organisms/ChatInput",
  component: ChatInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <StorybookChatDecorator>
          <div style={{ width: "600px" }}>
            <Story />
          </div>
        </StorybookChatDecorator>
      </StorybookDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  args: {
    placeholder: "Type your message...",
    onSendMessage: mockSendMessage,
  },
};

export const WithoutFileUpload: Story = {
  args: {
    placeholder: "Type your message...",
    allowFiles: false,
    onSendMessage: mockSendMessage,
  },
};

export const WithCustomFileTypes: Story = {
  args: {
    placeholder: "Type your message...",
    allowFiles: true,
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxFileSize: 5, // 5MB
    onSendMessage: mockSendMessage,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Type your message...",
    disabled: true,
    onSendMessage: mockSendMessage,
  },
};

export const Processing: Story = {
  args: {
    placeholder: "Type your message...",
    disabled: true,
    onSendMessage: mockSendMessage,
  },
};

export const WithFileUploading: Story = {
  args: {
    placeholder: "Type your message...",
    allowFiles: true,
    onSendMessage: mockSendMessage,
  },
  play: async () => {
    // This would simulate file upload in a real story
    // but we can't actually trigger file uploads in Storybook
    // so this is just for visual reference
  },
};

export const WithFileError: Story = {
  args: {
    placeholder: "Type your message...",
    allowFiles: true,
    onSendMessage: mockSendMessage,
  },
  play: async () => {
    // This would simulate file upload error in a real story
  },
};

export const DarkMode: Story = {
  args: {
    placeholder: "Type your message...",
    onSendMessage: mockSendMessage,
  },
  decorators: [
    (Story) => (
      <StorybookDecorator isDark>
        <StorybookChatDecorator isDark>
          <div style={{ width: "600px" }}>
            <Story />
          </div>
        </StorybookChatDecorator>
      </StorybookDecorator>
    ),
  ],
}; 
import type { Meta, StoryObj } from "@storybook/react";
import { ChatInput } from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Organisms/ChatInput",
  component: ChatInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  args: {
    onSendMessage: (message, files) => {
      console.log("Message:", message);
      console.log("Files:", files);
    },
    placeholder: "Type your message...",
  },
};

export const WithoutFileUpload: Story = {
  args: {
    onSendMessage: (message) => {
      console.log("Message:", message);
    },
    placeholder: "Type your message...",
    allowFiles: false,
  },
};

export const Disabled: Story = {
  args: {
    onSendMessage: (message, files) => {
      console.log("Message:", message);
      console.log("Files:", files);
    },
    placeholder: "Type your message...",
    disabled: true,
  },
};

export const WithCustomFileTypes: Story = {
  args: {
    onSendMessage: (message, files) => {
      console.log("Message:", message);
      console.log("Files:", files);
    },
    placeholder: "Type your message...",
    allowFiles: true,
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxFileSize: 5, // 5MB
  },
}; 
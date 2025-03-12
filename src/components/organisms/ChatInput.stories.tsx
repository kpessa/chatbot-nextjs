import type { Meta, StoryObj } from "@storybook/react";
import { ChatInput } from "./ChatInput";
import { StorybookDecorator } from "../StorybookDecorator";

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
        <div style={{ width: "600px" }}>
          <Story />
        </div>
      </StorybookDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  args: {
    placeholder: "Type your message...",
  },
};

export const WithoutFileUpload: Story = {
  args: {
    placeholder: "Type your message...",
    allowFiles: false,
  },
};

export const WithCustomFileTypes: Story = {
  args: {
    placeholder: "Type your message...",
    allowFiles: true,
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxFileSize: 5, // 5MB
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Type your message...",
    disabled: true,
  },
};

export const Processing: Story = {
  args: {
    placeholder: "Type your message...",
    disabled: true,
  },
};

export const WithFileUploading: Story = {
  args: {
    placeholder: "Type your message...",
    allowFiles: true,
  },
  play: async ({ canvasElement }) => {
    // This would simulate file upload in a real story
    // but we can't actually trigger file uploads in Storybook
    // so this is just for visual reference
  },
};

export const WithFileError: Story = {
  args: {
    placeholder: "Type your message...",
    allowFiles: true,
  },
  play: async ({ canvasElement }) => {
    // This would simulate file upload error in a real story
  },
};

export const DarkMode: Story = {
  args: {
    placeholder: "Type your message...",
  },
  decorators: [
    (Story) => (
      <StorybookDecorator isDark>
        <div style={{ width: "600px" }}>
          <Story />
        </div>
      </StorybookDecorator>
    ),
  ],
}; 
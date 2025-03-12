import type { Meta, StoryObj } from "@storybook/react";
import { UploadProgress } from "./UploadProgress";
import { StorybookDecorator } from "../StorybookDecorator";

const meta: Meta<typeof UploadProgress> = {
  title: "Molecules/UploadProgress",
  component: UploadProgress,
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
type Story = StoryObj<typeof UploadProgress>;

export const Uploading: Story = {
  args: {
    fileName: "large-image.png",
    progress: 45,
    status: "uploading",
  },
};

export const Processing: Story = {
  args: {
    fileName: "document.pdf",
    progress: 100,
    status: "processing",
  },
};

export const Complete: Story = {
  args: {
    fileName: "completed-file.jpg",
    progress: 100,
    status: "complete",
  },
};

export const Error: Story = {
  args: {
    fileName: "failed-upload.zip",
    progress: 70,
    status: "error",
  },
};

export const LongFileName: Story = {
  args: {
    fileName: "very-long-file-name-that-should-be-truncated-with-ellipsis.pdf",
    progress: 60,
    status: "uploading",
  },
};

export const DarkMode: Story = {
  args: {
    fileName: "dark-mode-file.png",
    progress: 80,
    status: "uploading",
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
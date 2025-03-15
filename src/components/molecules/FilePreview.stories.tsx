import type { Meta, StoryObj } from "@storybook/react";
import { FilePreview } from "./FilePreview";
import { StorybookDecorator } from "../StorybookDecorator";

const meta: Meta<typeof FilePreview> = {
  title: "Molecules/FilePreview",
  component: FilePreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <div style={{ width: "300px" }}>
          <Story />
        </div>
      </StorybookDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilePreview>;

// Helper function to create a file
const createFile = (name: string, type: string, size: number = 1024 * 50) => {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
};

export const ImagePreview: Story = {
  args: {
    file: createFile("example.png", "image/png"),
    onRemove: () => console.log("Remove clicked"),
  },
};

export const PDFPreview: Story = {
  args: {
    file: createFile("document.pdf", "application/pdf", 1024 * 1024 * 2.5),
    onRemove: () => console.log("Remove clicked"),
  },
};

export const TextFilePreview: Story = {
  args: {
    file: createFile("notes.txt", "text/plain", 1024 * 10),
    onRemove: () => console.log("Remove clicked"),
  },
};

export const LargeFile: Story = {
  args: {
    file: createFile("large-file.zip", "application/zip", 1024 * 1024 * 50),
    onRemove: () => console.log("Remove clicked"),
  },
};

export const WithoutRemoveButton: Story = {
  args: {
    file: createFile("example.png", "image/png"),
  },
};

export const DarkMode: Story = {
  args: {
    file: createFile("example.png", "image/png"),
    onRemove: () => console.log("Remove clicked"),
  },
  decorators: [
    (Story) => (
      <StorybookDecorator isDark>
        <div style={{ width: "300px" }}>
          <Story />
        </div>
      </StorybookDecorator>
    ),
  ],
}; 
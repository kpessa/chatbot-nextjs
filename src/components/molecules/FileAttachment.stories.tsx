import type { Meta, StoryObj } from "@storybook/react";
import { FileAttachment } from "./FileAttachment";
import { StorybookDecorator } from "../StorybookDecorator";

const meta: Meta<typeof FileAttachment> = {
  title: "Molecules/FileAttachment",
  component: FileAttachment,
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
type Story = StoryObj<typeof FileAttachment>;

export const ImageFile: Story = {
  args: {
    file: {
      name: "example-image.png",
      type: "image/png",
      url: "https://via.placeholder.com/300x200",
      size: 1024 * 50, // 50KB
    },
  },
};

export const PDFFile: Story = {
  args: {
    file: {
      name: "example-document.pdf",
      type: "application/pdf",
      url: "#",
      size: 1024 * 1024 * 2.5, // 2.5MB
    },
  },
};

export const TextFile: Story = {
  args: {
    file: {
      name: "example-text.txt",
      type: "text/plain",
      url: "#",
      size: 1024 * 10, // 10KB
    },
  },
};

export const OtherFile: Story = {
  args: {
    file: {
      name: "example-file.zip",
      type: "application/zip",
      url: "#",
      size: 1024 * 1024 * 5, // 5MB
    },
  },
};

export const WithRemoveButton: Story = {
  args: {
    file: {
      name: "removable-file.jpg",
      type: "image/jpeg",
      url: "https://via.placeholder.com/300x200",
      size: 1024 * 100, // 100KB
    },
    onRemove: () => alert("Remove button clicked"),
  },
};

export const DarkMode: Story = {
  args: {
    file: {
      name: "dark-mode-file.png",
      type: "image/png",
      url: "https://via.placeholder.com/300x200",
      size: 1024 * 75, // 75KB
    },
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
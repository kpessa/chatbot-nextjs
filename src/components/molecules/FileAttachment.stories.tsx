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

export const Default: Story = {
  args: {
    file: {
      id: "1",
      name: "document.pdf",
      type: "application/pdf",
      url: "https://example.com/document.pdf",
      size: 1024 * 1024,
    },
  },
};

export const LongFileName: Story = {
  args: {
    file: {
      id: "2",
      name: "very-long-file-name-that-should-be-truncated.pdf",
      type: "application/pdf",
      url: "https://example.com/very-long-file-name.pdf",
      size: 1024 * 1024,
    },
  },
};

export const SmallFile: Story = {
  args: {
    file: {
      id: "3",
      name: "small.txt",
      type: "text/plain",
      url: "https://example.com/small.txt",
      size: 1024,
    },
  },
};

export const LargeFile: Story = {
  args: {
    file: {
      id: "4",
      name: "large.zip",
      type: "application/zip",
      url: "https://example.com/large.zip",
      size: 1024 * 1024 * 100,
    },
  },
};

export const ImageFile: Story = {
  args: {
    file: {
      id: "5",
      name: "image.png",
      type: "image/png",
      url: "https://example.com/image.png",
      size: 1024 * 512,
    },
  },
};

export const Loading: Story = {
  args: {
    file: {
      id: "6",
      name: "loading.pdf",
      type: "application/pdf",
      url: "https://example.com/loading.pdf",
      size: 1024 * 1024,
    },
  },
};

export const PDFFile: Story = {
  args: {
    file: {
      id: "7",
      name: "document.pdf",
      type: "application/pdf",
      url: "https://example.com/document.pdf",
      size: 1024 * 1024,
    },
  },
};

export const TextFile: Story = {
  args: {
    file: {
      id: "8",
      name: "notes.txt",
      type: "text/plain",
      url: "https://example.com/notes.txt",
      size: 1024 * 10,
    },
  },
};

export const OtherFile: Story = {
  args: {
    file: {
      id: "12",
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
      id: "9",
      name: "removable.pdf",
      type: "application/pdf",
      url: "https://example.com/removable.pdf",
      size: 1024 * 1024,
    },
    onRemove: () => console.log("Remove clicked"),
  },
};

export const DarkMode: Story = {
  args: {
    file: {
      id: "13",
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

export const CustomClassName: Story = {
  args: {
    file: {
      id: "10",
      name: "styled.pdf",
      type: "application/pdf",
      url: "https://example.com/styled.pdf",
      size: 1024 * 1024,
    },
    className: "custom-class",
  },
};

export const ZeroByteFile: Story = {
  args: {
    file: {
      id: "11",
      name: "empty.txt",
      type: "text/plain",
      url: "https://example.com/empty.txt",
      size: 0,
    },
  },
}; 
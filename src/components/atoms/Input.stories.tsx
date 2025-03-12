import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { StorybookDecorator } from "../StorybookDecorator";

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email...",
    type: "email",
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "Search...",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
};

export const WithError: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter your password...",
    error: "Password must be at least 8 characters",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    label: "Name",
    value: "John Doe",
    readOnly: true,
  },
};

export const FileInput: Story = {
  args: {
    type: "file",
    accept: "image/*",
  },
};

export const DarkMode: Story = {
  args: {
    label: "Dark Mode Input",
    placeholder: "Enter text in dark mode...",
  },
  decorators: [
    (Story) => (
      <StorybookDecorator isDark>
        <Story />
      </StorybookDecorator>
    ),
  ],
}; 
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { StorybookDecorator } from "../StorybookDecorator";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link", "gradient"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    leftIcon: {
      control: false,
    },
    rightIcon: {
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
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
  },
};

export const Gradient: Story = {
  args: {
    children: "Gradient",
    variant: "gradient",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: "With Left Icon",
    leftIcon: <span>👈</span>,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: "With Right Icon",
    rightIcon: <span>👉</span>,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: "With Both Icons",
    leftIcon: <span>👈</span>,
    rightIcon: <span>👉</span>,
  },
};

export const DarkMode: Story = {
  args: {
    children: "Dark Mode Button",
    variant: "default",
  },
  decorators: [
    (Story) => (
      <StorybookDecorator isDark>
        <Story />
      </StorybookDecorator>
    ),
  ],
}; 
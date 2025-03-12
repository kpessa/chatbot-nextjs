import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "./ChatHeader";

const meta: Meta<typeof ChatHeader> = {
  title: "Organisms/ChatHeader",
  component: ChatHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatHeader>;

const mockModels = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai" as const,
    description: "Most capable OpenAI model for complex tasks",
    maxTokens: 8192,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai" as const,
    description: "Fast and efficient OpenAI model",
    maxTokens: 4096,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic" as const,
    description: "Most powerful Anthropic model",
    maxTokens: 100000,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
];

export const Default: Story = {
  args: {
    title: "Chat",
    models: mockModels,
    selectedModel: "gpt-4",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
    onSettingsClick: () => console.log("Settings clicked"),
    onInfoClick: () => console.log("Info clicked"),
  },
};

export const WithCustomTitle: Story = {
  args: {
    title: "AI Assistant",
    models: mockModels,
    selectedModel: "claude-3-opus",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
    onSettingsClick: () => console.log("Settings clicked"),
    onInfoClick: () => console.log("Info clicked"),
  },
};

export const WithoutButtons: Story = {
  args: {
    title: "Simple Chat",
    models: mockModels,
    selectedModel: "gpt-3.5-turbo",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
  },
}; 
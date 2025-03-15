import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "./ChatHeader";
import type { ChatModel } from "@/lib/types";

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

const mockModels: ChatModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    description: "Most capable GPT-4 model",
    maxTokens: 8000,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: true,
    fileTypes: ["pdf", "txt", "doc"]
  },
  {
    id: "claude-3",
    name: "Claude 3",
    provider: "anthropic",
    description: "Latest Claude model",
    maxTokens: 100000,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: true,
    fileTypes: ["pdf", "txt", "doc"]
  }
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
    selectedModel: "claude-3",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
    onSettingsClick: () => console.log("Settings clicked"),
    onInfoClick: () => console.log("Info clicked"),
  },
};

export const WithoutButtons: Story = {
  args: {
    title: "Simple Chat",
    models: mockModels,
    selectedModel: "gpt-4",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
  },
}; 
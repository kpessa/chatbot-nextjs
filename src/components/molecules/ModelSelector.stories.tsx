import type { Meta, StoryObj } from "@storybook/react";
import { ModelSelector } from "./ModelSelector";
import type { ChatModel } from "@/lib/types";

const meta: Meta<typeof ModelSelector> = {
  title: "Molecules/ModelSelector",
  component: ModelSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ModelSelector>;

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
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    provider: "deepseek",
    description: "Specialized coding model",
    maxTokens: 8000,
    temperature: 0.7,
    apiKeyRequired: true,
    supportsFiles: false,
    fileTypes: []
  }
];

export const Default: Story = {
  args: {
    models: mockModels,
    selectedModel: "gpt-4",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
  },
};

export const WithAnthropicSelected: Story = {
  args: {
    models: mockModels,
    selectedModel: "claude-3",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
  },
};

export const WithDeepseekSelected: Story = {
  args: {
    models: mockModels,
    selectedModel: "deepseek-coder",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
  },
};

export const Disabled: Story = {
  args: {
    models: mockModels,
    selectedModel: "gpt-4",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
    disabled: true,
  },
}; 
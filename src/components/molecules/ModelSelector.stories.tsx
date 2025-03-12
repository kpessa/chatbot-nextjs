import type { Meta, StoryObj } from "@storybook/react";
import { ModelSelector } from "./ModelSelector";

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
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "anthropic" as const,
    description: "Balanced Anthropic model for most tasks",
    maxTokens: 100000,
    supportsFiles: true,
    fileTypes: ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  },
  {
    id: "deepseek-chat",
    name: "Deepseek Chat",
    provider: "deepseek" as const,
    description: "General purpose chat model from Deepseek",
    maxTokens: 8192,
    supportsFiles: false,
  },
  {
    id: "custom-model",
    name: "Custom Model",
    provider: "other" as const,
    description: "User-defined custom model",
    supportsFiles: false,
  },
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
    selectedModel: "claude-3-opus",
    onModelChange: (modelId) => console.log(`Selected model: ${modelId}`),
  },
};

export const WithDeepseekSelected: Story = {
  args: {
    models: mockModels,
    selectedModel: "deepseek-chat",
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
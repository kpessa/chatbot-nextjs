/**
 * Registry of available AI models
 */

import { ChatModel } from '../types';

/**
 * OpenAI models
 */
export const openAIModels: ChatModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
];

/**
 * Anthropic models
 */
export const anthropicModels: ChatModel[] = [
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
];

/**
 * Deepseek models
 */
export const deepseekModels: ChatModel[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
];

/**
 * All available models
 */
export const allModels: ChatModel[] = [
  ...openAIModels,
  ...anthropicModels,
  ...deepseekModels,
];

/**
 * Get models by provider
 */
export function getModelsByProvider(provider: string): ChatModel[] {
  switch (provider) {
    case 'openai':
      return openAIModels;
    case 'anthropic':
      return anthropicModels;
    case 'deepseek':
      return deepseekModels;
    default:
      return [];
  }
}

/**
 * Get model by ID
 */
export function getModelById(id: string): ChatModel | undefined {
  return allModels.find((model) => model.id === id);
}

/**
 * Get default model for a provider
 */
export function getDefaultModelForProvider(provider: string): ChatModel | undefined {
  const models = getModelsByProvider(provider);
  return models.length > 0 ? models[0] : undefined;
} 
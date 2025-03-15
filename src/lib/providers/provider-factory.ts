/**
 * Provider factory for LLM API services
 */

import { LLMProvider } from './provider-interface';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { DeepseekProvider } from './deepseek-provider';

/**
 * Create a provider instance based on the provider type
 */
export function createProvider(provider: string): LLMProvider {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider();
    case 'anthropic':
      return new AnthropicProvider();
    case 'deepseek':
      return new DeepseekProvider();
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
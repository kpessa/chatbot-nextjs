import { LLMProvider } from './provider-interface';
import { ProviderResponse } from './provider-types';

export class DeepseekProvider implements LLMProvider {
  async sendMessage(): Promise<ProviderResponse> {
    // Deepseek API implementation would go here
    // For now, we'll throw an error since it's not implemented
    throw new Error('Deepseek provider not implemented');
  }

  async validateApiKey(): Promise<boolean> {
    // Deepseek API key validation would go here
    return false;
  }

  async getModels(): Promise<string[]> {
    // Return known Deepseek models
    return [
      'deepseek-chat',
      'deepseek-coder',
    ];
  }
} 
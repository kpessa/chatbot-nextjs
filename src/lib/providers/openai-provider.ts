import OpenAI from 'openai';
import { LLMProvider } from './provider-interface';
import { ProviderRequestOptions, ProviderResponse } from './provider-types';
import { debugLog } from '../debug';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI | null = null;

  async sendMessage(options: ProviderRequestOptions): Promise<ProviderResponse> {
    if (!this.client) {
      if (!options.apiKey) {
        throw new Error('OpenAI API key is required');
      }
      this.client = new OpenAI({ apiKey: options.apiKey });
    }

    try {
      const response = await this.client.chat.completions.create({
        model: options.model.id,
        messages: options.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      });

      return {
        content: response.choices[0].message.content || '',
        role: 'assistant',
        timestamp: Date.now(),
      };
    } catch (error) {
      debugLog('OpenAI API error:', error);
      throw error;
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const client = new OpenAI({ apiKey });
      await client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  async getModels(apiKey: string): Promise<string[]> {
    try {
      const client = new OpenAI({ apiKey });
      const models = await client.models.list();
      return models.data.map(model => model.id);
    } catch {
      return [];
    }
  }
}

import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider } from './provider-interface';
import { ProviderRequestOptions, ProviderResponse } from './provider-types';
import { debugLog } from '../debug';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic | null = null;

  async sendMessage(options: ProviderRequestOptions): Promise<ProviderResponse> {
    if (!this.client) {
      if (!options.apiKey) {
        throw new Error('Anthropic API key is required');
      }
      this.client = new Anthropic({ apiKey: options.apiKey });
    }

    try {
      const response = await this.client.messages.create({
        model: options.model.id,
        messages: options.messages.map(msg => ({
          role: msg.role === 'system' ? 'user' : msg.role,
          content: msg.content,
        })),
        max_tokens: options.maxTokens,
        temperature: options.temperature,
      });

      const content = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';

      return {
        content,
        role: 'assistant',
        timestamp: Date.now(),
      };
    } catch (error) {
      debugLog('Anthropic API error:', error);
      throw error;
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const client = new Anthropic({ apiKey });
      await client.messages.create({
        model: 'claude-3-opus',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      });
      return true;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    // Anthropic doesn't have a models list endpoint, so we return the known models
    return [
      'claude-3-opus',
      'claude-3-sonnet',
      'claude-2.1',
      'claude-2.0',
      'claude-instant-1.2',
    ];
  }
} 
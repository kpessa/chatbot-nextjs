/**
 * Provider factory for LLM API services
 */

import { ProviderMessage, ProviderRequestOptions, ProviderResponse } from './provider-interface';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Sends a message to the OpenAI API
 */
export async function sendOpenAIMessage(options: ProviderRequestOptions): Promise<ProviderResponse> {
  try {
    const openai = new OpenAI({
      apiKey: options.apiKey,
    });

    // Format messages for OpenAI
    const messages = options.messages.map(({ role, content }) => ({
      role: role === 'assistant' ? 'assistant' : role === 'user' ? 'user' : 'system',
      content,
    }));

    // Send the request to OpenAI
    const response = await openai.chat.completions.create({
      model: options.model,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
    });

    // Extract the response content
    const content = response.choices[0]?.message?.content || '';

    return {
      id: response.id,
      content,
      role: 'assistant',
    };
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw error;
  }
}

/**
 * Sends a message to the Anthropic API
 */
export async function sendAnthropicMessage(options: ProviderRequestOptions): Promise<ProviderResponse> {
  try {
    const anthropic = new Anthropic({
      apiKey: options.apiKey,
    });

    // Format messages for Anthropic
    const messages = options.messages.map(({ role, content }) => ({
      role: role === 'assistant' ? 'assistant' : role === 'user' ? 'user' : 'system',
      content,
    }));

    // Send the request to Anthropic
    const response = await anthropic.messages.create({
      model: options.model,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
    });

    return {
      id: response.id,
      content: response.content[0].text,
      role: 'assistant',
    };
  } catch (error) {
    console.error('Error sending message to Anthropic:', error);
    throw error;
  }
}

/**
 * Sends a message to the Deepseek API
 * Note: This is a placeholder as there's no official Deepseek SDK
 */
export async function sendDeepseekMessage(options: ProviderRequestOptions): Promise<ProviderResponse> {
  try {
    // Format messages for Deepseek
    const messages = options.messages.map(({ role, content }) => ({
      role,
      content,
    }));

    // Send the request to Deepseek
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send message to Deepseek');
    }

    const data = await response.json();

    return {
      id: data.id,
      content: data.choices[0]?.message?.content || '',
      role: 'assistant',
    };
  } catch (error) {
    console.error('Error sending message to Deepseek:', error);
    throw error;
  }
}

/**
 * Sends a message to the appropriate LLM provider based on the provider name
 */
export async function sendMessage(provider: string, options: ProviderRequestOptions): Promise<ProviderResponse> {
  switch (provider) {
    case 'openai':
      return sendOpenAIMessage(options);
    case 'anthropic':
      return sendAnthropicMessage(options);
    case 'deepseek':
      return sendDeepseekMessage(options);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Validates an API key with the appropriate provider
 */
export async function validateApiKey(provider: string, apiKey: string): Promise<boolean> {
  try {
    switch (provider) {
      case 'openai': {
        const openai = new OpenAI({ apiKey });
        await openai.models.list();
        return true;
      }
      case 'anthropic': {
        const anthropic = new Anthropic({ apiKey });
        await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        });
        return true;
      }
      case 'deepseek': {
        // Placeholder for Deepseek API key validation
        const response = await fetch('https://api.deepseek.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        return response.ok;
      }
      default:
        return false;
    }
  } catch (error) {
    console.error(`Error validating ${provider} API key:`, error);
    return false;
  }
}

/**
 * Gets a list of available models from the appropriate provider
 */
export async function getModels(provider: string, apiKey: string): Promise<string[]> {
  try {
    switch (provider) {
      case 'openai': {
        const openai = new OpenAI({ apiKey });
        const response = await openai.models.list();
        return response.data
          .filter((model) => model.id.includes('gpt'))
          .map((model) => model.id);
      }
      case 'anthropic': {
        // Anthropic has a fixed set of models
        return [
          'claude-3-opus-20240229',
          'claude-3-sonnet-20240229',
          'claude-3-haiku-20240307',
        ];
      }
      case 'deepseek': {
        // Placeholder for Deepseek models
        return [
          'deepseek-coder',
          'deepseek-chat',
        ];
      }
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error getting ${provider} models:`, error);
    return [];
  }
} 
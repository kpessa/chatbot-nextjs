/**
 * Model-specific API services for different AI providers
 */

import { Message, ChatModel } from '../types';
import { withRetry, parseApiError } from './error-handling';
import { getModelById } from './model-registry';

// Common interface for all model services
export interface ModelServiceParams {
  messages: { role: string; content: string }[];
  temperature: number;
  maxTokens: number;
  apiKey: string;
  modelId: string;
}

export interface ModelResponse {
  id: string;
  content: string;
}

/**
 * OpenAI/ChatGPT API service
 */
export async function callOpenAI({
  messages,
  temperature,
  maxTokens,
  apiKey,
  modelId,
}: ModelServiceParams): Promise<ModelResponse> {
  return withRetry(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw await parseApiError(response, 'OpenAI');
    }

    const data = await response.json();
    return {
      id: data.id,
      content: data.choices[0].message.content,
    };
  });
}

/**
 * Anthropic/Claude API service
 */
export async function callAnthropic({
  messages,
  temperature,
  maxTokens,
  apiKey,
  modelId,
}: ModelServiceParams): Promise<ModelResponse> {
  return withRetry(async () => {
    // Convert messages to Anthropic format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelId,
        messages: anthropicMessages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw await parseApiError(response, 'Anthropic');
    }

    const data = await response.json();
    return {
      id: data.id,
      content: data.content[0].text,
    };
  });
}

/**
 * Deepseek API service
 */
export async function callDeepseek({
  messages,
  temperature,
  maxTokens,
  apiKey,
  modelId,
}: ModelServiceParams): Promise<ModelResponse> {
  return withRetry(async () => {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw await parseApiError(response, 'Deepseek');
    }

    const data = await response.json();
    return {
      id: data.id,
      content: data.choices[0].message.content,
    };
  });
}

/**
 * Factory function to get the appropriate model service based on provider
 */
export function getModelService(provider: string): (params: ModelServiceParams) => Promise<ModelResponse> {
  switch (provider) {
    case 'openai':
      return callOpenAI;
    case 'anthropic':
      return callAnthropic;
    case 'deepseek':
      return callDeepseek;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
} 
/**
 * Model-specific API services for different AI providers
 */

import { withRetry, parseApiError } from './error-handling';
import { debugFetch, debugLog } from '../debug';

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
    debugLog('OpenAI API: Sending request', { modelId, messagesCount: messages.length });
    
    const response = await debugFetch('https://api.openai.com/v1/chat/completions', {
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
      debugLog('OpenAI API: Error response', { status: response.status });
      throw await parseApiError(response, 'OpenAI');
    }

    const data = await response.json();
    debugLog('OpenAI API: Success response', { id: data.id });
    
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
    debugLog('Anthropic API: Sending request', { modelId, messagesCount: messages.length });
    
    // Convert messages to Anthropic format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const response = await debugFetch('https://api.anthropic.com/v1/messages', {
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
      debugLog('Anthropic API: Error response', { status: response.status });
      throw await parseApiError(response, 'Anthropic');
    }

    const data = await response.json();
    debugLog('Anthropic API: Success response', { id: data.id });
    
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
    debugLog('Deepseek API: Sending request', { modelId, messagesCount: messages.length });
    
    const response = await debugFetch('https://api.deepseek.com/v1/chat/completions', {
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
      debugLog('Deepseek API: Error response', { status: response.status });
      throw await parseApiError(response, 'Deepseek');
    }

    const data = await response.json();
    debugLog('Deepseek API: Success response', { id: data.id });
    
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
  debugLog('Getting model service for provider', { provider });
  
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
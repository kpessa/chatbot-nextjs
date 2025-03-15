/**
 * Provider interface for LLM API services
 */

import { Message } from '../types';

export interface ProviderMessage {
  role: string;
  content: string;
}

export interface ProviderRequestOptions {
  model: string;
  messages: ProviderMessage[];
  temperature: number;
  maxTokens: number;
  apiKey: string;
}

export interface ProviderResponse {
  id: string;
  content: string;
  role: 'assistant';
}

export interface LLMProvider {
  sendMessage: (options: ProviderRequestOptions) => Promise<ProviderResponse>;
  validateApiKey: (apiKey: string) => Promise<boolean>;
  getModels: (apiKey: string) => Promise<string[]>;
} 
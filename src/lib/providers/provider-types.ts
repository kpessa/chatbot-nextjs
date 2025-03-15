import { ChatModel } from '../types';

export interface ProviderMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ProviderRequestOptions {
  model: ChatModel;
  messages: ProviderMessage[];
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

export interface ProviderResponse {
  content: string;
  role: 'assistant';
  timestamp: number;
} 
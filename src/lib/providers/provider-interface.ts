/**
 * Provider interface for LLM API services
 */

import { ProviderRequestOptions, ProviderResponse } from './provider-types';

export interface LLMProvider {
  sendMessage: (options: ProviderRequestOptions) => Promise<ProviderResponse>;
  validateApiKey: (apiKey: string) => Promise<boolean>;
  getModels: (apiKey: string) => Promise<string[]>;
} 
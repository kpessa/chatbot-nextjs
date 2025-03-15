/**
 * Types for the chat interface
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface Message {
  id?: string;
  content: string;
  role: MessageRole;
  timestamp?: number;
  isLoading?: boolean;
  error?: string;
  attachments?: Attachment[];
}

export interface ChatModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'deepseek' | 'custom';
  maxTokens: number;
  temperature: number;
  apiKeyRequired: boolean;
  description?: string;
  supportsFiles?: boolean;
  fileTypes?: string[];
}

export interface ChatSettings {
  selectedModel: ChatModel;
  temperature: number;
  maxTokens: number;
  theme: 'light' | 'dark' | 'system';
  apiKeys: {
    [key: string]: string;
  };
}

export interface ChatState {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  settings: ChatSettings;
  availableModels: ChatModel[];
  selectedModel: ChatModel | null;
}

/**
 * Configuration options for file uploads
 */
export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  multiple?: boolean;
}

/**
 * Response from the file upload API
 */
export interface FileUploadResponse extends Attachment {
  id: string;
  url: string;
}

export type MessageUpdate = Partial<Message>;

export interface APIResponse {
  id: string;
  content: string;
  role: MessageRole;
  timestamp?: number;
} 
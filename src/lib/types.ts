/**
 * Types for the chat interface
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  previewUrl?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  isLoading?: boolean;
  error?: string;
}

export interface ChatModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'deepseek' | 'custom';
  maxTokens?: number;
  temperature?: number;
  apiKeyRequired?: boolean;
}

export interface ChatSettings {
  selectedModel: ChatModel;
  temperature: number;
  maxTokens: number;
  apiKeys: Record<string, string>;
  theme: 'light' | 'dark' | 'system';
}

export interface ChatState {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  settings: ChatSettings;
} 
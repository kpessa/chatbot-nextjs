'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Message, ChatModel, ChatSettings } from './types';
import { v4 as uuidv4 } from 'uuid';

export interface ChatState {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  availableModels: ChatModel[];
  selectedModel: ChatModel | null;
  settings: ChatSettings;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Omit<Message, 'id' | 'timestamp'> }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ChatSettings> }
  | { type: 'SET_MODEL'; payload: ChatModel }
  | { type: 'SET_AVAILABLE_MODELS'; payload: ChatModel[] };

const initialState: ChatState = {
  messages: [],
  isProcessing: false,
  error: null,
  availableModels: [],
  selectedModel: null,
  settings: {
    selectedModel: {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      maxTokens: 8192,
      temperature: 0.7,
      apiKeyRequired: true,
    },
    temperature: 0.7,
    maxTokens: 4096,
    theme: 'system',
    apiKeys: {},
  },
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            ...action.payload,
            id: uuidv4(),
            timestamp: Date.now(),
          },
        ],
      };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.payload.id
            ? { ...message, ...action.payload.updates }
            : message
        ),
      };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'SET_MODEL':
      return {
        ...state,
        selectedModel: action.payload,
      };
    case 'SET_AVAILABLE_MODELS':
      return { ...state, availableModels: action.payload };
    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setMessages: (messages: Message[]) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  setModel: (model: ChatModel) => void;
  setAvailableModels: (models: ChatModel[]) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const value: ChatContextType = {
    state,
    addMessage: (message) => dispatch({ type: 'ADD_MESSAGE', payload: message }),
    setMessages: (messages) => dispatch({ type: 'SET_MESSAGES', payload: messages }),
    setProcessing: (isProcessing) => dispatch({ type: 'SET_PROCESSING', payload: isProcessing }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    updateMessage: (id, updates) => dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates } }),
    clearMessages: () => dispatch({ type: 'CLEAR_MESSAGES' }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    setModel: (model) => dispatch({ type: 'SET_MODEL', payload: model }),
    setAvailableModels: (models) => dispatch({ type: 'SET_AVAILABLE_MODELS', payload: models }),
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 
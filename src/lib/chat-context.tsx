'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, Message, Attachment, ChatModel, ChatSettings } from './types';

// Default models
const DEFAULT_MODELS: ChatModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    maxTokens: 4096,
    temperature: 0.7,
    apiKeyRequired: true,
  },
];

// Default settings
const DEFAULT_SETTINGS: ChatSettings = {
  selectedModel: DEFAULT_MODELS[0],
  temperature: 0.7,
  maxTokens: 4096,
  apiKeys: {},
  theme: 'system',
};

// Initial state
const initialState: ChatState = {
  messages: [],
  isProcessing: false,
  error: null,
  settings: DEFAULT_SETTINGS,
};

// Action types
type ActionType =
  | { type: 'ADD_MESSAGE'; payload: Omit<Message, 'id' | 'timestamp'> }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ChatSettings> }
  | { type: 'SET_MODEL'; payload: ChatModel };

// Reducer function
function chatReducer(state: ChatState, action: ActionType): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: uuidv4(),
            timestamp: Date.now(),
            ...action.payload,
          },
        ],
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
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
      return {
        ...state,
        messages: [],
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case 'SET_MODEL':
      return {
        ...state,
        settings: {
          ...state.settings,
          selectedModel: action.payload,
        },
      };
    default:
      return state;
  }
}

// Create context
const ChatContext = createContext<{
  state: ChatState;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  setModel: (model: ChatModel) => void;
  availableModels: ChatModel[];
}>({
  state: initialState,
  addMessage: () => {},
  setProcessing: () => {},
  setError: () => {},
  updateMessage: () => {},
  clearMessages: () => {},
  updateSettings: () => {},
  setModel: () => {},
  availableModels: DEFAULT_MODELS,
});

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    dispatch({ type: 'SET_PROCESSING', payload: isProcessing });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates } });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const updateSettings = useCallback((settings: Partial<ChatSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const setModel = useCallback((model: ChatModel) => {
    dispatch({ type: 'SET_MODEL', payload: model });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        state,
        addMessage,
        setProcessing,
        setError,
        updateMessage,
        clearMessages,
        updateSettings,
        setModel,
        availableModels: DEFAULT_MODELS,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook for using the chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

// Export available models
export const availableModels = DEFAULT_MODELS; 
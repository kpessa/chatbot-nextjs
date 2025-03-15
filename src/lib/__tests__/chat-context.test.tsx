import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { ChatProvider, useChat } from '../chat-context';
import { ChatModel, Message } from '../types';
import type { ReactNode } from 'react';

// Test component that uses the chat context
function TestComponent({ onMount }: { onMount: (context: ReturnType<typeof useChat>) => void }) {
  const context = useChat();
  onMount(context);
  return null;
}

// Wrapper component to provide children prop
function Wrapper({ children }: { children: ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>;
}

describe('ChatContext', () => {
  it('should provide initial state', () => {
    let contextValue: ReturnType<typeof useChat> | undefined;

    render(
      <Wrapper>
        <TestComponent
          onMount={(context) => {
            contextValue = context;
          }}
        />
      </Wrapper>
    );

    expect(contextValue?.state.messages).toEqual([]);
    expect(contextValue?.state.isProcessing).toBe(false);
    expect(contextValue?.state.error).toBe(null);
    expect(contextValue?.state.settings).toBeDefined();
    expect(contextValue?.state.availableModels).toBeDefined();
  });

  it('should add a message', () => {
    let contextValue: ReturnType<typeof useChat> | undefined;

    render(
      <Wrapper>
        <TestComponent
          onMount={(context) => {
            contextValue = context;
          }}
        />
      </Wrapper>
    );

    const message: Omit<Message, 'id' | 'timestamp'> = {
      role: 'user',
      content: 'Hello',
    };

    act(() => {
      contextValue?.addMessage(message);
    });

    expect(contextValue?.state.messages).toHaveLength(1);
    expect(contextValue?.state.messages[0].content).toBe('Hello');
    expect(contextValue?.state.messages[0].role).toBe('user');
    expect(contextValue?.state.messages[0].id).toBeDefined();
    expect(contextValue?.state.messages[0].timestamp).toBeDefined();
  });

  it('should update message', () => {
    let contextValue: ReturnType<typeof useChat> | undefined;

    render(
      <Wrapper>
        <TestComponent
          onMount={(context) => {
            contextValue = context;
          }}
        />
      </Wrapper>
    );

    // Add a message first
    act(() => {
      contextValue?.addMessage({
        role: 'user',
        content: 'Hello',
      });
    });

    const messageId = contextValue?.state.messages[0].id;

    // Update the message
    act(() => {
      contextValue?.updateMessage(messageId!, {
        content: 'Updated hello',
        isLoading: true,
      });
    });

    expect(contextValue?.state.messages[0].content).toBe('Updated hello');
    expect(contextValue?.state.messages[0].isLoading).toBe(true);
  });

  it('should clear messages', () => {
    let contextValue: ReturnType<typeof useChat> | undefined;

    render(
      <Wrapper>
        <TestComponent
          onMount={(context) => {
            contextValue = context;
          }}
        />
      </Wrapper>
    );

    // Add some messages
    act(() => {
      contextValue?.addMessage({ role: 'user', content: 'Hello' });
      contextValue?.addMessage({ role: 'assistant', content: 'Hi there' });
    });

    expect(contextValue?.state.messages).toHaveLength(2);

    // Clear messages
    act(() => {
      contextValue?.clearMessages();
    });

    expect(contextValue?.state.messages).toHaveLength(0);
  });

  it('should update settings', () => {
    let contextValue: ReturnType<typeof useChat> | undefined;

    render(
      <Wrapper>
        <TestComponent
          onMount={(context) => {
            contextValue = context;
          }}
        />
      </Wrapper>
    );

    const newSettings = {
      temperature: 0.8,
      maxTokens: 2048,
      theme: 'dark' as const,
    };

    act(() => {
      contextValue?.updateSettings(newSettings);
    });

    expect(contextValue?.state.settings.temperature).toBe(0.8);
    expect(contextValue?.state.settings.maxTokens).toBe(2048);
    expect(contextValue?.state.settings.theme).toBe('dark');
  });

  it('should set model', () => {
    let contextValue: ReturnType<typeof useChat> | undefined;

    render(
      <Wrapper>
        <TestComponent
          onMount={(context) => {
            contextValue = context;
          }}
        />
      </Wrapper>
    );

    const newModel: ChatModel = {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'anthropic',
      maxTokens: 4096,
      temperature: 0.7,
      apiKeyRequired: true,
    };

    act(() => {
      contextValue?.setModel(newModel);
    });

    expect(contextValue?.state.settings.selectedModel).toEqual(newModel);
  });

  it('should set processing state', () => {
    let contextValue: ReturnType<typeof useChat> | undefined;

    render(
      <Wrapper>
        <TestComponent
          onMount={(context) => {
            contextValue = context;
          }}
        />
      </Wrapper>
    );

    act(() => {
      contextValue?.setProcessing(true);
    });

    expect(contextValue?.state.isProcessing).toBe(true);

    act(() => {
      contextValue?.setProcessing(false);
    });

    expect(contextValue?.state.isProcessing).toBe(false);
  });

  it('should set error state', () => {
    let contextValue: ReturnType<typeof useChat> | undefined;

    render(
      <Wrapper>
        <TestComponent
          onMount={(context) => {
            contextValue = context;
          }}
        />
      </Wrapper>
    );

    act(() => {
      contextValue?.setError('Something went wrong');
    });

    expect(contextValue?.state.error).toBe('Something went wrong');

    act(() => {
      contextValue?.setError(null);
    });

    expect(contextValue?.state.error).toBe(null);
  });
}); 
import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatProvider, useChat } from '../../chat-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import * as apiService from '../../api-service';
import '@testing-library/jest-dom';

// Mock components
const mockComponents = {
  MessageList: vi.fn(() => <div data-testid="message-list" />),
  ChatInput: vi.fn(() => <div data-testid="chat-input" />),
  ModelSelector: vi.fn(() => <div data-testid="model-selector" />),
};

vi.mock('@/components/message-list', () => ({
  MessageList: mockComponents.MessageList,
}));

vi.mock('@/components/chat-input', () => ({
  ChatInput: mockComponents.ChatInput,
}));

vi.mock('@/components/model-selector', () => ({
  ModelSelector: mockComponents.ModelSelector,
}));

// Mock API service
vi.mock('../../api-service');

// Test component that uses chat functionality
function TestChatInterface() {
  const {
    state,
    addMessage,
    setProcessing,
    setError,
  } = useChat();

  const handleSendMessage = async () => {
    addMessage({
      role: 'user',
      content: 'Test message',
    });

    setProcessing(true);
    try {
      const response = await apiService.sendMessage({
        message: 'Test API message',
        model: state.settings.selectedModel!,
        temperature: state.settings.temperature,
        maxTokens: state.settings.maxTokens,
        conversationHistory: state.messages,
      });

      addMessage({
        role: 'assistant',
        content: response.content,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setProcessing(false);
    }
  };

  const handleUploadFile = async () => {
    const file = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    });

    try {
      await apiService.uploadFile(file);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div>
      <div data-testid="message-count">{state.messages.length}</div>
      <div data-testid="processing">{state.isProcessing.toString()}</div>
      <div data-testid="error">{state.error || 'no-error'}</div>
      <button
        data-testid="send-message"
        onClick={() =>
          addMessage({
            role: 'user',
            content: 'Test message',
          })
        }
      >
        Send Message
      </button>
      <button
        data-testid="trigger-api"
        onClick={handleSendMessage}
      >
        Trigger API
      </button>
      <button
        data-testid="upload-file"
        onClick={handleUploadFile}
      >
        Upload File
      </button>
    </div>
  );
}

describe('Chat Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ChatProvider>{component}</ChatProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

  it('should render chat interface components', () => {
    renderWithProviders(<TestChatInterface />);
    
    expect(screen.getByTestId('message-count')).toHaveTextContent('0');
    expect(screen.getByTestId('processing')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should handle message sending flow', async () => {
    const mockResponse = {
      id: 'response-1',
      content: 'Test response',
      role: 'assistant' as const,
      timestamp: Date.now(),
    };

    (apiService.sendMessage as MockedFunction<typeof apiService.sendMessage>).mockResolvedValueOnce(mockResponse);

    renderWithProviders(<TestChatInterface />);

    // Add a user message
    fireEvent.click(screen.getByTestId('send-message'));
    expect(screen.getByTestId('message-count')).toHaveTextContent('1');

    // Trigger API call
    fireEvent.click(screen.getByTestId('trigger-api'));

    await waitFor(() => {
      expect(screen.getByTestId('processing')).toHaveTextContent('true');
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-count')).toHaveTextContent('3');
      expect(screen.getByTestId('processing')).toHaveTextContent('false');
    });
  });

  it('should handle file upload flow', async () => {
    const mockResponse = {
      id: 'file-1',
      name: 'test.txt',
      url: 'http://example.com/test.txt',
      type: 'text/plain',
      size: 12,
    };

    (apiService.uploadFile as MockedFunction<typeof apiService.uploadFile>).mockResolvedValueOnce(mockResponse);

    renderWithProviders(<TestChatInterface />);

    fireEvent.click(screen.getByTestId('upload-file'));

    await waitFor(() => {
      expect(apiService.uploadFile).toHaveBeenCalled();
    });
  });

  it('should handle API errors', async () => {
    (apiService.sendMessage as MockedFunction<typeof apiService.sendMessage>).mockRejectedValueOnce(new Error('API Error'));

    renderWithProviders(<TestChatInterface />);

    fireEvent.click(screen.getByTestId('trigger-api'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('API Error');
    });
  });

  it('should handle network errors', async () => {
    (apiService.sendMessage as MockedFunction<typeof apiService.sendMessage>).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<TestChatInterface />);

    fireEvent.click(screen.getByTestId('trigger-api'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Network error');
    });
  });
}); 
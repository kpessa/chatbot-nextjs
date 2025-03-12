import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ChatProvider, useChat } from '../../chat-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ChatModel } from '../../types';
import { useSettings } from '../../stores/settings';

// Test component that uses settings functionality
function TestSettingsInterface() {
  const { state, setModel, updateSettings } = useChat();
  const settings = useSettings();

  const handleUpdateSettings = async () => {
    const newSettings = {
      temperature: 0.8,
      maxTokens: 2048,
      theme: 'dark' as const,
    };
    
    await Promise.all([
      new Promise<void>((resolve) => {
        updateSettings(newSettings);
        resolve();
      }),
      new Promise<void>((resolve) => {
        settings.updateSettings(newSettings);
        resolve();
      })
    ]);
  };

  return (
    <div>
      <div data-testid="current-model">{state.settings.selectedModel?.name || 'none'}</div>
      <div data-testid="temperature">{settings.temperature}</div>
      <div data-testid="max-tokens">{settings.maxTokens}</div>
      <div data-testid="theme">{settings.theme}</div>
      
      <button
        data-testid="change-model"
        onClick={() => {
          const newModel: ChatModel = {
            id: 'claude-3-opus',
            name: 'Claude 3 Opus',
            provider: 'anthropic',
            maxTokens: 4096,
            temperature: 0.7,
            apiKeyRequired: true,
          };
          setModel(newModel);
        }}
      >
        Change Model
      </button>
      
      <button
        data-testid="update-settings"
        onClick={handleUpdateSettings}
      >
        Update Settings
      </button>
    </div>
  );
}

describe('Settings Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.resetAllMocks();
    window.localStorage.clear();
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

  it('should render settings interface with default values', () => {
    renderWithProviders(<TestSettingsInterface />);
    
    expect(screen.getByTestId('current-model')).toHaveTextContent('GPT-4o');
    expect(screen.getByTestId('temperature')).toHaveTextContent('0.7');
    expect(screen.getByTestId('max-tokens')).toHaveTextContent('2000');
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });

  it('should update model selection', async () => {
    renderWithProviders(<TestSettingsInterface />);

    fireEvent.click(screen.getByTestId('change-model'));

    await waitFor(() => {
      expect(screen.getByTestId('current-model')).toHaveTextContent('Claude 3 Opus');
    });
  });

  it('should update settings', async () => {
    renderWithProviders(<TestSettingsInterface />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('update-settings'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('temperature')).toHaveTextContent('0.8');
      expect(screen.getByTestId('max-tokens')).toHaveTextContent('2048');
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  it('should persist settings changes', async () => {
    const { unmount } = renderWithProviders(<TestSettingsInterface />);

    // Update settings
    await act(async () => {
      fireEvent.click(screen.getByTestId('update-settings'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('temperature')).toHaveTextContent('0.8');
      expect(screen.getByTestId('max-tokens')).toHaveTextContent('2048');
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
    
    // Wait for localStorage to be updated
    await waitFor(() => {
      const settings = JSON.parse(window.localStorage.getItem('chat-settings') || '{}');
      expect(settings.state.temperature).toBe(0.8);
      expect(settings.state.maxTokens).toBe(2048);
      expect(settings.state.theme).toBe('dark');
    });
    
    // Unmount and remount to test persistence
    unmount();
    
    renderWithProviders(<TestSettingsInterface />);

    await waitFor(() => {
      expect(screen.getByTestId('temperature')).toHaveTextContent('0.8');
      expect(screen.getByTestId('max-tokens')).toHaveTextContent('2048');
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  it('should handle theme changes through ThemeProvider', async () => {
    renderWithProviders(<TestSettingsInterface />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('update-settings'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });
}); 
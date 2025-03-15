'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatProvider } from '@/lib/chat-context';

// Create a client
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Storybook decorator that provides the necessary context for chat components
 */
export const StorybookChatDecorator = ({
  children,
  isDark = false,
}: {
  children: React.ReactNode;
  isDark?: boolean;
}) => {
  const [queryClient] = React.useState(() => createQueryClient());

  // Set theme based on isDark prop
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <div className={`p-4 ${isDark ? 'dark bg-slate-900' : 'bg-white'}`}>
          {children}
        </div>
      </ChatProvider>
    </QueryClientProvider>
  );
};

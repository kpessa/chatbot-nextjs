import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock UUID generation for consistent testing
vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

// Create a global object if it doesn't exist (for browser environment)
const globalObject = typeof window !== 'undefined' ? window : global;

// Mock fetch
globalObject.fetch = vi.fn();

// Mock URL object methods
if (typeof URL !== 'undefined') {
  URL.createObjectURL = vi.fn();
  URL.revokeObjectURL = vi.fn();
}

// Mock window.matchMedia for next-themes
if (typeof window !== 'undefined') {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// Mock window.matchMedia for next-themes in global object
globalObject.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: 'system',
    setTheme: vi.fn(),
    themes: ['light', 'dark', 'system'],
    systemTheme: 'light',
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Use jsdom's FormData implementation
// No need to mock FormData as it's provided by jsdom environment 
import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { StateCreator } from 'zustand'
import { debugLog } from '@/lib/debug'

export interface Settings {
  apiKeys: {
    openai?: string
    anthropic?: string
    deepseek?: string
  }
  theme: 'light' | 'dark' | 'system'
  temperature: number
  maxTokens: number
  streamResponse: boolean
  saveHistory: boolean
  autoSendCode: boolean
}

interface SettingsStore extends Settings {
  setApiKey: (provider: keyof Settings['apiKeys'], key: string) => void
  removeApiKey: (provider: keyof Settings['apiKeys']) => void
  updateSettings: (settings: Partial<Settings>) => void
  resetSettings: () => void
}

type SettingsStorePersist = (
  config: StateCreator<SettingsStore>,
  options: PersistOptions<SettingsStore>
) => StateCreator<SettingsStore>

const initialSettings: Settings = {
  apiKeys: {},
  theme: 'system',
  temperature: 0.7,
  maxTokens: 2000,
  streamResponse: true,
  saveHistory: true,
  autoSendCode: false,
}

export const useSettings = create<SettingsStore>()(
  (persist as SettingsStorePersist)(
    (set): SettingsStore => ({
      ...initialSettings,
      setApiKey: (provider: keyof Settings['apiKeys'], key: string) => {
        debugLog('Settings Store: Setting API key', {
          provider,
          hasKey: !!key,
          keyLength: key.length
        });
        set((state) => ({
          ...state,
          apiKeys: {
            ...state.apiKeys,
            [provider]: key,
          },
        }));
      },
      removeApiKey: (provider: keyof Settings['apiKeys']) => {
        debugLog('Settings Store: Removing API key', { provider });
        set((state) => {
          const newApiKeys = { ...state.apiKeys }
          delete newApiKeys[provider]
          return { ...state, apiKeys: newApiKeys }
        })
      },
      updateSettings: (newSettings: Partial<Settings>) =>
        set((state) => ({
          ...state,
          ...newSettings,
        })),
      resetSettings: () => {
        debugLog('Settings Store: Resetting all settings');
        set(initialSettings)
      },
    }),
    {
      name: 'chat-settings',
      version: 1,
      migrate: (persistedState: unknown, version: number): SettingsStore => {
        debugLog('Settings Store: Migrating state', { version });
        const state = persistedState as Partial<Settings>;
        return {
          ...initialSettings,
          ...state,
          setApiKey: useSettings.getState().setApiKey,
          removeApiKey: useSettings.getState().removeApiKey,
          updateSettings: useSettings.getState().updateSettings,
          resetSettings: useSettings.getState().resetSettings,
        };
      },
      onRehydrateStorage: () => {
        debugLog('Settings Store: Rehydrating from storage');
        return (state) => {
          if (state) {
            debugLog('Settings Store: Rehydrated state', {
              hasOpenAIKey: !!state.apiKeys.openai,
              hasAnthropicKey: !!state.apiKeys.anthropic,
              hasDeepseekKey: !!state.apiKeys.deepseek,
            });
          }
        };
      },
    }
  )
) 
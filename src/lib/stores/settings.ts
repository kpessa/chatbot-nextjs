import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { StateCreator } from 'zustand'

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
      setApiKey: (provider: keyof Settings['apiKeys'], key: string) =>
        set((state: SettingsStore) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: key,
          },
        })),
      removeApiKey: (provider: keyof Settings['apiKeys']) =>
        set((state: SettingsStore) => {
          const newApiKeys = { ...state.apiKeys }
          delete newApiKeys[provider]
          return { apiKeys: newApiKeys }
        }),
      updateSettings: (newSettings: Partial<Settings>) =>
        set((state: SettingsStore) => ({
          ...state,
          ...newSettings,
        })),
      resetSettings: () => set(initialSettings),
    }),
    {
      name: 'chat-settings',
    }
  )
) 
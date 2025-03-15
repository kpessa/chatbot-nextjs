import { create } from "zustand";
import { Message, ChatModel } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface ChatState {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  selectedModel: string | null;
  availableModels: ChatModel[];
}

interface ChatStore extends ChatState {
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setMessages: (messages: Message[]) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  setModel: (modelId: string) => void;
  setAvailableModels: (models: ChatModel[]) => void;
}

export const useChat = create<ChatStore>((set) => ({
  messages: [],
  isProcessing: false,
  error: null,
  selectedModel: null,
  availableModels: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: uuidv4(),
          timestamp: Date.now(),
        },
      ],
    })),
  setMessages: (messages) => set({ messages }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  setModel: (modelId) => set({ selectedModel: modelId }),
  setAvailableModels: (models) => set({ availableModels: models }),
})); 
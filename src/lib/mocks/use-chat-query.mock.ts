/**
 * Mock implementation of the useChatQuery hook for Storybook
 */

import { Attachment } from '../types';

export const mockUseChatQuery = () => {
  return {
    sendMessage: async (message: string, attachments?: Attachment[]) => {
      console.log('Mock sending message:', message, attachments);
      return Promise.resolve();
    },
    uploadFile: async (file: File) => {
      console.log('Mock uploading file:', file.name);
      return Promise.resolve({
        id: file.name,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size,
        file,
      });
    },
    isProcessing: false,
    error: null,
  };
}; 
import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import { sendMessage, uploadFile } from '../api-service';
import { ChatModel, Message, Attachment } from '../types';

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('sendMessage', () => {
    const mockModel: ChatModel = {
      id: "test-model",
      name: "Test Model",
      provider: "openai",
      maxTokens: 2048,
      temperature: 0.7,
      apiKeyRequired: true,
      description: "Test model for unit tests",
      supportsFiles: false,
      fileTypes: []
    };

    const mockMessage = 'Hello, how are you?';
    const mockHistory: Message[] = [
      { id: '1', role: 'user', content: 'Hi', timestamp: Date.now() - 1000 },
      { id: '2', role: 'assistant', content: 'Hello!', timestamp: Date.now() - 500 },
    ];

    it('should successfully send a message without attachments', async () => {
      const mockResponse = {
        id: '123',
        content: 'I am doing well, thank you!',
        role: 'assistant',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await sendMessage({
        message: mockMessage,
        model: mockModel,
        temperature: 0.7,
        maxTokens: 1000,
        conversationHistory: mockHistory,
      });

      expect(result).toEqual({
        id: mockResponse.id,
        content: mockResponse.content,
        role: 'assistant',
        timestamp: expect.any(Number),
      });

      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        body: expect.any(FormData),
      });
    });

    it('should successfully send a message with attachments', async () => {
      const mockAttachments: Attachment[] = [{
        id: 'att1',
        name: 'test.txt',
        type: 'text/plain',
        url: 'http://example.com/test.txt',
        size: 1024,
      }];

      const mockResponse = {
        id: '123',
        content: 'I received your message with attachment',
        role: 'assistant',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await sendMessage({
        message: mockMessage,
        model: mockModel,
        temperature: 0.7,
        maxTokens: 1000,
        conversationHistory: mockHistory,
        attachments: mockAttachments,
      });

      expect(result).toEqual({
        id: mockResponse.id,
        content: mockResponse.content,
        role: 'assistant',
        timestamp: expect.any(Number),
      });

      const fetchCall = fetch as MockedFunction<typeof fetch>;
      const [url, options] = fetchCall.mock.calls[0] ?? [];
      expect(url).toBe('/api/chat');
      expect(options?.method).toBe('POST');
      expect(options?.body instanceof FormData).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Invalid API key';
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(sendMessage({
        message: mockMessage,
        model: mockModel,
        temperature: 0.7,
        maxTokens: 1000,
        conversationHistory: mockHistory,
      })).rejects.toThrow(errorMessage);
    });
  });

  describe('uploadFile', () => {
    it('should successfully upload a file', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const mockResponse = {
        id: 'file123',
        name: 'test.txt',
        type: 'text/plain',
        url: 'http://example.com/test.txt',
        size: 12,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await uploadFile(file);

      expect(result).toEqual({
        ...mockResponse,
        file,
        previewUrl: undefined,
      });

      expect(fetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        body: expect.any(FormData),
      });
    });

    it('should handle upload errors gracefully', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const errorMessage = 'File too large';
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(uploadFile(file)).rejects.toThrow(errorMessage);
    });
  });
}); 
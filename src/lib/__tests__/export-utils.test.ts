import { describe, it, expect } from 'vitest';
import { exportAsText, exportAsJSON, exportAsHTML, exportAsMarkdown } from '../export-utils';
import { Message } from '../types';

describe('Export Utilities', () => {
  // Sample messages for testing
  const sampleMessages: Message[] = [
    {
      id: '1',
      role: 'user',
      content: 'Hello, how can you help me today?',
      timestamp: 1678900000000, // Fixed timestamp for consistent testing
    },
    {
      id: '2',
      role: 'assistant',
      content: 'I can help you with a variety of tasks. What would you like to know?',
      timestamp: 1678900060000, // 1 minute later
    },
  ];

  describe('exportAsText', () => {
    it('should format messages as plain text', () => {
      const result = exportAsText(sampleMessages);
      expect(result).toContain('user: Hello, how can you help me today?');
      expect(result).toContain('assistant: I can help you with a variety of tasks.');
      expect(result.split('\n\n')).toHaveLength(2); // Two messages separated by newlines
    });

    it('should handle empty messages array', () => {
      const result = exportAsText([]);
      expect(result).toBe('');
    });
  });

  describe('exportAsJSON', () => {
    it('should format messages as JSON', () => {
      const result = exportAsJSON(sampleMessages);
      const parsed = JSON.parse(result);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].id).toBe('1');
      expect(parsed[0].role).toBe('user');
      expect(parsed[1].content).toContain('I can help you with a variety of tasks');
    });

    it('should handle empty messages array', () => {
      const result = exportAsJSON([]);
      expect(result).toBe('[]');
    });
  });

  describe('exportAsHTML', () => {
    it('should format messages as HTML', () => {
      const result = exportAsHTML(sampleMessages);
      expect(result).toContain('<title>Chat Export</title>');
      expect(result).toContain('<div class="message user-message">');
      expect(result).toContain('<div class="message ai-message">');
      expect(result).toContain('Hello, how can you help me today?');
      expect(result).toContain('I can help you with a variety of tasks');
    });

    it('should handle newlines in content', () => {
      const messagesWithNewlines: Message[] = [
        {
          id: '1',
          role: 'user',
          content: 'Hello,\nHow are you?',
          timestamp: 1678900000000,
        },
      ];
      const result = exportAsHTML(messagesWithNewlines);
      expect(result).toContain('Hello,<br>How are you?');
    });

    it('should handle empty messages array', () => {
      const result = exportAsHTML([]);
      expect(result).toContain('<div class="chat-container">');
      expect(result).not.toContain('<div class="message');
    });
  });

  describe('exportAsMarkdown', () => {
    it('should format messages as Markdown', () => {
      const result = exportAsMarkdown(sampleMessages);
      expect(result).toContain('## You');
      expect(result).toContain('## AI');
      expect(result).toContain('Hello, how can you help me today?');
      expect(result).toContain('I can help you with a variety of tasks');
      expect(result).toContain('---'); // Separator between messages
    });

    it('should handle empty messages array', () => {
      const result = exportAsMarkdown([]);
      expect(result).toBe('');
    });
  });
}); 
import { Message } from './types';

/**
 * Utility functions for exporting chat conversations in different formats
 */

/**
 * Exports chat messages as plain text
 * @param messages Array of chat messages
 * @returns Plain text representation of the chat
 */
export function exportAsText(messages: Message[]): string {
  return messages
    .map((message) => {
      const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : 'No timestamp';
      return `[${timestamp}] ${message.role}: ${message.content}`;
    })
    .join('\n\n');
}

/**
 * Exports chat messages as JSON
 * @param messages Array of chat messages
 * @returns JSON string of the chat
 */
export function exportAsJSON(messages: Message[]): string {
  return JSON.stringify(messages, null, 2);
}

/**
 * Exports chat messages as HTML
 * @param messages Array of chat messages
 * @returns HTML representation of the chat
 */
export function exportAsHTML(messages: Message[]): string {
  const messageElements = messages
    .map((message) => {
      const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : 'No timestamp';
      const role = message.role === 'user' ? 'You' : 'AI';
      const roleClass = message.role === 'user' ? 'user-message' : 'ai-message';
      
      return `
        <div class="message ${roleClass}">
          <div class="message-header">
            <span class="role">${role}</span>
            <span class="timestamp">${timestamp}</span>
          </div>
          <div class="message-content">${message.content.replace(/\n/g, '<br>')}</div>
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chat Export</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .message { padding: 10px; margin-bottom: 15px; border-radius: 8px; }
        .user-message { background-color: #f0f0f0; }
        .ai-message { background-color: #e6f7ff; }
        .message-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.8em; color: #666; }
        .message-content { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <h1>Chat Export</h1>
      <div class="chat-container">
        ${messageElements}
      </div>
    </body>
    </html>
  `;
}

/**
 * Exports chat messages as Markdown
 * @param messages Array of chat messages
 * @returns Markdown representation of the chat
 */
export function exportAsMarkdown(messages: Message[]): string {
  return messages
    .map((message) => {
      const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : 'No timestamp';
      const role = message.role === 'user' ? 'You' : 'AI';
      return `### ${role} (${timestamp})\n\n${message.content}\n`;
    })
    .join('\n\n');
}

/**
 * Triggers a file download in the browser
 * @param content Content to download
 * @param filename Name of the file
 * @param contentType MIME type of the file
 */
export function downloadFile(content: string, filename: string, contentType: string): void {
  if (typeof window === 'undefined') return;
  
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
} 
/**
 * API service for chat operations
 */

import { Message, ChatModel, Attachment } from './types';
import { getUserFriendlyErrorMessage } from './api/error-handling';

interface SendMessageParams {
  message: string;
  model: ChatModel;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  conversationHistory: Message[];
  attachments?: Attachment[];
}

interface ApiResponse {
  id: string;
  content: string;
  role: 'assistant';
  timestamp: number;
}

/**
 * Sends a message to the selected AI model and returns the response
 */
export async function sendMessage({
  message,
  model,
  temperature,
  maxTokens,
  apiKey,
  conversationHistory,
  attachments,
}: SendMessageParams): Promise<ApiResponse> {
  try {
    // Format the conversation history for the API
    const formattedHistory = conversationHistory.map(({ role, content }) => ({
      role,
      content,
    }));

    // Add the new message to the history
    formattedHistory.push({
      role: 'user',
      content: message,
    });

    // Create form data if there are attachments
    const formData = new FormData();
    
    // Add attachments if any
    if (attachments && attachments.length > 0) {
      attachments.forEach((attachment) => {
        // If the attachment has a file property, add it to the form data
        if (attachment.file) {
          formData.append('files', attachment.file);
        }
      });
    }

    // Add the request data
    formData.append(
      'request',
      JSON.stringify({
        model: model.id,
        messages: formattedHistory,
        temperature,
        max_tokens: maxTokens,
        provider: model.provider,
      })
    );

    // Add the API key if provided
    if (apiKey) {
      formData.append('api_key', apiKey);
    }

    // Send the request to the API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send message');
    }

    const data = await response.json();

    return {
      id: data.id,
      content: data.content,
      role: 'assistant',
      timestamp: Date.now(),
    };
  } catch (error: any) {
    console.error('Error sending message:', error);
    // Convert to user-friendly error message
    const friendlyMessage = getUserFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
}

/**
 * Uploads a file and returns the attachment object
 */
export async function uploadFile(file: File): Promise<Attachment> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload file');
    }

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      url: data.url,
      size: data.size,
      previewUrl: data.previewUrl,
      file: file,
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    // Convert to user-friendly error message
    const friendlyMessage = getUserFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
} 
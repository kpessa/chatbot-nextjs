/**
 * API service for chat operations
 */

import { Message, ChatModel, Attachment } from './types';
import { getUserFriendlyErrorMessage } from './api/error-handling';
import { debugLog, debugFetch } from './debug';

// Extended Attachment type for internal use
interface ExtendedAttachment extends Attachment {
  file?: File;
  previewUrl?: string;
}

interface SendMessageParams {
  message: string;
  model: ChatModel;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  conversationHistory: Message[];
  attachments?: ExtendedAttachment[];
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
    debugLog('Starting sendMessage with:', { message, model, temperature, maxTokens });
    
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
      debugLog('Adding attachments:', attachments.length);
      attachments.forEach((attachment) => {
        // If the attachment has a file property, add it to the form data
        if (attachment.file) {
          formData.append('files', attachment.file);
        }
      });
    }

    // Prepare request data
    const requestData = {
      model: model.id,
      messages: formattedHistory,
      temperature,
      max_tokens: maxTokens,
      provider: model.provider,
    };
    
    debugLog('Request data:', requestData);

    // Add the request data
    formData.append('request', JSON.stringify(requestData));

    // Add the API key if provided
    if (apiKey) {
      debugLog('API key provided for provider:', model.provider);
      formData.append('api_key', apiKey);
    } else {
      debugLog('No API key provided for provider:', model.provider);
    }

    // Send the request to the API using debugFetch
    const response = await debugFetch('/api/chat', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      debugLog('API error response:', errorData);
      throw new Error(errorData.message || 'Failed to send message');
    }

    const data = await response.json();
    debugLog('API success response:', data);

    return {
      id: data.id,
      content: data.content,
      role: 'assistant',
      timestamp: Date.now(),
    };
  } catch (error: unknown) {
    console.error('Error sending message:', error);
    debugLog('Error in sendMessage:', error);
    // Convert to user-friendly error message
    const friendlyMessage = getUserFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
}

/**
 * Uploads a file and returns the attachment object
 */
export async function uploadFile(file: File): Promise<ExtendedAttachment> {
  try {
    debugLog('Starting uploadFile with:', { fileName: file.name, fileSize: file.size, fileType: file.type });
    
    const formData = new FormData();
    formData.append('file', file);

    // Send the request to the API using debugFetch
    const response = await debugFetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      debugLog('Upload API error response:', errorData);
      throw new Error(errorData.message || 'Failed to upload file');
    }

    const data = await response.json();
    debugLog('Upload API success response:', data);

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      url: data.url,
      size: data.size,
      previewUrl: data.previewUrl,
      file: file,
    };
  } catch (error: unknown) {
    console.error('Error uploading file:', error);
    debugLog('Error in uploadFile:', error);
    // Convert to user-friendly error message
    const friendlyMessage = getUserFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
} 
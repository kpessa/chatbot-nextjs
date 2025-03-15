/**
 * API service for chat operations
 */

import { Message, ChatModel, Attachment, FileUploadResponse } from './types';
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
    debugLog('API Service: Starting sendMessage', { 
      message, 
      model: model.id,
      provider: model.provider,
      hasApiKey: !!apiKey,
      historyLength: conversationHistory.length,
      attachmentCount: attachments?.length
    });
    
    // Format the conversation history for the API
    const formattedHistory = conversationHistory.map(({ role, content }) => ({
      role,
      content,
    }));

    debugLog('API Service: Formatted history', { 
      historyLength: formattedHistory.length,
      lastMessage: formattedHistory[formattedHistory.length - 1]
    });

    // Add the new message to the history
    formattedHistory.push({
      role: 'user',
      content: message,
    });

    // Create form data if there are attachments
    const formData = new FormData();
    
    // Add attachments if any
    if (attachments && attachments.length > 0) {
      debugLog('API Service: Processing attachments', { 
        count: attachments.length,
        types: attachments.map(a => a.type)
      });
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
    
    debugLog('API Service: Prepared request data', {
      modelId: requestData.model,
      provider: requestData.provider,
      messageCount: requestData.messages.length,
      temperature: requestData.temperature,
      maxTokens: requestData.max_tokens
    });

    // Add the request data
    formData.append('request', JSON.stringify(requestData));

    // Add the API key if provided
    if (apiKey) {
      debugLog('API Service: Adding API key for provider', { provider: model.provider });
      formData.append('api_key', apiKey);
    } else {
      debugLog('API Service: No API key provided', { provider: model.provider });
    }

    debugLog('API Service: Sending request to /api/chat');
    // Send the request to the API using debugFetch
    const response = await debugFetch('/api/chat', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      debugLog('API Service: Error response from API', errorData);
      throw new Error(errorData.message || 'Failed to send message');
    }

    const data = await response.json();
    debugLog('API Service: Successful response from API', {
      hasId: !!data.id,
      contentLength: data.content?.length,
      role: data.role
    });

    return {
      id: data.id,
      content: data.content,
      role: 'assistant',
      timestamp: Date.now(),
    };
  } catch (error: unknown) {
    console.error('API Service: Error in sendMessage:', error);
    debugLog('API Service: Error details', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    // Convert to user-friendly error message
    const friendlyMessage = getUserFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
}

/**
 * Uploads a file and returns the attachment object
 */
export async function uploadFile(file: File): Promise<FileUploadResponse> {
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
    };
  } catch (error: unknown) {
    console.error('Error uploading file:', error);
    debugLog('Error in uploadFile:', error);
    // Convert to user-friendly error message
    const friendlyMessage = getUserFriendlyErrorMessage(error);
    throw new Error(friendlyMessage);
  }
} 
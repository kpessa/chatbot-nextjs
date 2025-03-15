'use client';

import { useMutation } from '@tanstack/react-query';
import { sendMessage, uploadFile } from './api-service';
import { useChat } from './chat-context';
import { Attachment, MessageUpdate, Message, ChatModel, APIResponse, FileUploadResponse } from './types';
import { v4 as uuidv4 } from 'uuid';
import { debugLog } from './debug';

interface SendMessageVariables {
  message: string;
  model: ChatModel;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  conversationHistory: Message[];
  attachments?: Attachment[];
}

interface MutationContext {
  userMessageId: string;
  assistantMessageId: string;
}

/**
 * Custom hook for chat operations using React Query
 */
export function useChatQuery() {
  const {
    state,
    addMessage,
    setProcessing,
    setError,
    updateMessage,
  } = useChat();

  // Mutation for sending a message
  const sendMessageMutation = useMutation<APIResponse, Error, SendMessageVariables, MutationContext>({
    mutationFn: sendMessage,
    onMutate: (variables) => {
      debugLog('ChatQuery: Starting mutation', { 
        message: variables.message,
        model: variables.model.id,
        attachmentCount: variables.attachments?.length
      });

      // Set processing state
      setProcessing(true);

      // Generate IDs first
      const userMessageId = uuidv4();
      const assistantMessageId = uuidv4();
      const timestamp = Date.now();

      // Add user message to the chat
      debugLog('ChatQuery: Adding user message', { userMessageId });
      addMessage({
        id: userMessageId,
        role: 'user',
        content: variables.message,
        attachments: variables.attachments,
        timestamp,
      });

      // Add a loading message for the assistant
      debugLog('ChatQuery: Adding loading message', { assistantMessageId });
      addMessage({
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isLoading: true,
        timestamp: timestamp + 1, // Ensure it appears after user message
      });

      // Return the IDs for use in onSuccess and onError
      return { userMessageId, assistantMessageId };
    },
    onSuccess: (data, variables, context) => {
      if (!context) return;
      
      debugLog('ChatQuery: Message sent successfully', { 
        assistantMessageId: context.assistantMessageId,
        responseLength: data.content.length
      });

      // First clear processing state
      setProcessing(false);

      // Then update the assistant message with the response
      const messageUpdate: MessageUpdate = {
        content: data.content,
        role: 'assistant',
        isLoading: false,
        timestamp: data.timestamp || Date.now(),
      };

      updateMessage(context.assistantMessageId, messageUpdate);

      debugLog('ChatQuery: Updated message state', {
        messageId: context.assistantMessageId,
        content: data.content,
        isLoading: false,
        timestamp: data.timestamp
      });
    },
    onError: (error, variables, context) => {
      if (!context) return;
      debugLog('ChatQuery: Error sending message', { 
        error: error instanceof Error ? error.message : String(error),
        assistantMessageId: context.assistantMessageId
      });

      // Update the assistant message with the error and clear loading state
      const errorUpdate: MessageUpdate = {
        content: 'An error occurred while processing your request.',
        isLoading: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
      };

      updateMessage(context.assistantMessageId, errorUpdate);

      // Set error state
      setError(error instanceof Error ? error.message : String(error));

      // Clear processing state
      setProcessing(false);
    },
  });

  // Mutation for uploading a file
  const uploadFileMutation = useMutation<FileUploadResponse, Error, File>({
    mutationFn: uploadFile,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    },
  });

  // Function to handle sending a message
  const handleSendMessage = async (message: string, attachments?: Attachment[]) => {
    if (state.isProcessing) {
      debugLog('ChatQuery: Skipping send - already processing');
      return;
    }

    debugLog('ChatQuery: Starting handleSendMessage', {
      message,
      attachmentCount: attachments?.length,
      selectedModel: state.settings.selectedModel.id,
      isProcessing: state.isProcessing
    });

    const { selectedModel, temperature, maxTokens, apiKeys } = state.settings;
    const apiKey = apiKeys[selectedModel.provider]?.trim();

    debugLog('ChatQuery: API key check', {
      provider: selectedModel.provider,
      hasKey: !!apiKey,
      keyLength: apiKey?.length,
      apiKeyRequired: selectedModel.apiKeyRequired
    });

    // If the model requires an API key and it's not provided, show an error
    if (selectedModel.apiKeyRequired && !apiKey) {
      const error = `API key required for ${selectedModel.name}`;
      debugLog('ChatQuery: Missing API key', { 
        provider: selectedModel.provider,
        modelName: selectedModel.name,
        hasKey: !!apiKeys[selectedModel.provider],
        keyLength: apiKeys[selectedModel.provider]?.length
      });
      setError(error);
      return;
    }

    debugLog('ChatQuery: Calling mutation.mutate', {
      hasApiKey: !!apiKey,
      provider: selectedModel.provider,
      modelId: selectedModel.id,
      temperature,
      maxTokens,
      messageCount: state.messages.length
    });
    
    // Send the message
    sendMessageMutation.mutate({
      message,
      model: selectedModel,
      temperature,
      maxTokens,
      apiKey,
      conversationHistory: state.messages,
      attachments,
    });
  };

  // Function to handle uploading a file
  const handleUploadFile = async (file: File) => {
    return uploadFileMutation.mutateAsync(file);
  };

  return {
    sendMessage: handleSendMessage,
    uploadFile: handleUploadFile,
    isProcessing: state.isProcessing,
    error: state.error,
  };
} 
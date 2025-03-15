'use client';

import { useMutation } from '@tanstack/react-query';
import { sendMessage, uploadFile } from './api-service';
import { useChat } from './chat-context';
import { Attachment } from './types';
import { v4 as uuidv4 } from 'uuid';

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
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onMutate: (variables) => {
      // Set processing state
      setProcessing(true);

      // Add user message to the chat
      const userMessageId = uuidv4();
      addMessage({
        role: 'user',
        content: variables.message,
        attachments: variables.attachments,
      });

      // Add a loading message for the assistant
      const assistantMessageId = uuidv4();
      addMessage({
        role: 'assistant',
        content: '',
        isLoading: true,
      });

      // Return the IDs for use in onSuccess and onError
      return { userMessageId, assistantMessageId };
    },
    onSuccess: (data, variables, context) => {
      if (!context) return;

      // Update the assistant message with the response
      updateMessage(context.assistantMessageId, {
        content: data.content,
        isLoading: false,
      });

      // Clear processing state
      setProcessing(false);
    },
    onError: (error, variables, context) => {
      if (!context) return;

      // Update the assistant message with the error
      updateMessage(context.assistantMessageId, {
        content: 'An error occurred while processing your request.',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Set error state
      setError(error instanceof Error ? error.message : 'Unknown error');

      // Clear processing state
      setProcessing(false);
    },
  });

  // Mutation for uploading a file
  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    },
  });

  // Function to handle sending a message
  const handleSendMessage = async (message: string, attachments?: Attachment[]) => {
    if (state.isProcessing) return;

    const { selectedModel, temperature, maxTokens, apiKeys } = state.settings;
    const apiKey = apiKeys[selectedModel.provider];

    // If the model requires an API key and it's not provided, show an error
    if (selectedModel.apiKeyRequired && !apiKey) {
      setError(`API key required for ${selectedModel.name}`);
      return;
    }

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
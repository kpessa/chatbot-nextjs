/**
 * Error handling utilities for API requests
 */

import { debugLog } from '../debug';

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry if it's a client error (4xx)
      if (isClientError(lastError)) {
        debugLog('Client error, not retrying', lastError);
        throw lastError;
      }
      
      retries++;
      
      if (retries >= maxRetries) {
        debugLog(`Max retries (${maxRetries}) reached`, lastError);
        throw lastError;
      }
      
      const delay = initialDelay * Math.pow(2, retries - 1);
      debugLog(`Retry ${retries}/${maxRetries} after ${delay}ms`, lastError);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // This should never happen, but TypeScript needs it
  throw lastError || new Error('Unknown error during retry');
}

/**
 * Check if an error is a client error (4xx)
 */
function isClientError(error: Error): boolean {
  return error.message.includes('status code 4');
}

/**
 * Parse an API error response
 */
export async function parseApiError(response: Response, provider: string): Promise<Error> {
  try {
    const data = await response.json();
    debugLog(`${provider} API error response`, data);
    
    // Extract error message based on provider
    let errorMessage = `${provider} API error: ${response.status} ${response.statusText}`;
    
    if (provider === 'OpenAI') {
      errorMessage = data.error?.message || errorMessage;
    } else if (provider === 'Anthropic') {
      errorMessage = data.error?.message || errorMessage;
    } else if (provider === 'Deepseek') {
      errorMessage = data.error?.message || errorMessage;
    }
    
    return new Error(errorMessage);
  } catch {
    // If we can't parse the JSON, just use the status text
    return new Error(`${provider} API error: ${response.status} ${response.statusText}`);
  }
}

/**
 * Get a user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // API key errors
    if (error.message.includes('API key')) {
      return 'Invalid API key. Please check your API key in the settings.';
    }
    
    // Rate limit errors
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return 'Rate limit exceeded. Please try again later.';
    }
    
    // Model errors
    if (error.message.includes('model')) {
      return 'There was an issue with the selected model. Please try a different model.';
    }
    
    // Network errors
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your internet connection.';
    }
    
    return error.message;
  }
  
  return 'An unknown error occurred. Please try again.';
} 
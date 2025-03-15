/**
 * Error handling and retry utilities for API calls
 */

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  provider: string;

  constructor(message: string, status: number, provider: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.provider = provider;
  }
}

interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableStatusCodes: number[];
}

const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504], // Common retryable status codes
};

/**
 * Executes a function with retry logic
 * @param fn The function to execute
 * @param options Retry options
 * @returns The result of the function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const retryOptions = { ...defaultRetryOptions, ...options };
  let lastError: Error | null = null;
  let delay = retryOptions.initialDelay;

  for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry based on the error
      const shouldRetry =
        attempt < retryOptions.maxRetries &&
        (error instanceof ApiError
          ? retryOptions.retryableStatusCodes.includes(error.status)
          : error.name === 'AbortError' || error.name === 'TimeoutError');

      if (!shouldRetry) {
        break;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Increase delay for next retry with exponential backoff
      delay = Math.min(delay * retryOptions.backoffFactor, retryOptions.maxDelay);
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Parses API error responses
 * @param response Fetch response
 * @param provider API provider name
 * @returns ApiError with appropriate message and status
 */
export async function parseApiError(
  response: Response,
  provider: string
): Promise<ApiError> {
  let errorMessage = `${provider} API error: ${response.status} ${response.statusText}`;

  try {
    const errorData = await response.json();
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch (e) {
    // If we can't parse the JSON, just use the status text
  }

  return new ApiError(errorMessage, response.status, provider);
}

/**
 * Handles common API errors and provides user-friendly messages
 * @param error The error to handle
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (error instanceof ApiError) {
    // Handle specific status codes
    switch (error.status) {
      case 401:
        return `Authentication failed for ${error.provider}. Please check your API key.`;
      case 403:
        return `Access denied for ${error.provider}. Your API key may not have permission to use this model.`;
      case 429:
        return `Rate limit exceeded for ${error.provider}. Please try again later.`;
      case 500:
      case 502:
      case 503:
      case 504:
        return `${error.provider} service is currently unavailable. Please try again later.`;
      default:
        return error.message;
    }
  }

  // Network errors
  if (error.name === 'AbortError') {
    return 'Request timed out. Please check your internet connection and try again.';
  }

  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Default error message
  return error.message || 'An unexpected error occurred. Please try again.';
} 
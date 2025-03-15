/**
 * Debug utility for logging API requests and responses
 */

// Enable or disable debug logging
const DEBUG_ENABLED = true;

/**
 * Log a message to the console if debugging is enabled
 */
export function debugLog(...args: unknown[]) {
  if (DEBUG_ENABLED) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Log API request details
 */
export function logApiRequest(url: string, method: string, body: Record<string, unknown> | unknown) {
  debugLog('API Request:', {
    url,
    method,
    body,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log API response details
 */
export function logApiResponse(url: string, status: number, data: Record<string, unknown> | unknown, error?: Error | unknown) {
  debugLog('API Response:', {
    url,
    status,
    data,
    error,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Create a wrapped fetch function that logs requests and responses
 */
export function createDebugFetch() {
  return async (url: string, options: RequestInit = {}) => {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : undefined;
    
    logApiRequest(url, method, body);
    
    try {
      const response = await fetch(url, options);
      const responseData = await response.clone().json().catch(() => null);
      
      logApiResponse(url, response.status, responseData);
      
      return response;
    } catch (error) {
      logApiResponse(url, 0, null, error);
      throw error;
    }
  };
}

// Export a debug-enabled fetch function
export const debugFetch = createDebugFetch(); 
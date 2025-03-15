/**
 * Debug utilities for logging API requests and responses
 */

// Extend Window interface to include DEBUG_MODE
declare global {
  interface Window {
    DEBUG_MODE?: boolean;
  }
}

// Enable debug mode in development
let DEBUG_MODE = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG === 'true';

/**
 * Log debug messages if debug mode is enabled
 */
export function debugLog(message: string, data?: unknown): void {
  // Check both module-level and window-level debug flags
  const isDebugEnabled = DEBUG_MODE || (typeof window !== 'undefined' && window.DEBUG_MODE);
  
  if (isDebugEnabled) {
    console.log(`[DEBUG] ${message}`, data !== undefined ? data : '');
  }
}

/**
 * Log API requests
 */
export function logApiRequest(endpoint: string, method: string, data: Record<string, unknown>): void {
  // Check both module-level and window-level debug flags
  const isDebugEnabled = DEBUG_MODE || (typeof window !== 'undefined' && window.DEBUG_MODE);
  
  if (isDebugEnabled) {
    console.log(`[API REQUEST] ${method} ${endpoint}`, {
      ...data,
      // Mask API keys for security
      apiKey: data.apiKey ? '***API_KEY_MASKED***' : undefined,
    });
  }
}

/**
 * Log API responses
 */
export function logApiResponse(endpoint: string, status: number, data: unknown, error?: Error): void {
  // Check both module-level and window-level debug flags
  const isDebugEnabled = DEBUG_MODE || (typeof window !== 'undefined' && window.DEBUG_MODE);
  
  if (isDebugEnabled) {
    if (error) {
      console.error(`[API ERROR] ${endpoint} (${status})`, error, data);
    } else {
      console.log(`[API RESPONSE] ${endpoint} (${status})`, data);
    }
  }
}

/**
 * Enable verbose console logging for API requests
 */
export function enableVerboseLogging(): void {
  if (typeof window !== 'undefined') {
    // Enable debug mode at both module and window level
    DEBUG_MODE = true;
    window.DEBUG_MODE = true;
    console.log('[DEBUG] Verbose logging enabled');
    
    // Log initial debug state
    debugLog('Debug mode initialized', {
      moduleDebug: DEBUG_MODE,
      windowDebug: window.DEBUG_MODE,
      nodeEnv: process.env.NODE_ENV,
      publicDebug: process.env.NEXT_PUBLIC_DEBUG,
    });
  }
}

/**
 * Disable verbose console logging
 */
export function disableVerboseLogging(): void {
  if (typeof window !== 'undefined') {
    // Disable debug mode at both module and window level
    DEBUG_MODE = false;
    window.DEBUG_MODE = false;
    console.log('[DEBUG] Verbose logging disabled');
  }
}

/**
 * Create a wrapped fetch function that logs requests and responses
 */
export function createDebugFetch() {
  return async (url: string, options: RequestInit = {}) => {
    const method = options.method || 'GET';
    
    try {
      // Handle FormData bodies differently than JSON bodies
      let bodyForLogging = {};
      if (options.body) {
        if (options.body instanceof FormData) {
          // Convert FormData to object for logging
          const formDataObj: Record<string, unknown> = {};
          options.body.forEach((value, key) => {
            if (key === 'api_key') {
              formDataObj[key] = '***API_KEY_MASKED***';
            } else {
              formDataObj[key] = value;
            }
          });
          bodyForLogging = formDataObj;
        } else if (typeof options.body === 'string') {
          try {
            bodyForLogging = JSON.parse(options.body);
          } catch {
            bodyForLogging = { rawBody: options.body };
          }
        }
      }
    
      logApiRequest(url, method, bodyForLogging);
    
      const response = await fetch(url, options);
      const responseData = await response.clone().json().catch(() => null);
      
      logApiResponse(url, response.status, responseData);
      
      return response;
    } catch (error: unknown) {
      const errorObject = error instanceof Error ? error : new Error(String(error));
      logApiResponse(url, 0, null, errorObject);
      throw error;
    }
  };
}

// Export a debug-enabled fetch function
export const debugFetch = createDebugFetch(); 
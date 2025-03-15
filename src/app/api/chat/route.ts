import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getModelService } from '@/lib/api/model-services';
import { debugLog } from '@/lib/debug';

/**
 * API route for chat
 * Handles routing requests to the appropriate AI model API
 */
export async function POST(request: NextRequest) {
  try {
    debugLog('Chat API: Received request');
    
    // Get the form data
    const formData = await request.formData();
    const requestData = formData.get('request');

    if (!requestData) {
      debugLog('Chat API: Missing request data');
      return NextResponse.json(
        { message: 'Missing request data' },
        { status: 400 }
      );
    }

    // Parse the request data
    const { model, messages, temperature, max_tokens, provider } = JSON.parse(
      requestData.toString()
    );
    
    debugLog('Chat API: Request data parsed', { model, provider, messagesCount: messages.length });

    // Get the API key if provided
    const apiKey = formData.get('api_key')?.toString();
    debugLog('Chat API: API key provided', { hasApiKey: !!apiKey });

    // Validate required fields
    if (!model || !messages || !provider) {
      debugLog('Chat API: Missing required fields', { model, hasMessages: !!messages, provider });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if API key is required but not provided
    if (
      (provider === 'openai' || provider === 'anthropic' || provider === 'deepseek') &&
      !apiKey
    ) {
      debugLog('Chat API: API key required but not provided', { provider });
      return NextResponse.json(
        { message: `API key required for ${provider}` },
        { status: 400 }
      );
    }

    // Use mock response for development if environment variable is set
    if (process.env.USE_MOCK_RESPONSES === 'true') {
      debugLog('Chat API: Using mock response', { provider, model });
      
      // Get the last user message
      const lastUserMessage = messages[messages.length - 1];

      // Mock responses for development
      const mockResponses: Record<string, string> = {
        openai: `This is a mock response from OpenAI's ${model} model. You said: "${lastUserMessage.content}"`,
        anthropic: `This is a mock response from Anthropic's ${model} model. You said: "${lastUserMessage.content}"`,
        deepseek: `This is a mock response from DeepSeek's ${model} model. You said: "${lastUserMessage.content}"`,
        custom: `This is a mock response from a custom model. You said: "${lastUserMessage.content}"`,
      };

      // Add a delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return the mock response
      const mockResponse = {
        id: uuidv4(),
        content: mockResponses[provider] || `You said: "${lastUserMessage.content}"`,
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      debugLog('Chat API: Returning mock response', mockResponse);
      return NextResponse.json(mockResponse);
    }

    try {
      debugLog('Chat API: Getting model service for provider', { provider });
      // Get the appropriate model service
      const modelService = getModelService(provider);

      debugLog('Chat API: Calling model service', { provider, model });
      // Call the model service
      const response = await modelService({
        messages,
        temperature,
        maxTokens: max_tokens,
        apiKey: apiKey || '',
        modelId: model,
      });

      debugLog('Chat API: Model service response received', { provider, hasContent: !!response.content });
      // Return the response
      const apiResponse = {
        id: response.id || uuidv4(),
        content: response.content,
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      debugLog('Chat API: Returning successful response', apiResponse);
      return NextResponse.json(apiResponse);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error calling ${provider} API:`, error);
      debugLog('Chat API: Error calling model service', { provider, error });
      return NextResponse.json(
        { 
          message: `Error from ${provider} API: ${errorMessage}`,
          error: true
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in chat API:', error);
    debugLog('Chat API: Unhandled error', { error });
    return NextResponse.json(
      { message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
} 
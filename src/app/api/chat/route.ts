import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getModelService } from '@/lib/api/model-services';
import { getModelById } from '@/lib/api/model-registry';

/**
 * API route for chat
 * Handles routing requests to the appropriate AI model API
 */
export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const requestData = formData.get('request');

    if (!requestData) {
      return NextResponse.json(
        { message: 'Missing request data' },
        { status: 400 }
      );
    }

    // Parse the request data
    const { model, messages, temperature, max_tokens, provider } = JSON.parse(
      requestData.toString()
    );

    // Get the API key if provided
    const apiKey = formData.get('api_key')?.toString();

    // Validate required fields
    if (!model || !messages || !provider) {
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
      return NextResponse.json(
        { message: `API key required for ${provider}` },
        { status: 400 }
      );
    }

    // Use mock response for development if environment variable is set
    if (process.env.USE_MOCK_RESPONSES === 'true') {
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
      return NextResponse.json({
        id: uuidv4(),
        content: mockResponses[provider] || `You said: "${lastUserMessage.content}"`,
        role: 'assistant',
        timestamp: Date.now(),
      });
    }

    try {
      // Get the appropriate model service
      const modelService = getModelService(provider);

      // Call the model service
      const response = await modelService({
        messages,
        temperature,
        maxTokens: max_tokens,
        apiKey: apiKey || '',
        modelId: model,
      });

      // Return the response
      return NextResponse.json({
        id: response.id || uuidv4(),
        content: response.content,
        role: 'assistant',
        timestamp: Date.now(),
      });
    } catch (error: any) {
      console.error(`Error calling ${provider} API:`, error);
      return NextResponse.json(
        { 
          message: `Error from ${provider} API: ${error.message}`,
          error: true
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * API route for chat
 * This is a placeholder implementation that echoes back the message
 * In a real implementation, this would call the appropriate AI model API
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

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];

    // In a real implementation, this would call the appropriate AI model API
    // For now, we'll just echo back the message with a mock response
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
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
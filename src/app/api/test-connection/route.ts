import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for testing API connections
 */
export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey } = await request.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { message: 'Missing provider or API key' },
        { status: 400 }
      );
    }

    // Test the connection based on the provider
    if (provider === 'openai') {
      return await testOpenAI(apiKey);
    } else if (provider === 'anthropic') {
      return await testAnthropic(apiKey);
    } else if (provider === 'deepseek') {
      return await testDeepseek(apiKey);
    } else {
      return NextResponse.json(
        { message: `Unsupported provider: ${provider}` },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Error testing connection:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'An error occurred while testing the connection' },
      { status: 500 }
    );
  }
}

/**
 * Test OpenAI API connection
 */
async function testOpenAI(apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.error?.message || `Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to connect to OpenAI API' },
      { status: 500 }
    );
  }
}

/**
 * Test Anthropic API connection
 */
async function testAnthropic(apiKey: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.error?.message || `Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to connect to Anthropic API' },
      { status: 500 }
    );
  }
}

/**
 * Test Deepseek API connection
 */
async function testDeepseek(apiKey: string) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.error?.message || `Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to connect to Deepseek API' },
      { status: 500 }
    );
  }
} 
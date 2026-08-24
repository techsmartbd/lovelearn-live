import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Save Visitor Lead when Step 1 "Continue" is clicked
export async function POST(req: Request) {
  try {
    const { name, phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 });
    }

    const cleanedPhone = phone.trim().replace(/[^0-9]/g, '');
    const userName = name && name.trim() ? name.trim() : `ইউজার ${cleanedPhone.slice(-4)}`;

    const lead = await prisma.visitorLead.create({
      data: {
        name: userName,
        phone: cleanedPhone,
        password: password,
      }
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error("Save visitor lead error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: Fetch Visitor Leads for Admin Panel
export async function GET(req: Request) {
  try {
    const leads = await prisma.visitorLead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500
    });

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error("Fetch visitor leads error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array of {key, value} to object {key: value}
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const settings = await request.json(); // Expected: { key1: value1, key2: value2 }
    
    // Process sequentially or using transactions
    const queries = Object.entries(settings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      });
    });
    
    await prisma.$transaction(queries);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings Error:", error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

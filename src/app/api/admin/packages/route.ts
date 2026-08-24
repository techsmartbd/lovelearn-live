import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const packages = await prisma.package.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { title, type, price, description, originalPrice } = body;
    
    if (!title || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPackage = await prisma.package.create({
      data: {
        title,
        type: type || 'TUTORIAL',
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        description: description || null
      }
    });
    
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error("CREATE PACKAGE ERROR:", error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}

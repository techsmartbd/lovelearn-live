import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const defaultBanners = [
  "/uploads/reviews/1.png",
  "/uploads/reviews/2.png",
  "/uploads/reviews/3.png",
  "/uploads/reviews/4.png",
  "/uploads/reviews/5.png"
];

export async function GET() {
  try {
    let setting = await prisma.setting.findUnique({
      where: { key: 'REVIEW_BANNERS' }
    });

    if (!setting) {
      // Create default setting
      try {
        setting = await prisma.setting.upsert({
          where: { key: 'REVIEW_BANNERS' },
          update: {},
          create: {
            key: 'REVIEW_BANNERS',
            value: JSON.stringify(defaultBanners)
          }
        });
      } catch (e) {
        // Fallback in case of concurrent insert
        setting = await prisma.setting.findUnique({
          where: { key: 'REVIEW_BANNERS' }
        });
      }
    }

    const banners = setting?.value ? JSON.parse(setting.value) : defaultBanners;
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const banners = await request.json();
    if (!Array.isArray(banners)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    await prisma.setting.upsert({
      where: { key: 'REVIEW_BANNERS' },
      update: { value: JSON.stringify(banners) },
      create: { key: 'REVIEW_BANNERS', value: JSON.stringify(banners) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save reviews:", error);
    return NextResponse.json({ error: 'Failed to save reviews' }, { status: 500 });
  }
}

export const revalidate = 0; // Fresh details always

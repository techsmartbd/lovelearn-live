import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const videos = await prisma.landingVideo.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch landing videos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { 
      title, 
      type, 
      url, 
      thumbnail,
      isActive
    } = body;
    
    if (!url || !title) {
      return NextResponse.json({ error: 'Title and video URL are required' }, { status: 400 });
    }

    const finalType = type || 'CLOUD';

    // If setting as active, mark all others inactive
    if (isActive) {
      await prisma.landingVideo.updateMany({
        data: { isActive: false }
      });
    }

    const newVideo = await prisma.landingVideo.create({
      data: {
        title,
        type: finalType,
        url,
        thumbnail: thumbnail || null,
        isActive: isActive || false
      }
    });

    // Also update settings table to be backward compatible (or active fallback)
    if (isActive) {
      await prisma.setting.upsert({
        where: { key: 'LANDING_VIDEO_URL' },
        update: { value: url },
        create: { key: 'LANDING_VIDEO_URL', value: url }
      });
      if (thumbnail) {
        await prisma.setting.upsert({
          where: { key: 'LANDING_VIDEO_THUMBNAIL' },
          update: { value: thumbnail },
          create: { key: 'LANDING_VIDEO_THUMBNAIL', value: thumbnail }
        });
      }
    }
    
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Landing video creation error:', error);
    return NextResponse.json({ error: 'Failed to create landing video' }, { status: 500 });
  }
}

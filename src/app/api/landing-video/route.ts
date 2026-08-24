import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Fetch active LandingVideo
    const activeVideo = await prisma.landingVideo.findFirst({
      where: { isActive: true }
    });

    if (activeVideo) {
      return NextResponse.json({
        url: activeVideo.url,
        thumbnail: activeVideo.thumbnail || '',
        type: activeVideo.type
      });
    }

    // 2. Fallback to Setting table
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: ['LANDING_VIDEO_URL', 'LANDING_VIDEO_THUMBNAIL'] }
      }
    });

    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const fallbackUrl = settingsMap.LANDING_VIDEO_URL || '';
    const fallbackThumb = settingsMap.LANDING_VIDEO_THUMBNAIL || '';

    // Determine type from URL fallback
    let fallbackType = 'CLOUD';
    if (fallbackUrl.includes('youtube.com') || fallbackUrl.includes('youtu.be')) {
      fallbackType = 'YOUTUBE';
    } else if (fallbackUrl.includes('vimeo.com')) {
      fallbackType = 'VIMEO';
    }

    return NextResponse.json({
      url: fallbackUrl,
      thumbnail: fallbackThumb,
      type: fallbackType
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active landing video' }, { status: 500 });
  }
}
export const revalidate = 0; // Fresh details always

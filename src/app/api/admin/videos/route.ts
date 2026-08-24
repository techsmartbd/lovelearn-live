import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
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
      description,
      type, 
      url, 
      thumbnail,
      instructor,
      duration,
      videosCount,
      badge,
      packageId,
      isPremium,
      isActive,
      logoName,
      logoColor
    } = body;
    
    if (!url) {
      return NextResponse.json({ error: 'Missing video URL' }, { status: 400 });
    }

    let finalTitle = title;
    let finalThumbnail = thumbnail;
    const finalType = type || 'CLOUD';

    if (finalType !== 'CLOUD' && (!finalTitle || !finalThumbnail)) {
      if (finalType === 'VIMEO') {
        try {
          const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
          if (res.ok) {
            const data = await res.json();
            if (!finalTitle) finalTitle = data.title;
            if (!finalThumbnail) finalThumbnail = data.thumbnail_url;
          }
        } catch (e) {
          console.error('Vimeo oEmbed fetch failed:', e);
        }
      } else if (finalType === 'YOUTUBE') {
        try {
          const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
          if (res.ok) {
            const data = await res.json();
            if (!finalTitle) finalTitle = data.title;
            if (!finalThumbnail) finalThumbnail = data.thumbnail_url;
          }
        } catch (e) {
          console.error('YouTube oEmbed fetch failed:', e);
        }
      }
    }

    if (!finalTitle) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    const newVideo = await prisma.video.create({
      data: {
        title: finalTitle,
        description: description || null,
        type: finalType,
        url,
        thumbnail: finalThumbnail || null,
        instructor: instructor || "সাকিব হাসান",
        duration: duration || "০২ ঘণ্টা ১৫ মিনিট",
        videosCount: videosCount || "১০টি ভিডিও",
        badge: badge || "নতুন",
        packageId: packageId || null,
        isPremium: isPremium !== undefined ? isPremium : true,
        isActive: isActive !== undefined ? isActive : true,
        logoName: logoName || "React",
        logoColor: logoColor || "from-cyan-500 to-blue-600"
      }
    });
    
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Video creation error:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

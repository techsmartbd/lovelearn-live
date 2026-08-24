import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, type, url, thumbnail, instructor, duration, videosCount, badge, packageId, isPremium, isActive, logoName, logoColor } = body;
    
    let finalTitle = title;
    let finalThumbnail = thumbnail;
    const finalType = type || 'YOUTUBE';

    if (!finalTitle || !finalThumbnail) {
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

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        title: finalTitle || 'Untitled Video',
        description: description || null,
        type: finalType,
        url,
        thumbnail: finalThumbnail,
        instructor,
        duration,
        videosCount,
        badge,
        packageId,
        isPremium,
        isActive,
        logoName,
        logoColor
      }
    });
    
    return NextResponse.json(updatedVideo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

import { deleteCloudinaryFile } from '@/lib/cloudinary';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const video = await prisma.video.findUnique({ where: { id } });
    if (video?.url) {
      await deleteCloudinaryFile(video.url);
    }
    
    await prisma.video.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { deleteCloudinaryFile } from '@/lib/cloudinary';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const resolvedParams = await params;
    const body = await request.json();
    const { 
      title, 
      type, 
      url, 
      thumbnail,
      isActive
    } = body;

    // Check if we are toggling the active status of this video
    if (isActive) {
      // 1. Mark all others as inactive
      await prisma.landingVideo.updateMany({
        data: { isActive: false }
      });
      
      // 2. Fetch details of this video to sync settings
      const currentVideo = await prisma.landingVideo.findUnique({
        where: { id: resolvedParams.id }
      });

      if (currentVideo) {
        // 3. Sync settings table
        const activeUrl = url || currentVideo.url;
        const activeThumbnail = thumbnail || currentVideo.thumbnail;

        await prisma.setting.upsert({
          where: { key: 'LANDING_VIDEO_URL' },
          update: { value: activeUrl },
          create: { key: 'LANDING_VIDEO_URL', value: activeUrl }
        });
        if (activeThumbnail) {
          await prisma.setting.upsert({
            where: { key: 'LANDING_VIDEO_THUMBNAIL' },
            update: { value: activeThumbnail },
            create: { key: 'LANDING_VIDEO_THUMBNAIL', value: activeThumbnail }
          });
        }
      }
    }

    const updatedVideo = await prisma.landingVideo.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        type: type || undefined,
        url: url || undefined,
        thumbnail: thumbnail !== undefined ? thumbnail : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error('Landing video update error:', error);
    return NextResponse.json({ error: 'Failed to update landing video' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const resolvedParams = await params;
    
    // Check if we are deleting the active video
    const videoToDelete = await prisma.landingVideo.findUnique({
      where: { id: resolvedParams.id }
    });

    if (videoToDelete?.url) {
      await deleteCloudinaryFile(videoToDelete.url);
    }

    await prisma.landingVideo.delete({
      where: { id: resolvedParams.id }
    });

    // If it was active, reset active status in settings
    if (videoToDelete?.isActive) {
      // Find another video to make active if exists
      const nextActive = await prisma.landingVideo.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      if (nextActive) {
        await prisma.landingVideo.update({
          where: { id: nextActive.id },
          data: { isActive: true }
        });
        await prisma.setting.upsert({
          where: { key: 'LANDING_VIDEO_URL' },
          update: { value: nextActive.url },
          create: { key: 'LANDING_VIDEO_URL', value: nextActive.url }
        });
        if (nextActive.thumbnail) {
          await prisma.setting.upsert({
            where: { key: 'LANDING_VIDEO_THUMBNAIL' },
            update: { value: nextActive.thumbnail },
            create: { key: 'LANDING_VIDEO_THUMBNAIL', value: nextActive.thumbnail }
          });
        }
      } else {
        // Clear settings
        await prisma.setting.deleteMany({
          where: { key: { in: ['LANDING_VIDEO_URL', 'LANDING_VIDEO_THUMBNAIL'] } }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Landing video delete error:', error);
    return NextResponse.json({ error: 'Failed to delete landing video' }, { status: 500 });
  }
}

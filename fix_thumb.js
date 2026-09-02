const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const courseId = 'ff677290-aa35-4f9c-ae66-be8033ae2488';
  
  // Find a video with a thumbnail to use as course thumbnail
  const video = await p.video.findFirst({
    where: { courseId: courseId, thumbnail: { not: null } },
    select: { thumbnail: true }
  });
  
  if (video && video.thumbnail) {
    await p.course.update({
      where: { id: courseId },
      data: { thumbnail: video.thumbnail }
    });
    console.log('Set course thumbnail:', video.thumbnail);
  } else {
    console.log('No video thumbnails found, using default');
    await p.course.update({
      where: { id: courseId },
      data: { thumbnail: '/images/landing-vide-thamb-1.png' }
    });
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const courseId = 'ff677290-aa35-4f9c-ae66-be8033ae2488';
  
  // Assign all videos without courseId to the Master Lover Course
  const result = await p.video.updateMany({
    where: { courseId: null },
    data: { courseId: courseId }
  });
  console.log(`Assigned ${result.count} videos to course`);

  // Set course thumbnail using first video's thumbnail
  const firstVideo = await p.video.findFirst({
    where: { courseId: courseId },
    select: { thumbnail: true }
  });
  
  if (firstVideo?.thumbnail) {
    await p.course.update({
      where: { id: courseId },
      data: { thumbnail: firstVideo.thumbnail }
    });
    console.log(`Set course thumbnail to: ${firstVideo.thumbnail}`);
  }

  // Verify
  const course = await p.course.findUnique({
    where: { id: courseId },
    include: { _count: { select: { videos: true } } }
  });
  console.log(`Course "${course.title}" now has ${course._count.videos} videos`);
  console.log(`Thumbnail: ${course.thumbnail}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

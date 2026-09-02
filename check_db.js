const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const courses = await p.course.findMany({
    include: { _count: { select: { videos: true } } }
  });
  console.log('COURSES:', JSON.stringify(courses, null, 2));
  
  const vids = await p.video.findMany({
    select: { id: true, title: true, courseId: true, isActive: true }
  });
  console.log('VIDEOS:', JSON.stringify(vids, null, 2));
  
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

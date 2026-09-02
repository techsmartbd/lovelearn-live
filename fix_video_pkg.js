const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const correctPackageId = 'b3ac9b90-fbdb-4f7d-b563-44322ee630be'; // Master Lover Course (TUTORIAL)
  
  // Update all videos to have the correct packageId
  const result = await p.video.updateMany({
    where: { courseId: { not: null } },
    data: { packageId: correctPackageId }
  });
  console.log(`Updated ${result.count} videos to correct packageId`);
  
  // Verify
  const vids = await p.video.findMany({
    select: { title: true, packageId: true, courseId: true },
    take: 3
  });
  for (const v of vids) {
    console.log(`  ${v.title.substring(0, 40)}... -> packageId: ${v.packageId}`);
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

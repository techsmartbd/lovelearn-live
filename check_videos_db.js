const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const videos = await prisma.video.findMany();
  videos.forEach(v => console.log(`${v.title} - Premium: ${v.isPremium} - PackageId: ${v.packageId}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());

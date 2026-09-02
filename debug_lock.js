const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Find premium users (users with completed orders)
  const users = await p.user.findMany({
    where: { role: 'USER' },
    include: {
      orders: {
        where: { status: 'COMPLETED' },
        include: { package: true }
      }
    }
  });

  for (const user of users) {
    if (user.orders.length > 0) {
      console.log(`\n=== USER: ${user.name || user.phone} ===`);
      console.log(`Account Status: ${user.accountStatus}`);
      for (const order of user.orders) {
        console.log(`  Order: ${order.package.title} (packageId: ${order.packageId})`);
      }
      
      const ownedPackageIds = user.orders.map(o => o.packageId);
      console.log(`  Owned Package IDs: ${JSON.stringify(ownedPackageIds)}`);
      
      // Check course
      const courses = await p.course.findMany({
        include: { videos: { select: { id: true, title: true, packageId: true, courseId: true } } }
      });
      
      for (const course of courses) {
        console.log(`\n  Course: ${course.title} (packageId: ${course.packageId})`);
        const courseUnlocked = course.packageId ? ownedPackageIds.includes(course.packageId) : false;
        console.log(`  Course Unlocked: ${courseUnlocked}`);
        
        for (const vid of course.videos.slice(0, 3)) {
          const vidUnlocked = !true || ownedPackageIds.includes(vid.packageId);
          console.log(`    Video: ${vid.title.substring(0, 40)}... (packageId: ${vid.packageId}, unlocked: ${vidUnlocked})`);
        }
        if (course.videos.length > 3) {
          console.log(`    ... and ${course.videos.length - 3} more videos`);
        }
      }
    }
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

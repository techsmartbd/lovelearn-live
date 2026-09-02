const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const packages = await p.package.findMany({
    select: { id: true, title: true, type: true, price: true }
  });
  console.log('PACKAGES:', JSON.stringify(packages, null, 2));
  
  // Assign the first TUTORIAL package to the Master Lover Course
  const tutorialPkg = packages.find(p => p.type === 'TUTORIAL');
  if (tutorialPkg) {
    await p.course.update({
      where: { id: 'ff677290-aa35-4f9c-ae66-be8033ae2488' },
      data: { packageId: tutorialPkg.id }
    });
    console.log(`Assigned package "${tutorialPkg.title}" to Master Lover Course`);
  } else {
    console.log('No TUTORIAL package found');
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

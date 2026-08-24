const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { phone: '01800000000' },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Test Student',
      phone: '01800000000',
      email: 'student@test.com',
      password: hashedPassword,
      role: 'USER'
    }
  });

  // Find a package to link the order
  const pkg = await prisma.package.findFirst();
  
  if (pkg) {
    // Create a completed order for the student so they can log in
    await prisma.order.upsert({
      where: { trxId: 'test_trx_123' },
      update: { userId: student.id },
      create: {
        userId: student.id,
        packageId: pkg.id,
        trxId: 'test_trx_123',
        amount: pkg.price,
        status: 'COMPLETED'
      }
    });
    console.log('Completed order created for student.');
  } else {
    console.log('No package found. Please run seed.js first.');
  }

  console.log('Student user created/updated:', student.phone);
}

main().catch(console.error).finally(() => prisma.$disconnect());

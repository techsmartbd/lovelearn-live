const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const pkg = await prisma.package.create({
    data: {
      title: 'Machine Learning Course (Lifetime)',
      description: 'অ্যাডভান্সড Machine Learning ভিডিও কোর্স',
      price: 990,
      originalPrice: 5000,
    }
  });
  console.log('Package created:', pkg);

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      phone: '01700000000',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('Admin user created:', admin.phone);
}

main().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Demo eBooks...");
  
  const ebooks = [
    {
      title: "Think & Grow Rich (Bangla)",
      description: "সফলতার চাবিকাঠি এবং মোটিভেশনাল গাইড",
      pdfUrl: "https://example.com/think-and-grow-rich.pdf",
      thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      isPremium: true,
    },
    {
      title: "Atomic Habits (Bangla Summary)",
      description: "কিভাবে ছোট ছোট অভ্যাস আপনার জীবন পরিবর্তন করতে পারে",
      pdfUrl: "https://example.com/atomic-habits.pdf",
      thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      isPremium: false,
    },
    {
      title: "Clean Code - Programming Best Practices",
      description: "প্রোগ্রামিং এ কিভাবে ক্লিন কোড লিখতে হয় তার বিস্তারিত গাইডলাইন",
      pdfUrl: "https://example.com/clean-code.pdf",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      isPremium: true,
    }
  ];

  for (const ebook of ebooks) {
    await prisma.ebook.create({
      data: ebook
    });
  }
  
  console.log("Successfully created 3 demo eBooks!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

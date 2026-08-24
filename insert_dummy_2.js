
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.smsLog.deleteMany({ where: { trxId: '7X8Y9Z0A' } });
    const log = await prisma.smsLog.create({
      data: {
        from: 'Nagad',
        trxId: '7X8Y9Z0A',
        amount: 990,
        senderPhone: '01711223344',
        message: 'Cash In Tk 990.00 from 01711223344. TxnID: 7X8Y9Z0A. Balance: Tk 1500.00. Date: 10/10/2023 10:10',
        isMatched: false
      }
    });
    console.log('Inserted successfully:', log.trxId, log.senderPhone);
  } catch(e) {
    console.error('Error inserting:', e.message);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

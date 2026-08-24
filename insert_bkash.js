
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const trxId = 'BKASH8Y9Z';
    await prisma.smsLog.deleteMany({ where: { trxId: trxId } });
    const log = await prisma.smsLog.create({
      data: {
        from: 'bKash',
        trxId: trxId,
        amount: 990,
        senderPhone: '01911167991',
        message: 'You have received Tk 990.00 from 01911167991. Ref X. Fee Tk 0.00. Balance Tk 1500.00. TrxID BKASH8Y9Z at 10/10/2023 10:10',
        isMatched: false
      }
    });
    console.log('Inserted successfully:', log.trxId, log.senderPhone);
  } catch(e) {
    console.error('Error inserting:', e.message);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

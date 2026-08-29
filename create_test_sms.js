const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const testTrxId = "TESTTXN" + Math.floor(100000 + Math.random()*900000);
  const testPhone = "017" + Math.floor(10000000 + Math.random()*90000000).toString().substring(0,8);
  const amount = 990;
  // Create SMS log for testing - will be matched as bKash
  const sms = await prisma.smsLog.create({
    data: {
      trxId: testTrxId,
      senderPhone: testPhone,
      amount: amount,
      message: `You have received Tk ${amount}.00 from ${testPhone}. TrxID ${testTrxId} at 29/08/2026 12:00 - TEST FOR LOVELEARN`,
      isMatched: false,
    }
  });
  console.log("Created SMS Log for test:");
  console.log("Phone (senderPhone):", testPhone);
  console.log("TrxID:", testTrxId);
  console.log("Amount:", amount);
  console.log("ID:", sms.id);
  console.log("isMatched:", sms.isMatched);
  console.log("You can use EITHER the phone number OR the TrxID on checkout Step 4 to get instant COMPLETED");
  await prisma.$disconnect();
}
main().catch(e=>{console.error(e); process.exit(1)});

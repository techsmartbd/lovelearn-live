import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { from, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    console.log(`Received SMS from: ${from}, Content: ${message}`);

    // Parse Transaction ID (TrxID) and Amount using Regex
    let trxId = "";
    let amount = 0;

    const lowerMessage = message.toLowerCase();

    // 1. bKash Pattern
    // Example: "You have received Tk 990.00 from 017XXXXXXXX. TrxID 7ABB9C0D at..."
    if (lowerMessage.includes("bkash")) {
      const trxMatch = message.match(/TrxID\s+([A-Z0-9]+)/i);
      const amountMatch = message.match(/(?:Tk|amount)\s*([\d.]+)/i);
      
      if (trxMatch) trxId = trxMatch[1].trim();
      if (amountMatch) amount = parseFloat(amountMatch[1]);
    } 
    // 2. Nagad Pattern
    // Example: "Received Tk. 990.00 from 018XXXXXXXX. TxnID: 7ABB9C0D. Time..."
    else if (lowerMessage.includes("nagad")) {
      const trxMatch = message.match(/(?:TxnID|TrxID)\s*:\s*([A-Z0-9]+)/i);
      const amountMatch = message.match(/(?:Tk|Tk\.|amount)\s*([\d.]+)/i);

      if (trxMatch) trxId = trxMatch[1].trim();
      if (amountMatch) amount = parseFloat(amountMatch[1]);
    }
    // 3. Generic fallback pattern for other payment wallets (Rocket, Upay)
    else {
      const trxMatch = message.match(/(?:TrxID|TxnID|TxID)\s*[:\s]\s*([A-Z0-9]+)/i);
      const amountMatch = message.match(/(?:Tk|Tk\.|amount)\s*([\d.]+)/i);

      if (trxMatch) trxId = trxMatch[1].trim();
      if (amountMatch) amount = parseFloat(amountMatch[1]);
    }

        if (!trxId) {
      return NextResponse.json({ message: "No Transaction ID parsed from SMS." }, { status: 200 });
    }

    console.log(`Parsed Transaction: TrxID=${trxId}, Amount=${amount}`);

    // Save SMS to SmsLog for race-condition protection (whether SMS arrives before or after checkout submit)
    let smsRecord;
    try {
      smsRecord = await prisma.smsLog.upsert({
        where: { trxId },
        update: { amount, from },
        create: { trxId, amount, from }
      });
    } catch (err) {
      console.error("Failed to save SMS log:", err);
    }

    // Find a PENDING order with matching Transaction ID
    const order = await prisma.order.findFirst({
      where: {
        trxId: {
          equals: trxId
        },
        status: "PENDING"
      }
    });

    if (!order) {
      console.log(`No pending order found matching TrxID: ${trxId}. Stored in SmsLog.`);
      return NextResponse.json({ message: "Transaction ID parsed and saved to SmsLog, but no pending order found yet." }, { status: 200 });
    }

    // Verify amount matches
    if (amount > 0 && Math.abs(order.amount - amount) > 5) { // allow small margin of variance
      console.log(`Amount mismatch: Order amount=${order.amount}, SMS amount=${amount}`);
      return NextResponse.json({ error: "Amount mismatch" }, { status: 200 });
    }

    // Update order status to COMPLETED
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED" }
    });

    // Mark SMS log as matched
    if (smsRecord) {
      await prisma.smsLog.update({
        where: { id: smsRecord.id },
        data: { isMatched: true }
      });
    }

    console.log(`Successfully auto-approved order ${order.id} for TrxID: ${trxId}`);

    return NextResponse.json({ success: true, message: `Order approved for TrxID: ${trxId}` }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

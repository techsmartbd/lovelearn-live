import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to extract TrxID and Amount from SMS text
function parseSms(sender: string, text: string) {
  let trxId = null;
  let amount = null;

  const message = text.replace(/\n/g, ' '); // Normalize spaces

  if (sender.toLowerCase().includes('bkash')) {
    // bKash SMS usually looks like:
    // You have received Tk 500.00 from 017XXXXXX. Ref X. Fee Tk 0.00. Balance Tk 1500.00. TrxID 8XXXXXXX at 10/10/2023 10:10
    const trxMatch = message.match(/TrxID\s+([A-Za-z0-9]+)/i);
    if (trxMatch && trxMatch[1]) {
      trxId = trxMatch[1];
    }

    // Match Tk 500.00 or Tk 500
    const amountMatch = message.match(/Tk\s*([\d,]+\.?\d*)/i);
    if (amountMatch && amountMatch[1]) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }
  } else if (sender.toLowerCase().includes('nagad')) {
    // Nagad SMS usually looks like:
    // Cash In Tk 500.00 from 018XXXXXX. TxnID: 7XXXXXXX. Balance: Tk 1500.00. Date: 10/10/2023 10:10
    const txnMatch = message.match(/TxnID\s*:\s*([A-Za-z0-9]+)/i) || message.match(/TxnId\s*:\s*([A-Za-z0-9]+)/i);
    if (txnMatch && txnMatch[1]) {
      trxId = txnMatch[1];
    }

    const amountMatch = message.match(/Tk\s*([\d,]+\.?\d*)/i) || message.match(/Amount\s*:\s*Tk\s*([\d,]+\.?\d*)/i);
    if (amountMatch && amountMatch[1]) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }
  } else {
    // Generic fallback for Rocket, Upay etc.
    const trxMatch = message.match(/(?:TrxID|TxnId|TxnID)[\s:]+([A-Za-z0-9]+)/i);
    if (trxMatch && trxMatch[1]) {
      trxId = trxMatch[1];
    }
    const amountMatch = message.match(/Tk\s*([\d,]+\.?\d*)/i);
    if (amountMatch && amountMatch[1]) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }
  }

  let senderPhone = null;
  const phoneMatch = message.match(/(?:from|by)\s*(01[3-9]\d{8})/i) || message.match(/(01[3-9]\d{8})/);
  if (phoneMatch && phoneMatch[1]) {
    senderPhone = phoneMatch[1];
  }

  return { trxId, amount, senderPhone };
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { sender, message } = payload;

    if (!sender || !message) {
      return NextResponse.json({ error: 'Sender and Message are required' }, { status: 400 });
    }

    const { trxId, amount, senderPhone } = parseSms(sender, message);

    if (!trxId || !amount) {
      return NextResponse.json({ error: 'Could not parse TrxID or Amount from SMS', parsed: { trxId, amount, senderPhone } }, { status: 400 });
    }

    // Check if SMS log already exists
    const existingLog = await prisma.smsLog.findUnique({
      where: { trxId }
    });

    if (existingLog) {
      return NextResponse.json({ success: true, message: 'SMS already logged', data: existingLog });
    }

    // Check if there is an existing PENDING order with this TrxID or Mobile Number
    const existingOrder = await prisma.order.findFirst({
      where: {
        status: 'PENDING',
        OR: [
          { trxId },
          ...(senderPhone ? [{ trxId: senderPhone }] : [])
        ]
      }
    });

    let isMatched = false;

    if (existingOrder && existingOrder.status === 'PENDING') {
      if (Math.abs(existingOrder.amount - amount) <= 5) {
        await prisma.order.update({
          where: { id: existingOrder.id },
          data: { status: 'COMPLETED', trxId }
        });
        isMatched = true;
      }
    }

    // Create the SmsLog
    const smsLog = await prisma.smsLog.create({
      data: {
        from: sender,
        trxId,
        amount,
        senderPhone,
        message,
        isMatched
      }
    });

    return NextResponse.json({ success: true, message: 'SMS processed successfully', smsLog, orderMatched: isMatched });
  } catch (error: any) {
    console.error("Webhook SMS Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

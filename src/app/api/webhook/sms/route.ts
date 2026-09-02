import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to extract TrxID and Amount from SMS text
function parseSms(sender: string, text: string) {
  let trxId = null;
  let amount = null;

  const message = text.replace(/\n/g, ' '); // Normalize spaces

  // Match TxnId, TxnID, TrxID etc universally
  const trxMatch = message.match(/(?:TrxID|TxnId|TxnID|Ref)[\s:]*([A-Za-z0-9]+)/i);
  if (trxMatch && trxMatch[1]) {
    trxId = trxMatch[1];
  }

  // Match Tk 500.00, Tk500, Amount: Tk 500
  const amountMatch = message.match(/(?:Tk|Amount:?\s*Tk)[\s]*([\d,]+\.?\d*)/i);
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  let senderPhone = null;
  const phoneMatch = message.match(/(?:from|by|Sender:?)\s*(01[3-9]\d{8})/i) || message.match(/(01[3-9]\d{8})/);
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

    let { trxId, amount, senderPhone } = parseSms(sender, message);

    let isMatched = false;
    let originalTrxId = trxId;

    if (!trxId) {
      // If we couldn't parse a trxId, we generate a fallback so it saves to the DB for admin review
      trxId = `UNKNOWN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }
    
    if (!amount) {
      amount = 0;
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

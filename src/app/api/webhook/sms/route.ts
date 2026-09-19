import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to extract TrxID, Amount and Sender Phone from SMS text
function parseSms(sender: string, text: string) {
  let trxId = null;
  let amount = null;
  let senderPhone = null;

  const message = text.replace(/\n/g, ' ').replace(/\r/g, ' ');

  // Match TrxID in various formats (bKash, Nagad, Rocket, Upay)
  // e.g. "TrxID 9K8L7M6N", "TxnId: 7XYZ1234", "Trx ID: 12345678", "Trans ID: ABC123"
  const trxMatch = message.match(/(?:Trx\s*ID|Txn\s*ID|TxnId|Trans\s*ID|TID)[\s:\-]*([A-Za-z0-9]+)/i);
  if (trxMatch && trxMatch[1]) {
    trxId = trxMatch[1].trim();
  }

  // Match Tk / BDT / ৳ Amount
  // e.g. "Tk 990.00", "Tk. 990", "Tk990", "Amount: Tk 990", "৳990", "BDT 990"
  const amountMatch = message.match(/(?:Tk\.?|Amount:?\s*Tk\.?|BDT|৳)[\s]*([\d,]+\.?\d*)/i);
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // Match Bangladeshi Sender Phone Numbers
  // e.g. "from 01712345678", "by 01812345678", "Sender: 019...", "+88017..."
  const phoneMatch = message.match(/(?:from|by|Sender:?|From:?)[\sA-Za-z/:]*(?:\+?88)?(01[3-9]\d{8})/i) || 
                     message.match(/(?:\+?88)?(01[3-9]\d{8})/);
  if (phoneMatch && phoneMatch[1]) {
    senderPhone = phoneMatch[1].trim();
  }

  return { trxId, amount, senderPhone };
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Support various SMS forwarder payload key names
    const sender = payload.sender || payload.from || payload.phone || payload.address || 'Unknown';
    const message = payload.message || payload.text || payload.body || payload.content || '';

    if (!message) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    let { trxId, amount, senderPhone } = parseSms(sender, message);

    let isMatched = false;

    if (!trxId) {
      // If we couldn't parse a trxId, generate a fallback so it saves to the DB for admin visibility
      trxId = `UNKNOWN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }
    
    if (!amount) {
      amount = 0;
    }

    // Check if SMS log already exists by TrxID
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
        
        // Also ensure user status is activated
        await prisma.user.update({
          where: { id: existingOrder.userId },
          data: { accountStatus: 'ACTIVE', isBlocked: false }
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

    return NextResponse.json({ 
      success: true, 
      message: 'SMS processed successfully', 
      smsLog, 
      orderMatched: isMatched 
    });
  } catch (error: any) {
    console.error("Webhook SMS Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

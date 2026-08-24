import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: Poll Order Status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ status: order.status });
  } catch (error: any) {
    console.error("Order status polling error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Submit Checkout Details
export async function POST(req: Request) {
  try {
    const { name, phone, password, trxId, amount, paymentMethod, promoCode } = await req.json();

    if (!phone || !password || !trxId) {
      return NextResponse.json({ error: 'মোবাইল নম্বর, পাসওয়ার্ড এবং ট্রানজেকশন আইডি আবশ্যক!' }, { status: 400 });
    }

    const targetAmount = amount ? parseFloat(amount) : 990;
    const rawInput = (trxId || '').trim();
    const cleanPhoneInput = rawInput.replace(/[^0-9]/g, '');
    const isMobileInput = cleanPhoneInput.length === 11 && cleanPhoneInput.startsWith('01');

    // Search for unmatched SMS log by TrxID or Mobile Number
    let smsLog = null;
    if (isMobileInput) {
      smsLog = await prisma.smsLog.findFirst({
        where: {
          isMatched: false,
          OR: [
            { senderPhone: cleanPhoneInput },
            { message: { contains: cleanPhoneInput } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      smsLog = await prisma.smsLog.findFirst({
        where: {
          trxId: rawInput,
          isMatched: false
        }
      });
    }

    let initialStatus = 'PENDING';
    let finalTrxId = rawInput;

    if (smsLog) {
      // Validate amount matches within small variance (e.g. Tk 5 difference limit)
      if (Math.abs(smsLog.amount - targetAmount) > 5) {
        return NextResponse.json({ error: `টাকার পরিমাণ মিলেনি! আপনি ${smsLog.amount} টাকা পাঠিয়েছেন কিন্তু এই প্যাকেজের ফি ${targetAmount} টাকা!` }, { status: 400 });
      }
      initialStatus = 'COMPLETED';
      finalTrxId = smsLog.trxId; // Store actual TrxID on Order
    }

    // Check if Transaction ID is already used under another order
    const existingOrder = await prisma.order.findFirst({
      where: { trxId: finalTrxId }
    });
    if (existingOrder) {
      return NextResponse.json({ error: 'এই ট্রানজেকশন আইডিটি ইতোমধ্যে ব্যবহার করা হয়েছে।' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or find user
    let user = await prisma.user.findUnique({ where: { phone } });
    
    const userName = name && name.trim() ? name.trim() : `ইউজার ${phone.slice(-4)}`;

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          password: hashedPassword,
          name: userName,
        }
      });
    } else if (name && name.trim() && !user.name) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() }
      });
    }

    // Mock Package ID
    let pkg = await prisma.package.findFirst();
    if (!pkg) {
      pkg = await prisma.package.create({
        data: {
          title: 'Machine Learning Course (Lifetime)',
          description: 'অ্যাডভান্সড Machine Learning ভিডিও কোর্স',
          price: 990,
          originalPrice: 5000,
        }
      });
    }

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        trxId: finalTrxId,
        amount: targetAmount,
        status: initialStatus,
      }
    });

    // Mark SMS log as matched if it was already processed
    if (smsLog && initialStatus === 'COMPLETED') {
      await prisma.smsLog.update({
        where: { id: smsLog.id },
        data: { isMatched: true }
      });
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      status: initialStatus,
      redirectUrl: '/checkout/success' 
    });
  } catch (error: any) {
    console.error("Checkout POST Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

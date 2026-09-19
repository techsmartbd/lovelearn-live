import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptPassword } from '@/lib/encryption';

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

    const cleanedPhone = (phone || '').trim().replace(/[^0-9]/g, '');
    const rawInput = (trxId || '').trim();

    if (!cleanedPhone || !rawInput) {
      return NextResponse.json({ error: 'মোবাইল নম্বর এবং ট্রানজেকশন আইডি আবশ্যক!' }, { status: 400 });
    }

    const targetAmount = amount ? parseFloat(amount) : 990;
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
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    // 1. If NO matching SMS found, strictly REJECT without creating any User in DB
    if (!smsLog) {
      return NextResponse.json({ 
        success: false, 
        error: 'আপনার পেমেন্ট আইডি বা ট্রানজেকশন আইডি ভুল। অনুগ্রহ করে সেন্ড মানি সম্পন্ন করে সঠিক ট্রানজেকশন আইডি বা প্রেরক মোবাইল নাম্বার দিন।' 
      }, { status: 400 });
    }

    // 2. If SMS found, check if amount is insufficient
    if (smsLog.amount < targetAmount - 5) {
      return NextResponse.json({ 
        success: false, 
        error: `টাকার পরিমাণ মিলেনি! আপনি ${smsLog.amount} টাকা পাঠিয়েছেন কিন্তু এই প্যাকেজের নির্ধারিত ফি ${targetAmount} টাকা! অনুগ্রহ করে সঠিক পরিমাণ টাকা পরিশোধ করুন।` 
      }, { status: 400 });
    }

    const finalTrxId = smsLog.trxId;

    // 3. Check if Transaction ID is already used in a completed order
    const existingOrder = await prisma.order.findFirst({
      where: { 
        trxId: finalTrxId,
        status: 'COMPLETED'
      }
    });

    if (existingOrder) {
      return NextResponse.json({ 
        success: false, 
        error: 'এই ট্রানজেকশন আইডিটি ইতোমধ্যে ব্যবহার করা হয়েছে।' 
      }, { status: 400 });
    }

    // 4. Encrypt password for 2-way admin decryption & login
    const plainPass = password || `LL${Math.random().toString(36).substring(2, 8)}`;
    const hashedPassword = encryptPassword(plainPass);

    // 5. Create or activate User
    let user = await prisma.user.findUnique({ where: { phone: cleanedPhone } });
    const userName = name && name.trim() ? name.trim() : `ইউজার ${cleanedPhone.slice(-4)}`;

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: cleanedPhone,
          password: hashedPassword,
          name: userName,
          role: 'USER',
          isBlocked: false,
          accountStatus: 'ACTIVE',
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name && name.trim() ? name.trim() : user.name,
          password: hashedPassword,
          isBlocked: false,
          accountStatus: 'ACTIVE',
          expiresAt: null
        }
      });
    }

    // 6. Ensure default package exists
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

    // 7. Create COMPLETED Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        trxId: finalTrxId,
        amount: smsLog.amount || targetAmount,
        status: 'COMPLETED',
      }
    });

    // 8. Mark SMS log as matched
    await prisma.smsLog.update({
      where: { id: smsLog.id },
      data: { isMatched: true }
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      status: 'COMPLETED',
      phone: cleanedPhone,
      redirectUrl: `/checkout/success?phone=${encodeURIComponent(cleanedPhone)}` 
    });
  } catch (error: any) {
    console.error("Checkout POST Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

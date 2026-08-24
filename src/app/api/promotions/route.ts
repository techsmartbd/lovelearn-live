import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch active promotion offers for Checkout Modal
export async function GET() {
  try {
    const offers = await prisma.promotionOffer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });

    // If no offers in DB, return default set
    if (offers.length === 0) {
      return NextResponse.json({
        success: true,
        offers: [
          { id: "normal", title: "Normal", subtitle: "Normal Deposit", discountPct: 0 }
        ]
      });
    }

    return NextResponse.json({ success: true, offers });
  } catch (error: any) {
    console.error("Public fetch promotions error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Validate Promo Code entered by user in Checkout
export async function POST(req: Request) {
  try {
    const { code, baseAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'প্রমো কোড লিখুন!' }, { status: 400 });
    }

    const formattedCode = code.toUpperCase().trim();
    const promo = await prisma.promoCode.findUnique({
      where: { code: formattedCode }
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: 'ভুল অথবা মেয়ারাদোত্তীর্ণ প্রমো কোড!' }, { status: 400 });
    }

    const price = baseAmount ? parseFloat(baseAmount) : 990;
    let discount = 0;

    if (promo.discountType === 'PERCENT') {
      discount = (price * promo.discountVal) / 100;
    } else {
      discount = promo.discountVal;
    }

    if (discount > price) {
      discount = price;
    }

    return NextResponse.json({
      success: true,
      code: promo.code,
      discountType: promo.discountType,
      discountVal: promo.discountVal,
      discountAmount: discount,
      finalAmount: Math.max(0, price - discount),
      message: `${promo.discountType === 'PERCENT' ? `${promo.discountVal}%` : `৳ ${promo.discountVal}`} ডিসকাউন্ট কোড সফলভাবে প্রয়োগ করা হয়েছে!`
    });

  } catch (error: any) {
    console.error("Validate promo code error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

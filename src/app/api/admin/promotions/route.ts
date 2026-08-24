import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to seed default data if DB is empty
async function seedDefaultPromotions() {
  const offersCount = await prisma.promotionOffer.count();
  if (offersCount === 0) {
    await prisma.promotionOffer.create({
      data: { title: "Normal", subtitle: "Normal Deposit", discountPct: 0, isDefault: true, isActive: true }
    });
  }

  const promoCount = await prisma.promoCode.count();
  if (promoCount === 0) {
    await prisma.promoCode.createMany({
      data: [
        { code: "ML10", discountType: "PERCENT", discountVal: 10, isActive: true },
        { code: "DISCOUNT50", discountType: "FLAT", discountVal: 50, isActive: true },
        { code: "FREE", discountType: "FLAT", discountVal: 990, isActive: true }
      ]
    });
  }
}

// GET: Fetch all promotions & promo codes for Admin
export async function GET() {
  try {
    await seedDefaultPromotions();

    const offers = await prisma.promotionOffer.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, offers, promoCodes });
  } catch (error: any) {
    console.error("Fetch admin promotions error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Add or Update Promotion Offer or Promo Code
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, id, title, subtitle, discountPct, code, discountType, discountVal, isActive } = payload;

    if (type === 'OFFER') {
      if (id) {
        // Update existing offer
        const updated = await prisma.promotionOffer.update({
          where: { id },
          data: {
            title,
            subtitle,
            discountPct: parseFloat(discountPct) || 0,
            isActive: isActive !== undefined ? isActive : true
          }
        });
        return NextResponse.json({ success: true, offer: updated });
      } else {
        // Create new offer
        const created = await prisma.promotionOffer.create({
          data: {
            title,
            subtitle,
            discountPct: parseFloat(discountPct) || 0,
            isActive: isActive !== undefined ? isActive : true
          }
        });
        return NextResponse.json({ success: true, offer: created });
      }
    } else if (type === 'PROMO_CODE') {
      const formattedCode = (code || '').toUpperCase().trim();
      if (id) {
        // Update existing promo code
        const updated = await prisma.promoCode.update({
          where: { id },
          data: {
            code: formattedCode,
            discountType: discountType || 'FLAT',
            discountVal: parseFloat(discountVal) || 0,
            isActive: isActive !== undefined ? isActive : true
          }
        });
        return NextResponse.json({ success: true, promoCode: updated });
      } else {
        // Create new promo code
        const created = await prisma.promoCode.create({
          data: {
            code: formattedCode,
            discountType: discountType || 'FLAT',
            discountVal: parseFloat(discountVal) || 0,
            isActive: isActive !== undefined ? isActive : true
          }
        });
        return NextResponse.json({ success: true, promoCode: created });
      }
    }

    return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 });
  } catch (error: any) {
    console.error("Save promotion error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete an offer or promo code
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ error: 'ID and Type are required' }, { status: 400 });
    }

    if (type === 'OFFER') {
      await prisma.promotionOffer.delete({ where: { id } });
    } else if (type === 'PROMO_CODE') {
      await prisma.promoCode.delete({ where: { id } });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error("Delete promotion error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

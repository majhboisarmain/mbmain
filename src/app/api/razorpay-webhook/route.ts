export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/razorpay-webhook',
    message: 'Majh Boisar Razorpay Webhook listener is active and ready to receive events.'
  });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    // Signature verification (if secret configured)
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const isMatch =
        expectedSignature.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

      if (!isMatch) {
        console.warn('⚠️ Razorpay webhook signature verification failed.');
        return NextResponse.json(
          { error: 'Invalid webhook signature.' },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`🔔 Razorpay Webhook Event Received: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity || payload.payload?.order?.entity;
      if (!payment) {
        return NextResponse.json({ received: true, note: 'No payment entity found' });
      }

      const amountPaise = Number(payment.amount || payment.amount_paid || 0);
      const notes = payment.notes || {};
      const contact = payment.contact || notes.phone || '';

      // Determine Subscription Tier
      let tier = 'Starter';
      if (amountPaise >= 200000) {
        tier = 'Enterprise';
      } else if (amountPaise >= 30000) {
        tier = 'Pro';
      } else if (amountPaise >= 14000) {
        tier = 'Starter';
      }

      if (notes.tier || notes.plan) {
        tier = notes.tier || notes.plan;
      }

      console.log(`💰 Payment of ₹${amountPaise / 100} captured. Target Tier: ${tier}. Phone: ${contact}`);

      // 1. If explicit businessId is passed in notes
      if (notes.businessId) {
        const bId = parseInt(notes.businessId, 10);
        if (!isNaN(bId)) {
          await prisma.business.update({
            where: { id: bId },
            data: {
              subscription: tier,
              premium: true,
              verified: true,
            },
          });
          console.log(`✅ Business #${bId} upgraded to ${tier} via Webhook`);
          return NextResponse.json({ received: true, upgradedBusinessId: bId, tier });
        }
      }

      // 2. Fallback: Find most recent business by owner contact phone
      if (contact) {
        const cleanDigits = contact.replace(/\D/g, '').slice(-10);
        if (cleanDigits.length >= 7) {
          const targetBiz = await prisma.business.findFirst({
            where: {
              OR: [
                { createdBy: { contains: cleanDigits.slice(-7) } },
                { phone: { contains: cleanDigits.slice(-7) } },
                { whatsapp: { contains: cleanDigits.slice(-7) } },
              ],
            },
            orderBy: { id: 'desc' },
          });

          if (targetBiz) {
            await prisma.business.update({
              where: { id: targetBiz.id },
              data: {
                subscription: tier,
                premium: true,
                verified: true,
              },
            });
            console.log(`✅ Business #${targetBiz.id} (${targetBiz.name}) auto-upgraded to ${tier} via Webhook`);
            return NextResponse.json({ received: true, upgradedBusinessId: targetBiz.id, tier });
          }
        }
      }
    }

    return NextResponse.json({ received: true, event });
  } catch (error: any) {
    console.error('Error handling Razorpay webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error?.message },
      { status: 500 }
    );
  }
}

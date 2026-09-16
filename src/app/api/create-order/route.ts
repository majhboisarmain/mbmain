import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay API credentials are not configured on the server.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate amount
    const amountNum = Number(amount);
    if (!amount || isNaN(amountNum) || amountNum < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is 100 paise (₹1.00).' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(amountNum), // in paise
      currency: (currency || 'INR').toUpperCase(),
      receipt: receipt ? String(receipt) : `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: typeof notes === 'object' && notes !== null ? notes : {},
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);

    // Auth failures
    if (error?.statusCode === 401 || (error?.message && error.message.toLowerCase().includes('auth'))) {
      return NextResponse.json(
        { error: 'Razorpay authentication failed. Check API credentials.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error?.error?.description || error?.message || 'Failed to create order with Razorpay.' },
      { status: 500 }
    );
  }
}

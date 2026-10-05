import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noteId, amount } = body;

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required to create a purchase order.' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay configuration keys are missing on the server.' },
        { status: 500 }
      );
    }

    // Initialize Razorpay SDK in test mode
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Zero-cost test mode or nominal test order: minimum 1 INR (100 paise) for Razorpay SDK validation
    const parsedAmount = Math.max(1, Math.round(Number(amount) || 1));
    const amountInPaise = parsedAmount * 100;

    // Create order using Razorpay SDK
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${String(noteId).slice(0, 10)}`,
      notes: {
        noteId: String(noteId),
        platform: 'CampusOS_LMS',
        mode: 'test_checkout',
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Insert entry into Supabase `purchases` table with status 'created'
    const purchasePayload = {
      note_id: String(noteId),
      razorpay_order_id: razorpayOrder.id,
      amount: parsedAmount,
      currency: 'INR',
      status: 'created',
      created_at: new Date().toISOString(),
    };

    const { data: purchaseData, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert([purchasePayload])
      .select()
      .maybeSingle();

    if (purchaseError) {
      console.warn('Notice inserting into Supabase purchases table:', purchaseError.message);
      // Secondary fallback to orders table if existing
      await supabaseAdmin.from('orders').insert([
        {
          razorpay_order_id: razorpayOrder.id,
          status: 'created',
          created_at: new Date().toISOString(),
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
      noteId,
      purchase: purchaseData || purchasePayload,
    });
  } catch (err: unknown) {
    console.error('Razorpay order creation error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create Razorpay order.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

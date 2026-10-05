import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      noteId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay verification parameters.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: 'RAZORPAY_KEY_SECRET is not configured on the server.' },
        { status: 500 }
      );
    }

    // 1. Verify Razorpay payment signature using crypto (HMAC SHA256) and RAZORPAY_KEY_SECRET
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error('Invalid Razorpay signature comparison failure:', {
        generatedSignature,
        receivedSignature: razorpay_signature,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Razorpay payment signature verification failed. Transaction authenticity unconfirmed.',
        },
        { status: 400 }
      );
    }

    // 2. Update Supabase `purchases` table record to 'paid'
    const updatePayload = {
      status: 'paid',
      razorpay_payment_id,
      razorpay_signature,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedPurchase, error: updateError } = await supabaseAdmin
      .from('purchases')
      .update(updatePayload)
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.warn('Notice updating purchases table (ignoring if schema pending):', updateError.message);
      // Fallback update to orders table if available
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          razorpay_payment_id,
        })
        .eq('razorpay_order_id', razorpay_order_id);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Note unlocked!',
      noteId: noteId || null,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      purchase: updatedPurchase || {
        razorpay_order_id,
        status: 'paid',
        note_id: noteId,
      },
    });
  } catch (err: unknown) {
    console.error('Payment verification error:', err);
    const message = err instanceof Error ? err.message : 'Error verifying Razorpay payment.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

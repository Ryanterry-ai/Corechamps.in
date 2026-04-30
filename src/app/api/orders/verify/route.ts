import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json()

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      // Dev mode — skip verification
      return NextResponse.json({ success: true, orderId, devMode: true })
    }

    // Verify HMAC-SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 })
    }

    // Payment verified — in production, save order to DB here

    return NextResponse.json({ success: true, orderId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}

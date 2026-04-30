import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { items, total, customer } = await req.json()

    if (!items?.length || !total || !customer) {
      return NextResponse.json({ success: false, error: 'Invalid order data' }, { status: 400 })
    }

    // Generate order ID
    const orderId = `CC-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    // ── Razorpay order creation ──────────────────────────────────────────────
    // Requires: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET env vars
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      // Dev mode — return mock order
      return NextResponse.json({
        success: true,
        orderId,
        razorpayOrderId: `order_dev_${Date.now()}`,
        message: 'Dev mode — add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable live payments',
      })
    }

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(total * 100), // paise
        currency: 'INR',
        receipt: orderId,
        notes: {
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
        },
      }),
    })

    const razorpayData = await razorpayRes.json()

    if (!razorpayRes.ok) {
      console.error('Razorpay error:', razorpayData)
      return NextResponse.json({ success: false, error: 'Payment gateway error' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId,
      razorpayOrderId: razorpayData.id,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
  }
}

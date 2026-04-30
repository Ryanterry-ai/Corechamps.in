'use client'
import { useState } from 'react'
import { useCart } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void }
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true)
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' })
  const [loading, setLoading] = useState(false)
  const [payMethod, setPayMethod] = useState<'razorpay' | 'snapmint'>('razorpay')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.phone.length < 10) e.phone = 'Valid phone number required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (form.pincode.length !== 6) e.pincode = 'Valid 6-digit PIN code required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleRazorpay = async () => {
    if (!validate()) return
    setLoading(true)

    const loaded = await loadRazorpay()
    if (!loaded) {
      alert('Failed to load payment gateway. Please check your internet connection.')
      setLoading(false)
      return
    }

    // Create order via API
    const orderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total, customer: form }),
    })
    const orderData = await orderRes.json()

    if (!orderData.success) {
      alert('Failed to create order. Please try again.')
      setLoading(false)
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: total * 100, // in paise
      currency: 'INR',
      name: 'CORE CHAMPS',
      description: `Order #${orderData.orderId}`,
      order_id: orderData.razorpayOrderId,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: '#FF6B00' },
      handler: async (response: Record<string, string>) => {
        // Verify payment
        const verifyRes = await fetch('/api/orders/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, orderId: orderData.orderId }),
        })
        const verifyData = await verifyRes.json()
        if (verifyData.success) {
          clearCart()
          window.location.href = `/order-success?order=${orderData.orderId}`
        } else {
          alert('Payment verification failed. Contact support.')
        }
      },
      modal: { ondismiss: () => setLoading(false) },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
    setLoading(false)
  }

  const handleSnapmint = async () => {
    if (!validate()) return
    setLoading(true)
    // Snapmint integration — redirect to Snapmint with order details
    // In production, call Snapmint API to generate checkout URL
    alert('Snapmint EMI checkout will be configured with your Snapmint merchant credentials.')
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-white mb-4">Your cart is empty</h1>
        <a href="/collections/all" className="text-brand-primary hover:underline text-sm">Browse products →</a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Contact */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Contact Information</h2>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Phone', key: 'phone', type: 'tel', placeholder: '10-digit mobile number' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</label>
                <input
                  type={type}
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className={`w-full bg-[#1a1a1a] border text-white text-sm rounded-lg px-4 py-3 focus:outline-none transition-colors placeholder-gray-600 ${
                    errors[key] ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Shipping Address</h2>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Flat/House No., Street, Locality"
                className={`w-full bg-[#1a1a1a] border text-white text-sm rounded-lg px-4 py-3 focus:outline-none resize-none placeholder-gray-600 ${
                  errors.address ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'
                }`}
              />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'City', key: 'city', placeholder: 'Mumbai' },
                { label: 'PIN Code', key: 'pincode', placeholder: '400001' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</label>
                  <input
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    maxLength={key === 'pincode' ? 6 : undefined}
                    className={`w-full bg-[#1a1a1a] border text-white text-sm rounded-lg px-4 py-3 focus:outline-none placeholder-gray-600 ${
                      errors[key] ? 'border-red-500' : 'border-brand-border focus:border-brand-primary'
                    }`}
                  />
                  {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Payment Method</h2>
            <div className="space-y-3">
              {[
                {
                  id: 'razorpay' as const,
                  label: 'Pay Now',
                  sublabel: 'Credit/Debit Card, UPI, Net Banking, Wallets',
                  badge: 'Powered by Razorpay',
                },
                {
                  id: 'snapmint' as const,
                  label: 'No-Cost EMI',
                  sublabel: 'Pay in 3–12 easy installments at 0% interest',
                  badge: 'Powered by Snapmint',
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    payMethod === method.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-brand-border hover:border-brand-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={payMethod === method.id}
                    onChange={() => setPayMethod(method.id)}
                    className="mt-0.5 accent-brand-primary"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{method.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{method.sublabel}</div>
                    <div className="text-[10px] text-gray-600 mt-1">{method.badge}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sticky top-24">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 bg-[#1a1a1a] rounded-lg overflow-hidden relative flex-shrink-0 border border-brand-border">
                    {item.image
                      ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">No img</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white leading-tight line-clamp-2">{item.name}</p>
                    {item.variantTitle && <p className="text-[10px] text-gray-500 mt-0.5">{item.variantTitle}</p>}
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-xs font-bold text-white flex-shrink-0">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 py-4 border-y border-brand-border">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className={shipping === 0 ? 'text-green-400 font-semibold' : 'text-white'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-base font-black pt-4 mb-6">
              <span className="text-white">Total</span>
              <span className="text-brand-primary">{formatPrice(total)}</span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-gray-500 mb-4">
                Add <span className="text-white font-semibold">{formatPrice(999 - subtotal)}</span> more for free shipping
              </p>
            )}

            <button
              onClick={payMethod === 'razorpay' ? handleRazorpay : handleSnapmint}
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-brand-primary-dark disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                : payMethod === 'razorpay' ? `Pay ${formatPrice(total)}` : `EMI via Snapmint`}
            </button>

            <p className="text-[10px] text-gray-600 text-center mt-3">
              🔒 Secure & encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

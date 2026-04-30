import Link from 'next/link'

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string }
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-4xl mx-auto mb-6">
        ✓
      </div>
      <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
        Order Confirmed!
      </h1>
      <p className="text-gray-400 text-sm mb-2">
        Thank you for your order. We&apos;ve received your payment and will begin processing your order shortly.
      </p>
      {searchParams.order && (
        <p className="text-xs text-gray-600 mb-8">
          Order ID: <span className="text-gray-400 font-mono">{searchParams.order}</span>
        </p>
      )}
      <p className="text-xs text-gray-500 mb-10">
        A confirmation email will be sent to your email address. Delivery in 2–7 business days.
      </p>
      <Link
        href="/collections/all"
        className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

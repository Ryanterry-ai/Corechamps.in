const TRUST_ITEMS = [
  { icon: '🏆', label: 'GMP Certified' },
  { icon: '🔬', label: 'Science-Based Formula' },
  { icon: '💪', label: 'Full Clinical Doses' },
  { icon: '🚚', label: 'Free Shipping ₹999+' },
  { icon: '↩️', label: 'Easy Returns' },
  { icon: '🔒', label: 'Secure Payments' },
]

export default function TrustBar() {
  return (
    <section className="border-y border-brand-border bg-brand-surface/50 py-6 overflow-hidden">
      <div className="flex gap-10 animate-marquee whitespace-nowrap">
        {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
          <div key={i} className="inline-flex items-center gap-2.5 text-sm text-gray-300 font-semibold">
            <span className="text-xl">{item.icon}</span>
            <span className="uppercase tracking-wide text-xs">{item.label}</span>
            <span className="text-brand-border mx-2">|</span>
          </div>
        ))}
      </div>
    </section>
  )
}

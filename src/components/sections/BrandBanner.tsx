import Link from 'next/link'

interface BrandBannerProps {
  headline?: string
  subtext?: string
  badge?: string
  ctaLabel?: string
  ctaUrl?: string
}

export default function BrandBanner({
  headline = 'BRED TO BE A CHAMPION!',
  subtext = 'Vitamin & Mineral Supplements for A Healthy Lifestyle',
  badge = 'SCIENCE-BASED FORMULAS',
  ctaLabel = 'Explore All Products',
  ctaUrl = '/collections/all',
}: BrandBannerProps) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#0a0a0a]">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,107,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-brand-primary/40 text-brand-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-1 h-4 bg-brand-primary rounded-full" />
          {badge}
          <span className="w-1 h-4 bg-brand-primary rounded-full" />
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase leading-none tracking-tight mb-6">
          {headline.split('CHAMPION').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>{part}<span className="text-brand-primary">CHAMPION</span></span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          {subtext}
        </p>

        {/* CTA */}
        <Link
          href={ctaUrl}
          className="inline-flex items-center gap-3 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold uppercase tracking-widest text-sm px-10 py-4 rounded-lg transition-all duration-200 hover:shadow-[0_0_32px_rgba(255,107,0,0.5)]"
        >
          {ctaLabel}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

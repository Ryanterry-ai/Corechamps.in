import Link from 'next/link'

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaUrl?: string
  image?: string
  bgColor?: string
}

export default function HeroSection({
  headline = 'BRED TO BE A CHAMPION',
  subheadline = 'Science-based sports nutrition supplements formulated with the world\'s most powerful ingredients at full clinical doses.',
  ctaLabel = 'Shop Now',
  ctaUrl = '/collections/all',
  image = '/images/hero/hero-bg.jpg',
  bgColor = '#0a0a0a',
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[520px] sm:min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background image */}
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-primary/20 border border-brand-primary/40 text-brand-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
            New Arrivals Available
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6 uppercase">
            {headline.split(' ').map((word, i) =>
              word === 'CHAMPION' || word === 'CHAMPS' ? (
                <span key={i} className="text-brand-primary">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-md">
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,0,0.5)]"
            >
              {ctaLabel}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/collections/protein"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-brand-primary text-white hover:text-brand-primary font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg transition-all duration-200"
            >
              View Proteins
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
            {[
              { value: '10+', label: 'Products' },
              { value: '100%', label: 'Pure Formula' },
              { value: 'GMP', label: 'Certified' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-black text-brand-primary">{stat.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  )
}

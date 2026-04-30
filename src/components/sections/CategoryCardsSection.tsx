import Link from 'next/link'
import Image from 'next/image'

interface CategoryCard {
  label: string
  tagline: string
  image: string
  url: string
  accent?: string
}

const DEFAULT_CARDS: CategoryCard[] = [
  {
    label: 'Protein',
    tagline: 'The secret ingredient to muscle magic',
    image: '/images/collections/protein.jpg',
    url: '/collections/protein',
    accent: '#FF6B00',
  },
  {
    label: 'Pre-Workout',
    tagline: 'The turbo boost for your fitness journey',
    image: '/images/collections/pre-workout.jpg',
    url: '/collections/pre-workout',
    accent: '#FF6B00',
  },
  {
    label: 'BCAAs & EAAs',
    tagline: 'The secret sauce for muscle growth',
    image: '/images/collections/bcaas-eaas.jpg',
    url: '/collections/bcaas-eaas',
    accent: '#FF6B00',
  },
]

interface CategoryCardsSectionProps {
  title?: string
  cards?: CategoryCard[]
}

export default function CategoryCardsSection({
  title,
  cards = DEFAULT_CARDS,
}: CategoryCardsSectionProps) {
  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
      {title && (
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-10 text-center">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => (
          <Link
            key={card.url}
            href={card.url}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[3/4] bg-brand-surface border border-brand-border hover:border-brand-primary/50 transition-all duration-300"
          >
            {/* Background image */}
            {card.image && (
              <Image
                src={card.image}
                alt={card.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/80 transition-all duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Tagline */}
              <p className="text-xs text-gray-400 italic mb-1 transition-all duration-300 group-hover:text-brand-primary group-hover:translate-y-0">
                {card.tagline}
              </p>

              {/* Label */}
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-3">
                {card.label}
              </h3>

              {/* CTA */}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-primary border-b border-brand-primary/40 group-hover:border-brand-primary pb-0.5 transition-all">
                Shop Now
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>

            {/* Top corner accent */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-primary">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

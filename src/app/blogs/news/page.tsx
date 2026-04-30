import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Blog | CORE CHAMPS' }

// Static placeholder blog posts — in production, driven from CMS
const POSTS = [
  {
    slug: 'whey-protein-vs-isolate',
    title: 'Whey Protein vs Isolate: Which Is Right for You?',
    excerpt: 'Understanding the differences between whey concentrate and isolate so you can choose the right protein for your goals.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Nutrition',
  },
  {
    slug: 'pre-workout-timing',
    title: 'When Should You Take Pre-Workout?',
    excerpt: 'Timing your pre-workout supplement correctly can significantly impact your performance. Here\'s what the research says.',
    date: '2024-01-08',
    readTime: '4 min read',
    category: 'Performance',
  },
  {
    slug: 'bcaa-benefits',
    title: '7 Science-Backed Benefits of BCAAs',
    excerpt: 'BCAAs are among the most researched supplements in sports nutrition. Here are the benefits that actually matter.',
    date: '2023-12-22',
    readTime: '6 min read',
    category: 'Supplements',
  },
  {
    slug: 'creatine-guide',
    title: 'The Complete Guide to Creatine Monohydrate',
    excerpt: 'Creatine is one of the most studied supplements in existence. This is everything you need to know.',
    date: '2023-12-10',
    readTime: '8 min read',
    category: 'Supplements',
  },
]

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          The CORE CHAMPS Blog
        </h1>
        <p className="text-gray-400 text-sm mt-3 max-w-xl">
          Science-backed insights on training, nutrition, recovery, and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/news/${post.slug}`}
            className="group bg-brand-surface border border-brand-border rounded-2xl p-6 hover:border-brand-primary/50 transition-all duration-300"
          >
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
              {post.category}
            </span>
            <h2 className="text-base font-black text-white mt-2 mb-3 leading-snug group-hover:text-brand-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

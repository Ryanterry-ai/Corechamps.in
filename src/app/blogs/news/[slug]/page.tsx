import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props { params: { slug: string } }

// In production these come from CMS/DB
const POSTS: Record<string, { title: string; date: string; category: string; readTime: string; content: string }> = {
  'whey-protein-vs-isolate': {
    title: 'Whey Protein vs Isolate: Which Is Right for You?',
    date: '2024-01-15', category: 'Nutrition', readTime: '5 min read',
    content: `
      <p>When it comes to protein supplements, two names dominate the conversation: whey concentrate and whey isolate. Both are derived from milk during the cheese-making process, but they differ significantly in composition, processing, and ideal use cases.</p>
      <h3>Whey Concentrate</h3>
      <p>Whey concentrate undergoes less processing and retains more of the naturally occurring fats and lactose found in milk. It typically contains 70–80% protein by weight. This makes it a cost-effective option for most people looking to supplement their protein intake.</p>
      <h3>Whey Isolate</h3>
      <p>Whey isolate is filtered further to remove most of the fat and lactose, yielding a product that is 90%+ protein by weight. It's absorbed slightly faster and is often better tolerated by those with lactose sensitivity.</p>
      <h3>Which Should You Choose?</h3>
      <p>For most people, whey concentrate is perfectly adequate and more economical. If you're lactose intolerant, cutting calories aggressively, or want the fastest absorption post-workout, isolate is the better choice.</p>
      <p>CORE CHAMPS offers both options — try our <a href="/products/whey">100% Whey Protein</a> and <a href="/products/isolate-whey">Isolate Whey</a> to find your fit.</p>
    `,
  },
  'pre-workout-timing': {
    title: 'When Should You Take Pre-Workout?',
    date: '2024-01-08', category: 'Performance', readTime: '4 min read',
    content: `
      <p>Timing is everything with pre-workout supplements. Take it too early and the effects wear off before your workout peaks. Take it too late and you're still buzzing at midnight.</p>
      <h3>The Optimal Window</h3>
      <p>For most pre-workouts, 20–30 minutes before training is the sweet spot. This gives caffeine and other stimulants time to reach peak blood levels as you begin lifting.</p>
      <h3>For Beginners</h3>
      <p>Start with half a serving to assess your tolerance. CORE CHAMPS RDX is powerful — respect it.</p>
      <p>Check out <a href="/products/rdx-pre-workout">CORE CHAMPS RDX Pre-Workout</a> for a full breakdown of what's in each scoop.</p>
    `,
  },
  'bcaa-benefits': {
    title: '7 Science-Backed Benefits of BCAAs',
    date: '2023-12-22', category: 'Supplements', readTime: '6 min read',
    content: `
      <p>BCAAs — Leucine, Isoleucine, and Valine — are three of the nine essential amino acids. "Essential" means your body cannot synthesize them; they must come from diet or supplementation.</p>
      <h3>1. Stimulate Muscle Protein Synthesis</h3>
      <p>Leucine is the primary driver of muscle protein synthesis (MPS). Studies show that even in the absence of other amino acids, leucine alone can trigger MPS pathways.</p>
      <h3>2. Reduce Exercise-Induced Muscle Damage</h3>
      <p>BCAA supplementation has been consistently shown to reduce markers of muscle damage after intense exercise, including DOMS (delayed onset muscle soreness).</p>
      <h3>3. Prevent Muscle Wasting</h3>
      <p>During caloric restriction or prolonged training, BCAAs help preserve lean muscle tissue by providing an alternative fuel source and stimulating anti-catabolic pathways.</p>
      <p>Try <a href="/products/bcaa-7000mg">CORE CHAMPS BCAA 7000 MG</a> intra-workout for maximum benefit.</p>
    `,
  },
  'creatine-guide': {
    title: 'The Complete Guide to Creatine Monohydrate',
    date: '2023-12-10', category: 'Supplements', readTime: '8 min read',
    content: `
      <p>Creatine monohydrate is the most researched supplement in sports nutrition history. With thousands of peer-reviewed studies confirming its safety and efficacy, it remains the gold standard for strength and performance.</p>
      <h3>How It Works</h3>
      <p>Creatine replenishes phosphocreatine stores in muscle cells, which are used to regenerate ATP during high-intensity, short-duration activities like weightlifting and sprinting.</p>
      <h3>Dosing Protocol</h3>
      <p>The most practical approach: 3–5 grams daily, every day. Loading is optional but not necessary. Consistency matters more than timing.</p>
      <h3>Safety</h3>
      <p>Creatine is safe for healthy adults. Decades of research show no harmful effects on kidney or liver function in people without pre-existing conditions.</p>
      <p>Get started with <a href="/products/creatine">CORE CHAMPS Creatine 5000 MG</a> — 100% pure micronized monohydrate, no additives.</p>
    `,
  },
}

export default function BlogArticle({ params }: Props) {
  const post = POSTS[params.slug]
  if (!post) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Back */}
      <Link href="/blogs/news" className="text-xs text-gray-500 hover:text-brand-primary transition-colors flex items-center gap-1 mb-8">
        ← Back to Blog
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{post.category}</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-2 mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Body */}
      <div
        className="prose prose-sm prose-invert max-w-none
          [&_h3]:text-base [&_h3]:font-black [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:uppercase [&_h3]:tracking-tight
          [&_p]:text-gray-400 [&_p]:leading-relaxed [&_p]:mb-5
          [&_a]:text-brand-primary [&_a]:hover:underline [&_a]:font-semibold"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Back to shop CTA */}
      <div className="mt-12 pt-8 border-t border-brand-border">
        <Link
          href="/collections/all"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-colors"
        >
          Shop All Products →
        </Link>
      </div>
    </div>
  )
}

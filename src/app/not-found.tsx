import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black text-brand-primary mb-4">404</div>
      <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Page Not Found</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-lg transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/collections/all"
          className="border border-brand-border hover:border-brand-primary text-gray-300 hover:text-brand-primary font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-lg transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  )
}

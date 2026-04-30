'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import MobileNav from './MobileNav'

const NAV_LINKS = [
  { label: 'Protein', href: '/collections/protein' },
  { label: 'Pre-Workout', href: '/collections/pre-workout' },
  { label: 'BCAAs & EAAs', href: '/collections/bcaas-eaas' },
  { label: 'All Products', href: '/collections/all' },
  { label: 'Blog', href: '/blogs/news' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-primary text-white text-center text-xs sm:text-sm font-semibold py-2 px-4 overflow-hidden">
        <div className="inline-flex gap-16 animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i}>
              🔥 Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; Use code{' '}
              <strong>CHAMPS10</strong> for 10% OFF &nbsp;|&nbsp; Bred To Be A
              Champion
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg border-b border-brand-border'
            : 'bg-[#111111]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-brand-primary transition-colors">
              CORE<span className="text-brand-primary">CHAMPS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-gray-300 hover:text-brand-primary transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Utility */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Link
              href="/search"
              aria-label="Search"
              className="hidden sm:flex text-gray-400 hover:text-brand-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label={`Cart — ${itemCount} items`}
              className="relative flex items-center text-gray-400 hover:text-brand-primary transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNav links={NAV_LINKS} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

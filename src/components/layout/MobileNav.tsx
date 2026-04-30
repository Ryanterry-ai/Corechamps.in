'use client'
import { useEffect } from 'react'
import Link from 'next/link'

interface MobileNavProps {
  links: { label: string; href: string }[]
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ links, isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#111111] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <div className="text-lg font-black tracking-tighter text-white">
            CORE<span className="text-brand-primary">CHAMPS</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block px-4 py-3.5 text-base font-semibold text-gray-300 hover:text-brand-primary hover:bg-brand-surface rounded-lg transition-all uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-brand-border">
          <p className="text-xs text-gray-500">BRED TO BE A CHAMPION 💪</p>
        </div>
      </div>
    </>
  )
}

import Link from 'next/link'

const footerLinks = {
  Shop: [
    { label: 'Protein', href: '/collections/protein' },
    { label: 'Pre-Workout', href: '/collections/pre-workout' },
    { label: 'BCAAs & EAAs', href: '/collections/bcaas-eaas' },
    { label: 'All Products', href: '/collections/all' },
  ],
  Information: [
    { label: 'About Us', href: '/pages/about' },
    { label: 'Blog', href: '/blogs/news' },
    { label: 'Contact Us', href: '/pages/contact' },
  ],
  Policies: [
    { label: 'Privacy Policy', href: '/pages/privacy-policy' },
    { label: 'Terms & Conditions', href: '/pages/terms-conditions' },
    { label: 'Return & Refund', href: '/pages/return-refund-policy' },
    { label: 'Shipping Policy', href: '/pages/shipping-policy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-brand-border mt-20">
      {/* Footer marquee */}
      <div className="overflow-hidden border-b border-brand-border py-3">
        <div className="flex gap-12 animate-marquee-reverse whitespace-nowrap text-xs text-gray-600 font-semibold uppercase tracking-widest">
          {[...Array(6)].map((_, i) => (
            <span key={i}>CORE CHAMPS · BRED TO BE A CHAMPION · SCIENCE-BASED NUTRITION ·</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-black tracking-tighter text-white">
              CORE<span className="text-brand-primary">CHAMPS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Science-based sports nutrition supplements. Formulated with world's
              most powerful ingredients at full clinical doses.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { label: 'Facebook', href: 'https://facebook.com/CORECHAMPS', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { label: 'Instagram', href: '#', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CORE CHAMPS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="/images/razorpay-badge.svg" alt="Razorpay" className="h-5 opacity-60" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span className="text-xs text-gray-600">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

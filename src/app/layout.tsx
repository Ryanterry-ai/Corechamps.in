import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  title: {
    default: 'CORE CHAMPS | Bred To Be A Champion',
    template: '%s | CORE CHAMPS',
  },
  description:
    'Science-based sports nutrition supplements for muscle building, performance and recovery. Shop Whey Protein, Pre-Workout, BCAAs, Creatine and more.',
  keywords: ['protein powder', 'whey protein', 'pre workout', 'bcaa', 'sports nutrition', 'supplements India'],
  openGraph: {
    siteName: 'CORE CHAMPS',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
  themeColor: '#FF6B00',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen">
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}

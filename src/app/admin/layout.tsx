import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin | CORE CHAMPS', template: '%s | CORE CHAMPS Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}

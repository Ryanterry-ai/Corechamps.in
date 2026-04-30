'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-white tracking-tight">
            CORE<span className="text-[#FF6B00]">CHAMPS</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Admin Dashboard</p>
        </div>

        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 space-y-6">
          <h1 className="text-lg font-bold text-white">Sign In</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-gray-600"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-[#e05a00] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-widest py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

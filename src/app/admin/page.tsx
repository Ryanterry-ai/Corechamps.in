// @ts-nocheck
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  id: string; handle: string; name: string; price: number; comparePrice?: number
  stock: number; visible: boolean; images: string[]; collectionId?: string; sku: string
}
interface Collection { id: string; handle: string; name: string; visible: boolean; image: string }
interface Section { id: string; type: string; order: number; visible: boolean; content: Record<string, unknown> }
interface Settings {
  siteName: string; tagline: string; email: string; phone: string
  announcementText: string; announcementShow: boolean; primaryColor: string
  facebookUrl: string; instagramUrl: string
}
interface MediaAsset { id: string; url: string; filename: string; alt: string }

type Tab = 'dashboard' | 'products' | 'collections' | 'sections' | 'media' | 'settings'

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }: { msg: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t) }, [onDone])
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border flex items-center gap-2 ${
      type === 'success' ? 'bg-green-500/20 border-green-500/40 text-green-300' : 'bg-red-500/20 border-red-500/40 text-red-300'
    }`}>
      {type === 'success' ? '✓' : '✕'} {msg}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Data state
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [media, setMedia] = useState<MediaAsset[]>([])

  // Loading
  const [saving, setSaving] = useState(false)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type })

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // Fetch helpers
  const fetchProducts = useCallback(async () => {
    const r = await fetch('/api/products?pageSize=100')
    const d = await r.json()
    if (d.success) setProducts(d.data.items)
  }, [])

  const fetchCollections = useCallback(async () => {
    const r = await fetch('/api/collections?pageSize=50')
    const d = await r.json()
    if (d.success) setCollections(d.data.items)
  }, [])

  const fetchSections = useCallback(async () => {
    const r = await fetch('/api/sections?page=home')
    const d = await r.json()
    if (d.success) setSections(d.data)
  }, [])

  const fetchSettings = useCallback(async () => {
    const r = await fetch('/api/settings')
    const d = await r.json()
    if (d.success) setSettings(d.data)
  }, [])

  const fetchMedia = useCallback(async () => {
    const r = await fetch('/api/media')
    const d = await r.json()
    if (d.success) setMedia(d.data)
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchCollections()
    fetchSections()
    fetchSettings()
    fetchMedia()
  }, [fetchProducts, fetchCollections, fetchSections, fetchSettings, fetchMedia])

  // ── Sidebar nav ──────────────────────────────────────────────────────────────
  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'sections', label: 'Homepage Sections', icon: '◧' },
    { id: 'products', label: 'Products', icon: '▣' },
    { id: 'collections', label: 'Collections', icon: '⊟' },
    { id: 'media', label: 'Media Library', icon: '🖼' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d0d0d] border-r border-[#1e1e1e] flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-[#1e1e1e]">
          <div className="text-base font-black text-white tracking-tight">
            CORE<span className="text-[#FF6B00]">CHAMPS</span>
          </div>
          <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-widest">Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                tab === item.id
                  ? 'bg-[#FF6B00]/15 text-[#FF6B00] font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[#1e1e1e] space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-[#1a1a1a]"
          >
            ↗ View Live Site
          </a>
          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-[#1a1a1a]"
          >
            ⏻ Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {tab === 'dashboard' && <DashboardTab products={products} collections={collections} media={media} setTab={setTab} />}
        {tab === 'products' && <ProductsTab products={products} collections={collections} onRefresh={fetchProducts} saving={saving} setSaving={setSaving} showToast={showToast} />}
        {tab === 'collections' && <CollectionsTab collections={collections} onRefresh={fetchCollections} saving={saving} setSaving={setSaving} showToast={showToast} />}
        {tab === 'sections' && <SectionsTab sections={sections} onRefresh={fetchSections} saving={saving} setSaving={setSaving} showToast={showToast} />}
        {tab === 'media' && <MediaTab media={media} onRefresh={fetchMedia} saving={saving} setSaving={setSaving} showToast={showToast} />}
        {tab === 'settings' && <SettingsTab settings={settings} saving={saving} setSaving={setSaving} showToast={showToast} onRefresh={fetchSettings} />}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}

// ── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab({ products, collections, media, setTab }: { products: Product[]; collections: Collection[]; media: MediaAsset[]; setTab: (t: Tab) => void }) {
  const stats = [
    { label: 'Products', value: products.length, color: 'text-[#FF6B00]', tab: 'products' as Tab },
    { label: 'Collections', value: collections.length, color: 'text-blue-400', tab: 'collections' as Tab },
    { label: 'Media Assets', value: media.length, color: 'text-purple-400', tab: 'media' as Tab },
    { label: 'In Stock', value: products.filter((p) => p.stock > 0).length, color: 'text-green-400', tab: 'products' as Tab },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <button key={s.label} onClick={() => setTab(s.tab)} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 text-left hover:border-[#FF6B00]/40 transition-all">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6">
        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Edit Homepage Sections', tab: 'sections' as Tab },
            { label: 'Add New Product', tab: 'products' as Tab },
            { label: 'Upload Media', tab: 'media' as Tab },
            { label: 'Edit Settings', tab: 'settings' as Tab },
            { label: 'Manage Collections', tab: 'collections' as Tab },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => setTab(a.tab)}
              className="bg-[#1a1a1a] hover:bg-[#FF6B00]/10 border border-[#2a2a2a] hover:border-[#FF6B00]/40 text-gray-400 hover:text-[#FF6B00] text-xs font-semibold px-4 py-3 rounded-lg transition-all text-left"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Products Tab ──────────────────────────────────────────────────────────────
function ProductsTab({ products, collections, onRefresh, saving, setSaving, showToast }: {
  products: Product[]; collections: Collection[]; onRefresh: () => void
  saving: boolean; setSaving: (v: boolean) => void; showToast: (m: string, t?: 'success' | 'error') => void
}) {
  const [search, setSearch] = useState('')
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.includes(search)
  )

  const toggleVisible = async (p: Product) => {
    await fetch(`/api/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, visible: !p.visible, images: p.images ?? [], tags: [], variants: [] }),
    })
    onRefresh()
    showToast(`${p.name} ${!p.visible ? 'shown' : 'hidden'}`)
  }

  const saveProduct = async () => {
    if (!editProduct?.name) return
    setSaving(true)
    try {
      const method = editProduct.id ? 'PUT' : 'POST'
      const url = editProduct.id ? `/api/products/${editProduct.id}` : '/api/products'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editProduct, tags: [], variants: [], images: [] }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(editProduct.id ? 'Product updated & published live' : 'Product created')
        setEditProduct(null)
        onRefresh()
      } else {
        showToast(data.error || 'Save failed', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    showToast(`${name} deleted`)
    onRefresh()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Products <span className="text-gray-500 text-lg font-normal">({products.length})</span></h1>
        <button onClick={() => setEditProduct({ visible: true, stock: 100, price: 0 })}
          className="bg-[#FF6B00] hover:bg-[#e05a00] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors">
          + Add Product
        </button>
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products by name or SKU..."
        className="w-full bg-[#111111] border border-[#2a2a2a] text-sm text-gray-300 rounded-lg px-4 py-2.5 mb-5 focus:outline-none focus:border-[#FF6B00] placeholder-gray-600" />

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e1e] text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-3 py-3">Price</th>
              <th className="text-left px-3 py-3">Stock</th>
              <th className="text-left px-3 py-3">Visible</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-[#1a1a1a] hover:bg-[#141414] transition-colors">
                <td className="px-5 py-3">
                  <div className="font-semibold text-white text-xs leading-tight">{p.name}</div>
                  <div className="text-gray-600 text-[10px] mt-0.5">{p.handle}</div>
                </td>
                <td className="px-3 py-3 text-[#FF6B00] font-bold text-xs">₹{p.price}</td>
                <td className="px-3 py-3">
                  <span className={`text-xs font-semibold ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <button onClick={() => toggleVisible(p)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${p.visible ? 'bg-[#FF6B00]' : 'bg-gray-700'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.visible ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditProduct(p)} className="text-[10px] text-gray-400 hover:text-[#FF6B00] transition-colors font-semibold">Edit</button>
                    <button onClick={() => deleteProduct(p.id, p.name)} className="text-[10px] text-gray-600 hover:text-red-400 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">{editProduct.id ? 'Edit Product' : 'New Product'}</h2>

            {[
              { label: 'Product Name', key: 'name', type: 'text', required: true },
              { label: 'Handle (URL slug)', key: 'handle', type: 'text' },
              { label: 'Short Description', key: 'shortDesc', type: 'text' },
              { label: 'Price (₹)', key: 'price', type: 'number' },
              { label: 'Compare Price (₹)', key: 'comparePrice', type: 'number' },
              { label: 'Stock', key: 'stock', type: 'number' },
              { label: 'SKU', key: 'sku', type: 'text' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</label>
                <input
                  type={type}
                  value={(editProduct as Record<string, unknown>)[key] as string ?? ''}
                  onChange={(e) => setEditProduct({ ...editProduct, [key]: type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>
            ))}

            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Collection</label>
              <select
                value={editProduct.collectionId ?? ''}
                onChange={(e) => setEditProduct({ ...editProduct, collectionId: e.target.value || undefined })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF6B00]"
              >
                <option value="">No collection</option>
                {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Description</label>
              <textarea rows={4}
                value={editProduct.description ?? ''}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF6B00] resize-none" />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="visible" checked={editProduct.visible ?? true}
                onChange={(e) => setEditProduct({ ...editProduct, visible: e.target.checked })}
                className="accent-[#FF6B00]" />
              <label htmlFor="visible" className="text-sm text-gray-300">Visible to customers</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={saveProduct} disabled={saving}
                className="flex-1 bg-[#FF6B00] hover:bg-[#e05a00] disabled:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors">
                {saving ? 'Publishing…' : editProduct.id ? 'Save & Publish Live' : 'Create Product'}
              </button>
              <button onClick={() => setEditProduct(null)}
                className="px-5 border border-[#2a2a2a] text-gray-400 hover:text-white text-xs font-semibold rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Collections Tab ────────────────────────────────────────────────────────────
function CollectionsTab({ collections, onRefresh, saving, setSaving, showToast }: {
  collections: Collection[]; onRefresh: () => void
  saving: boolean; setSaving: (v: boolean) => void; showToast: (m: string, t?: 'success' | 'error') => void
}) {
  const [editCol, setEditCol] = useState<Partial<Collection> | null>(null)

  const save = async () => {
    if (!editCol?.name) return
    setSaving(true)
    try {
      const method = editCol.id ? 'PUT' : 'POST'
      const url = editCol.id ? `/api/collections/${editCol.id}` : '/api/collections'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCol),
      })
      const data = await res.json()
      if (data.success) { showToast('Collection saved & published'); setEditCol(null); onRefresh() }
      else showToast(data.error || 'Failed', 'error')
    } finally { setSaving(false) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Collections</h1>
        <button onClick={() => setEditCol({ visible: true })}
          className="bg-[#FF6B00] hover:bg-[#e05a00] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors">
          + Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((c) => (
          <div key={c.id} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#FF6B00]/40 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold text-white text-sm">{c.name}</div>
                <div className="text-gray-600 text-[10px] mt-0.5">/{c.handle}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.visible ? 'bg-green-500/15 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                {c.visible ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <button onClick={() => setEditCol(c)} className="mt-4 text-xs text-gray-500 hover:text-[#FF6B00] font-semibold transition-colors">Edit →</button>
          </div>
        ))}
      </div>

      {editCol && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">{editCol.id ? 'Edit Collection' : 'New Collection'}</h2>
            {[{ label: 'Name', key: 'name' }, { label: 'Handle', key: 'handle' }, { label: 'Image URL', key: 'image' }].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</label>
                <input value={(editCol as Record<string, unknown>)[key] as string ?? ''}
                  onChange={(e) => setEditCol({ ...editCol, [key]: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF6B00]" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Description</label>
              <textarea rows={3} value={editCol.description ?? ''}
                onChange={(e) => setEditCol({ ...editCol, description: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF6B00] resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="col-visible" checked={editCol.visible ?? true}
                onChange={(e) => setEditCol({ ...editCol, visible: e.target.checked })} className="accent-[#FF6B00]" />
              <label htmlFor="col-visible" className="text-sm text-gray-300">Visible on storefront</label>
            </div>
            <div className="flex gap-3">
              <button onClick={save} disabled={saving}
                className="flex-1 bg-[#FF6B00] hover:bg-[#e05a00] disabled:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors">
                {saving ? 'Saving…' : 'Save & Publish Live'}
              </button>
              <button onClick={() => setEditCol(null)} className="px-5 border border-[#2a2a2a] text-gray-400 hover:text-white text-xs rounded-lg transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sections Tab ───────────────────────────────────────────────────────────────
function SectionsTab({ sections, onRefresh, saving, setSaving, showToast }: {
  sections: Section[]; onRefresh: () => void
  saving: boolean; setSaving: (v: boolean) => void; showToast: (m: string, t?: 'success' | 'error') => void
}) {
  const [editing, setEditing] = useState<Section | null>(null)
  const [draftMode, setDraftMode] = useState(false)

  const toggleVisible = async (s: Section) => {
    await fetch(`/api/sections/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, visible: !s.visible }),
    })
    onRefresh()
    showToast(`Section ${!s.visible ? 'shown' : 'hidden'} on homepage`)
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/sections/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, draft: draftMode }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(draftMode ? 'Draft saved (not live yet)' : `Section published live · ${new Date().toLocaleTimeString()}`)
        setEditing(null)
        onRefresh()
      } else showToast(data.error || 'Failed', 'error')
    } finally { setSaving(false) }
  }

  const SECTION_LABELS: Record<string, string> = {
    'hero': '🦸 Hero Banner',
    'category-cards': '🃏 Category Cards',
    'featured-products': '⭐ Featured Products',
    'brand-banner': '📣 Brand Banner',
    'trust-bar': '✅ Trust Bar',
    'testimonials': '💬 Testimonials',
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-2">Homepage Sections</h1>
      <p className="text-gray-500 text-sm mb-6">Edit and reorder homepage sections. Click "Publish Live" to make changes visible immediately.</p>

      <div className="space-y-3">
        {sections.map((s, i) => (
          <div key={s.id} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 flex items-center justify-between gap-4 hover:border-[#FF6B00]/20 transition-all">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm font-mono w-5 text-center">{i + 1}</span>
              <div>
                <div className="font-semibold text-white text-sm">{SECTION_LABELS[s.type] || s.type}</div>
                <div className="text-gray-600 text-[10px] mt-0.5 uppercase tracking-wider">{s.visible ? 'Visible' : 'Hidden'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleVisible(s)}
                className={`w-10 h-5 rounded-full transition-colors relative ${s.visible ? 'bg-[#FF6B00]' : 'bg-gray-700'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${s.visible ? 'left-5' : 'left-0.5'}`} />
              </button>
              <button onClick={() => { setEditing(s); setDraftMode(false) }}
                className="text-xs text-gray-400 hover:text-[#FF6B00] font-semibold transition-colors px-3 py-1.5 border border-[#2a2a2a] rounded-lg hover:border-[#FF6B00]/40">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Edit: {SECTION_LABELS[editing.type] || editing.type}</h2>

            <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-3">
              {Object.entries(editing.content).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{key}</label>
                  {typeof val === 'string' && val.length > 60 ? (
                    <textarea rows={3} value={val}
                      onChange={(e) => setEditing({ ...editing, content: { ...editing.content, [key]: e.target.value } })}
                      className="w-full bg-[#111111] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B00] resize-none" />
                  ) : typeof val === 'string' ? (
                    <input value={val}
                      onChange={(e) => setEditing({ ...editing, content: { ...editing.content, [key]: e.target.value } })}
                      className="w-full bg-[#111111] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF6B00]" />
                  ) : typeof val === 'boolean' ? (
                    <input type="checkbox" checked={val}
                      onChange={(e) => setEditing({ ...editing, content: { ...editing.content, [key]: e.target.checked } })}
                      className="accent-[#FF6B00]" />
                  ) : (
                    <span className="text-gray-600 text-xs">{JSON.stringify(val).slice(0, 60)}…</span>
                  )}
                </div>
              ))}
            </div>

            {/* Draft vs Publish */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Publish Mode</p>
              <div className="flex gap-3">
                <button onClick={() => setDraftMode(true)}
                  className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-all ${draftMode ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 'border-[#2a2a2a] text-gray-500 hover:border-gray-500'}`}>
                  Save Draft <span className="block text-[9px] font-normal opacity-70">Not live yet</span>
                </button>
                <button onClick={() => setDraftMode(false)}
                  className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-all ${!draftMode ? 'border-[#FF6B00] text-[#FF6B00] bg-[#FF6B00]/10' : 'border-[#2a2a2a] text-gray-500 hover:border-gray-500'}`}>
                  Publish Live <span className="block text-[9px] font-normal opacity-70">Updates storefront now</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={save} disabled={saving}
                className="flex-1 bg-[#FF6B00] hover:bg-[#e05a00] disabled:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors">
                {saving ? 'Saving…' : draftMode ? 'Save Draft' : 'Publish Live'}
              </button>
              <button onClick={() => setEditing(null)} className="px-5 border border-[#2a2a2a] text-gray-400 hover:text-white text-xs rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Media Tab ──────────────────────────────────────────────────────────────────
function MediaTab({ media, onRefresh, saving, setSaving, showToast }: {
  media: MediaAsset[]; onRefresh: () => void
  saving: boolean; setSaving: (v: boolean) => void; showToast: (m: string, t?: 'success' | 'error') => void
}) {
  const [urlInput, setUrlInput] = useState('')
  const [altInput, setAltInput] = useState('')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = media.filter((m) => m.filename.toLowerCase().includes(search.toLowerCase()))

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('alt', file.name.replace(/\.[^/.]+$/, ''))
    try {
      const res = await fetch('/api/media', { method: 'POST', body: form })
      const data = await res.json()
      if (data.success) { showToast('Image uploaded successfully'); onRefresh() }
      else showToast(data.error || 'Upload failed', 'error')
    } finally { setUploading(false); e.target.value = '' }
  }

  const importUrl = async () => {
    if (!urlInput.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: urlInput, alt: altInput }),
      })
      const data = await res.json()
      if (data.success) { showToast('Image imported & saved locally'); setUrlInput(''); setAltInput(''); onRefresh() }
      else showToast(data.error || 'Import failed', 'error')
    } finally { setSaving(false) }
  }

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url)
    setCopiedId(asset.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-6">Media Library</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Upload */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Upload from Device</h3>
          <label className="block border-2 border-dashed border-[#2a2a2a] hover:border-[#FF6B00]/50 rounded-xl p-6 text-center cursor-pointer transition-all">
            {uploading ? (
              <span className="text-gray-400 text-sm">Uploading…</span>
            ) : (
              <>
                <div className="text-3xl mb-2">📁</div>
                <div className="text-sm text-gray-400">Click to upload or drag & drop</div>
                <div className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP, GIF · Max 10MB</div>
              </>
            )}
            <input type="file" accept="image/*" onChange={uploadFile} className="hidden" />
          </label>
        </div>

        {/* URL import */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Import via URL</h3>
          <div className="space-y-3">
            <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF6B00] placeholder-gray-600" />
            <input value={altInput} onChange={(e) => setAltInput(e.target.value)}
              placeholder="Alt text (optional)"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF6B00] placeholder-gray-600" />
            <button onClick={importUrl} disabled={saving || !urlInput}
              className="w-full bg-[#FF6B00] hover:bg-[#e05a00] disabled:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors">
              {saving ? 'Importing…' : 'Import & Save Locally'}
            </button>
          </div>
        </div>
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search media…"
        className="w-full bg-[#111111] border border-[#2a2a2a] text-sm text-gray-300 rounded-lg px-4 py-2.5 mb-5 focus:outline-none focus:border-[#FF6B00] placeholder-gray-600" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map((asset) => (
          <div key={asset.id} className="group bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#FF6B00]/40 transition-all">
            <div className="aspect-square bg-[#1a1a1a] overflow-hidden">
              <img src={asset.url} alt={asset.alt} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg' }} />
            </div>
            <div className="p-2">
              <div className="text-[10px] text-gray-500 truncate">{asset.filename}</div>
              <button onClick={() => copyUrl(asset)}
                className="mt-1.5 w-full text-[10px] font-semibold py-1 rounded border border-[#2a2a2a] hover:border-[#FF6B00]/40 transition-colors text-gray-500 hover:text-[#FF6B00]">
                {copiedId === asset.id ? '✓ Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600 text-sm">No media uploaded yet. Upload your first image above.</div>
      )}
    </div>
  )
}

// ── Settings Tab ───────────────────────────────────────────────────────────────
function SettingsTab({ settings, saving, setSaving, showToast, onRefresh }: {
  settings: Settings | null; saving: boolean
  setSaving: (v: boolean) => void; showToast: (m: string, t?: 'success' | 'error') => void; onRefresh: () => void
}) {
  const [form, setForm] = useState<Partial<Settings>>(settings ?? {})

  useEffect(() => { if (settings) setForm(settings) }, [settings])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) { showToast(`Settings published live · ${new Date().toLocaleTimeString()}`); onRefresh() }
      else showToast(data.error || 'Failed', 'error')
    } finally { setSaving(false) }
  }

  const fields = [
    { label: 'Site Name', key: 'siteName' },
    { label: 'Tagline', key: 'tagline' },
    { label: 'Contact Email', key: 'email' },
    { label: 'Phone Number', key: 'phone' },
    { label: 'Announcement Bar Text', key: 'announcementText' },
    { label: 'Facebook URL', key: 'facebookUrl' },
    { label: 'Instagram URL', key: 'instagramUrl' },
  ]

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-black text-white mb-6">Site Settings</h1>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
        {fields.map(({ label, key }) => (
          <div key={key}>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
            <input value={(form as Record<string, unknown>)[key] as string ?? ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF6B00]" />
          </div>
        ))}

        <div className="flex items-center gap-3">
          <input type="checkbox" id="ann-show" checked={form.announcementShow ?? true}
            onChange={(e) => setForm({ ...form, announcementShow: e.target.checked })} className="accent-[#FF6B00]" />
          <label htmlFor="ann-show" className="text-sm text-gray-300">Show announcement bar on storefront</label>
        </div>

        <div className="pt-2 border-t border-[#1e1e1e]">
          <p className="text-xs text-gray-500 mb-3">Changes are applied live to the storefront immediately after publishing.</p>
          <button onClick={save} disabled={saving}
            className="bg-[#FF6B00] hover:bg-[#e05a00] disabled:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2">
            {saving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing…</> : '✓ Publish Live Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

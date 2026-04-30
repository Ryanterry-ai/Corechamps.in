// ─── PRODUCT ────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string
  title: string
  options: Record<string, string> // { flavor: 'Chocolate', size: '2lb' }
  price: number
  comparePrice?: number
  stock: number
  sku: string
  image?: string
}

export interface Product {
  id: string
  handle: string
  name: string
  description: string
  shortDesc: string
  price: number
  comparePrice?: number
  currency: string
  images: string[]
  categoryId?: string
  collectionId?: string
  tags: string[]
  stock: number
  sku: string
  variants: ProductVariant[]
  suggestedUse: string
  allergenInfo: string
  seoTitle: string
  seoDesc: string
  visible: boolean
  createdAt: string
  updatedAt: string
  collection?: Collection
}

// ─── COLLECTION ──────────────────────────────────────────────────────────────

export interface Collection {
  id: string
  handle: string
  name: string
  description: string
  image: string
  seoTitle: string
  seoDesc: string
  visible: boolean
  order: number
  products?: Product[]
  createdAt: string
  updatedAt: string
}

// ─── CART ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string // unique cart line id
  productId: string
  variantId?: string
  name: string
  variantTitle?: string
  price: number
  quantity: number
  image: string
  handle: string
  stock: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, variant?: ProductVariant, qty?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  subtotal: number
  itemCount: number
}

// ─── PAGE SECTIONS ───────────────────────────────────────────────────────────

export interface PageSection {
  id: string
  page: string
  type: SectionType
  order: number
  visible: boolean
  content: SectionContent
  updatedAt: string
  createdAt: string
}

export type SectionType =
  | 'hero'
  | 'announcement-bar'
  | 'category-cards'
  | 'featured-products'
  | 'brand-banner'
  | 'testimonials'
  | 'trust-bar'
  | 'newsletter'
  | 'custom-html'

export interface SectionContent {
  // hero
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaUrl?: string
  image?: string
  imageAlt?: string
  imageScale?: number
  imageX?: number
  imageY?: number
  fitMode?: 'cover' | 'contain' | 'fill'
  bgColor?: string
  textColor?: string
  // category-cards
  cards?: CategoryCard[]
  // featured-products
  title?: string
  subtitle?: string
  productHandles?: string[]
  // brand-banner
  text?: string
  badge?: string
  // testimonials
  testimonials?: Testimonial[]
  // trust-bar
  items?: TrustItem[]
  // newsletter
  placeholder?: string
  buttonLabel?: string
  // generic
  [key: string]: unknown
}

export interface CategoryCard {
  id: string
  label: string
  tagline: string
  image: string
  url: string
}

export interface Testimonial {
  id: string
  author: string
  avatar?: string
  rating: number
  text: string
  source?: string
}

export interface TrustItem {
  id: string
  icon: string
  label: string
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

export interface NavItem {
  id: string
  menu: 'main' | 'footer' | 'mobile'
  label: string
  url: string
  type: 'internal' | 'external' | 'collection' | 'product'
  order: number
  parentId?: string
  visible: boolean
  children?: NavItem[]
}

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────

export interface SiteSettings {
  id: string
  siteName: string
  tagline: string
  logo: string
  favicon: string
  currency: string
  currencySymbol: string
  email: string
  phone: string
  address: string
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  youtubeUrl: string
  announcementText: string
  announcementLink: string
  announcementShow: boolean
  seoTitle: string
  seoDesc: string
  primaryColor: string
  secondaryColor: string
}

// ─── MEDIA ───────────────────────────────────────────────────────────────────

export interface MediaAsset {
  id: string
  filename: string
  url: string
  alt: string
  width: number
  height: number
  size: number
  type: string
  uploadedAt: string
}

// ─── API RESPONSES ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── ADMIN SESSION ───────────────────────────────────────────────────────────

export interface AdminSession {
  adminId: string
  email: string
  isLoggedIn: boolean
}

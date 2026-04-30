/**
 * Format a price number as INR currency string
 * Always uses ₹ symbol and Indian number formatting
 */
export function formatPrice(amount: number, symbol = '₹'): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${symbol}${formatted}`
}

/**
 * Calculate discount percentage — safe, no Infinity
 */
export function discountPercent(price: number, comparePrice?: number): number | null {
  if (!comparePrice || comparePrice <= price) return null
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T
  } catch {
    return fallback
  }
}

/**
 * Slugify a string to a URL handle
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text to a given length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + '...'
}

/**
 * Generate a unique cart line ID
 */
export function cartLineId(productId: string, variantId?: string): string {
  return variantId ? `${productId}_${variantId}` : productId
}

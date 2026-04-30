# CORE CHAMPS — Standalone + CMS Rebuild

> Cloned from: https://corechamps.com  
> Stack: Next.js 14 · Tailwind CSS · Prisma · SQLite → PostgreSQL · Razorpay + Snapmint · Vercel

---

## 1. Project Overview

Full rebuild of the CORE CHAMPS sports nutrition storefront. The original site runs on Shopify (Liquid templates). This rebuild is a standalone Next.js application with a built-in custom admin CMS — **no Shopify dependency, no Shopify runtime, no Shopify CDN references.**

- **Public storefront**: `example.com`
- **Admin CMS**: `cms.example.com`
- **Currency**: INR (₹) throughout
- **Payments**: Razorpay (cards, UPI, net banking) + Snapmint (no-cost EMI)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Database | SQLite (dev) → PostgreSQL/Neon (production) |
| ORM | Prisma 5 |
| Auth | iron-session (server-side sessions) |
| Cart state | Zustand + localStorage persistence |
| Payments | Razorpay + Snapmint |
| Media | Local filesystem (`/public/images/uploads/`) |
| Deployment | Vercel |

---

## 3. Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Git

---

## 4. Local Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd corechamps

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Section 5)

# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma db push

# Seed the database with Core Champs products and settings
npm run db:seed

# Start dev server
npm run dev
```

Visit `http://localhost:3000` for the storefront.  
Visit `http://localhost:3000/admin` for the CMS (redirects to login).

---

## 5. Environment Variables

Copy `.env.example` to `.env.local` and fill in these values:

```env
# Database (SQLite for dev, PostgreSQL for production)
DATABASE_URL="file:./dev.db"
# Production: DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Admin credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your_secure_password_here"

# Session secret (must be at least 32 characters)
IRON_SESSION_PASSWORD="your_very_long_random_secret_key_here_at_least_32_chars"

# Public site URLs
NEXT_PUBLIC_SITE_URL="https://example.com"
NEXT_PUBLIC_CMS_URL="https://cms.example.com"

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"

# Snapmint (get from Snapmint merchant portal)
SNAPMINT_MERCHANT_ID=""
SNAPMINT_API_KEY=""
```

---

## 6. CMS Access

After running `npm run db:seed`, the admin is accessible at:

- **URL**: `http://localhost:3000/admin` (or `https://cms.example.com` in production)
- **Email**: value of `ADMIN_EMAIL` in `.env.local`
- **Password**: value of `ADMIN_PASSWORD` in `.env.local`

> Change your password after first login in production.

---

## 7. How to Edit Content via CMS

### Homepage Sections
Admin → **Homepage Sections** → click **Edit** on any section → modify fields → choose **Publish Live** (goes live immediately) or **Save Draft** (saved but not shown).

### Products
Admin → **Products** → click **Edit** on any product, or **+ Add Product** to create new. Toggle the visibility switch to show/hide a product without deleting it.

### Collections
Admin → **Collections** → edit name, description, image. Visibility toggle controls whether the collection appears on the storefront.

### Navigation
Managed via database seed; future CMS navigation editor can be built in Admin → Navigation.

### Settings
Admin → **Settings** → edit site name, tagline, announcement bar, contact info, social links → **Publish Live**.

---

## 8. How to Manage Images

### Upload from your device
Admin → **Media Library** → drag & drop or click the upload box. Accepts JPG, PNG, WEBP, GIF up to 10MB. The file is saved to `/public/images/uploads/` and a URL is generated.

### Import from a URL
Admin → **Media Library** → paste a public image URL → **Import & Save Locally**. The image is downloaded and saved locally — the external URL is not used at runtime.

### Use in sections or products
- In a section editor, paste the `/images/uploads/filename.jpg` URL into the `image` field.
- In a product editor, paste into the `images` field (one per line in full implementation).

---

## 9. How to Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

In the Vercel dashboard:
1. Connect your GitHub repository
2. Set all environment variables (Settings → Environment Variables)
3. Set `DATABASE_URL` to your Neon PostgreSQL connection string
4. Run `prisma db push` and `npm run db:seed` once via Vercel CLI or Neon console

---

## 10. Shopify Theme Output

Not applicable — `shopify_theme_output: no` was specified for this project.

---

## 11. Known Limitations

| Item | Status |
|---|---|
| Product images | Placeholder SVGs — upload real product images via CMS Media Library |
| Blog | Static posts hardcoded in `/app/blogs/news/` — connect to CMS for dynamic posts |
| Snapmint checkout | Redirect stub — requires Snapmint merchant credentials to activate |
| Navigation editor | Nav managed via seed only — full drag-drop editor pending |
| Customer accounts | Account page is a stub — full auth flow pending |
| Email notifications | Order confirmation emails not yet configured (add Resend/SendGrid) |
| Collection images | Placeholder — upload via Media Library and update collection image field |
| Prisma binary in sandbox | Prisma engine download blocked in Claude sandbox; runs normally in Vercel/local env |

---

## 12. Dependency Cleanup Summary

| Category | Status |
|---|---|
| `cdn.shopify.com` references | ✅ Zero — all assets are local |
| `fonts.googleapis.com` references | ✅ Zero — system font stack used |
| Shopify Storefront API | ✅ Removed — custom Prisma data layer |
| Shopify `shopify-buy` SDK | ✅ Not installed |
| Original domain runtime references | ✅ Zero |
| USD currency | ✅ Replaced with INR (₹) throughout |
| Liquid template errors | ✅ Fixed — clean TypeScript rendering |
| i18n translation missing keys | ✅ Fixed — clean English strings |
| Analytics/tracking scripts | ✅ Not included — add intentionally if needed |
| Dead code / console.logs | ✅ None in production code |

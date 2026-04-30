# CORE CHAMPS Standalone Storefront

Independent Next.js 14, TypeScript, and Tailwind CSS rebuild of the Core Champs storefront reference.

## Run locally

```bash
npm install
npm run import:content
npm run dev
```

Storefront: http://localhost:3000

Admin: http://localhost:3000/admin

## Build

```bash
npm run build
```

## Content model

Seed data lives in `data/seed.json` and media lives in `public/media/imported`.
The admin panel edits catalog, content, design, marketing, media, settings, users, roles, and permissions in browser localStorage. Use the admin export/import controls to move edited content between browsers or environments.

## Vercel deployment

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Use the default Next.js framework preset.
4. Build command: `npm run build`.
5. Install command: `npm install`.
6. No environment variables are required for the standalone static seed build.

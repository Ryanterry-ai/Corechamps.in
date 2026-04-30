import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const SOURCE = "https://corechamps.com";
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const MEDIA_DIR = path.join(ROOT, "public", "media", "imported");

const navigationHandles = [
  "agmatine-750mg",
  "bcaa-powder-7000-mg",
  "cla-conjugated-linoleic-acid",
  "creatine-5000mg",
  "eaa-essential-amino-acids",
  "glutamine",
  "isolate-whey-2lbs",
  "isolate-whey",
  "joint-support",
  "l-arginine-1000mg",
  "l-carnitine-3000-new-packing",
  "l-citrulline",
  "liver-support",
  "mass-gainer-6-lbs",
  "mass-gainer-15-lbs",
  "multivitamin-90-tablets-usa-version",
  "nitric-oxide",
  "omega-3-usa-version",
  "testro-gen",
  "rdx-pre-workout",
  "shred-n-burn",
  "tribulus",
  "whey-2lbs",
  "whey",
  "zmb6"
];

const pageSeeds = [
  {
    slug: "contact",
    title: "Contact Us",
    summary: "Reach the Core Champs support team.",
    body: "Store information: 1013, Centre Road, Wilmington, Delaware 19805. Phone: +1-802-227-2721. Email: sales@corechamps.com or info@corechamps.com."
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary: "Customer privacy and data handling.",
    body: "This standalone clone keeps storefront and admin data locally unless a client connects their own backend. Do not add tracking scripts without consent."
  },
  {
    slug: "return-policy",
    title: "Return Policy",
    summary: "Returns and order support.",
    body: "Return requests can be reviewed by the store team. Products should remain sealed and in original condition unless otherwise approved by support."
  },
  {
    slug: "terms-conditions",
    title: "Terms & Conditions",
    summary: "Store terms and supplement disclaimer.",
    body: "These products are not intended to diagnose, treat, cure, or prevent disease. Consult a healthcare professional before starting any diet or exercise program."
  },
  {
    slug: "global-presence",
    title: "Global Presence",
    summary: "Regional storefront links.",
    body: "Core Champs references United States, Europe, Middle East, and Asia regional experiences. This standalone site keeps those references as editable content."
  }
];

const collectionRules = [
  {
    slug: "protein",
    title: "Protein",
    subtitle: "Protein is the spice of muscle life.",
    match: ["whey", "protein", "isolate"]
  },
  {
    slug: "muscle-building",
    title: "Muscle Building",
    subtitle: "The secret ingredient to muscle magic.",
    match: ["whey", "protein", "isolate", "mass", "creatine", "build muscle"]
  },
  {
    slug: "pre-workout",
    title: "Energy & Performance",
    subtitle: "Pre-workout fuel for focused training.",
    match: ["pre-workout", "nitric", "agmatine", "citrulline", "arginine", "carnitine", "performance"]
  },
  {
    slug: "weight-management",
    title: "Weight Management",
    subtitle: "Support for lean goals and daily discipline.",
    match: ["weight", "cla", "shred", "burn", "fat", "carnitine"]
  },
  {
    slug: "recovery",
    title: "Recovery",
    subtitle: "Amino acids and daily recovery support.",
    match: ["recovery", "eaa", "bcaa", "glutamine", "joint", "creatine"]
  },
  {
    slug: "healthy-wellness",
    title: "Healthy Lifestyle",
    subtitle: "Vitamin and mineral supplements for daily health.",
    match: ["omega", "multivitamin", "liver", "zmb6", "testro", "tribulus", "healthy"]
  },
  {
    slug: "bcaas-eaas",
    title: "BCAAs & EAAs",
    subtitle: "Amino acids for training and recovery.",
    match: ["bcaa", "eaa", "amino"]
  }
];

function normalizeUrl(src) {
  if (!src) return "";
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("/")) return `${SOURCE}${src}`;
  return src;
}

function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|h2|h3|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function excerpt(text, words = 26) {
  const parts = text.split(/\s+/).filter(Boolean);
  return parts.slice(0, words).join(" ") + (parts.length > words ? "..." : "");
}

function money(value) {
  if (typeof value === "number") return Math.round(value) / 100;
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mediaName(url, prefix) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean) || ".jpg";
  const base = path
    .basename(clean, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 54);
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  return `${prefix}-${base || "asset"}-${hash}${ext}`;
}

async function download(url, prefix) {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;

  const filename = mediaName(normalized, prefix);
  const diskPath = path.join(MEDIA_DIR, filename);
  const publicPath = `/media/imported/${filename}`;
  try {
    const response = await fetch(normalized);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(diskPath, buffer);
    return {
      src: publicPath,
      originalUrl: normalized,
      filename,
      bytes: buffer.length
    };
  } catch (error) {
    console.warn(`Could not download ${normalized}: ${error.message}`);
    return null;
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

function productMatches(product, terms) {
  const haystack = [
    product.title,
    product.type,
    product.vendor,
    ...(product.tags || []),
    product.slug
  ]
    .join(" ")
    .toLowerCase();

  return terms.some((term) => haystack.includes(term));
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(MEDIA_DIR, { recursive: true });

  const [catalog, homeHtml] = await Promise.all([
    fetchJson(`${SOURCE}/products.json?limit=250`),
    fetchText(SOURCE)
  ]);

  const homepageImages = Array.from(
    homeHtml.matchAll(/<img[^>]+(?:src|data-src)=['"]([^'"]+)['"]/gi),
    (match) => normalizeUrl(match[1])
  ).filter((src) => src.includes("cdn/shop/files") || src.includes("cdn.shopify.com"));

  const preferredProducts = [...catalog.products]
    .filter((product) => navigationHandles.includes(product.handle))
    .sort((a, b) => navigationHandles.indexOf(a.handle) - navigationHandles.indexOf(b.handle));
  const remainingProducts = catalog.products.filter(
    (product) => !navigationHandles.includes(product.handle)
  );
  const sourceProducts = [...preferredProducts, ...remainingProducts];

  const products = [];
  const mediaLibrary = [];

  for (const product of sourceProducts) {
    const description = stripHtml(product.body_html || "");
    const imageSources = (product.images || []).slice(0, 2).map((image) => image.src);
    const images = [];

    for (const image of imageSources) {
      const asset = await download(image, product.handle);
      if (asset) {
        const imageMeta = product.images.find((entry) => normalizeUrl(entry.src) === normalizeUrl(image));
        images.push({
          src: asset.src,
          alt: product.title,
          width: imageMeta?.width || 1200,
          height: imageMeta?.height || 1500
        });
        mediaLibrary.push({
          id: `${product.handle}-${images.length}`,
          title: `${product.title} image ${images.length}`,
          type: "product",
          src: asset.src,
          filename: asset.filename,
          bytes: asset.bytes
        });
      }
    }

    const variants = (product.variants || []).map((variant) => ({
      id: String(variant.id),
      title: variant.title,
      sku: variant.sku || "",
      option1: variant.option1 || "",
      price: money(variant.price),
      compareAtPrice: money(variant.compare_at_price || variant.price),
      available: Boolean(variant.available)
    }));

    const minPrice = variants.reduce((min, variant) => Math.min(min, variant.price || min), variants[0]?.price || 0);

    products.push({
      id: String(product.id),
      slug: product.handle,
      title: product.title,
      vendor: product.vendor || "CORE CHAMPS",
      type: product.product_type || "",
      tags: product.tags || [],
      price: minPrice,
      compareAtPrice: variants[0]?.compareAtPrice || minPrice,
      available: variants.some((variant) => variant.available),
      summary: excerpt(description),
      description,
      images,
      variants,
      inventory: variants.some((variant) => variant.available) ? 48 : 0,
      status: product.published_at ? "published" : "draft",
      createdAt: product.created_at || "",
      updatedAt: product.updated_at || ""
    });
  }

  const collections = collectionRules.map((rule) => {
    const productSlugs = products
      .filter((product) => productMatches(product, rule.match))
      .map((product) => product.slug);
    return {
      slug: rule.slug,
      title: rule.title,
      subtitle: rule.subtitle,
      description: rule.subtitle,
      productSlugs
    };
  });

  const heroCandidates = homepageImages.filter((src) =>
    /banner|corechamps/i.test(src)
  );
  const localizedHero = [];
  for (const image of heroCandidates.slice(0, 5)) {
    const asset = await download(image, "site");
    if (asset) {
      localizedHero.push(asset.src);
      mediaLibrary.push({
        id: `site-${localizedHero.length}`,
        title: `Site visual ${localizedHero.length}`,
        type: "design",
        src: asset.src,
        filename: asset.filename,
        bytes: asset.bytes
      });
    }
  }

  const seed = {
    meta: {
      source: SOURCE,
      importedAt: new Date().toISOString(),
      runtimeDependenciesRemoved: [
        "Shopify storefront APIs",
        "remote CDN runtime images",
        "Shopify scripts",
        "tracking scripts",
        "theme CSS"
      ],
      audit: {
        platform: "Shopify storefront",
        observedNavigation: [
          "Home",
          "Supplements",
          "Categories",
          "Authenticity Check",
          "Cart",
          "Account",
          "Footer company pages"
        ],
        designSystem: {
          colors: ["black", "white", "red accent", "light gray surfaces"],
          typography: "Condensed athletic display headings with practical sans body copy",
          imagery: "Supplement pack shots, gym-performance banners, red and black brand energy"
        }
      }
    },
    settings: {
      storeName: "CORE CHAMPS",
      tagline: "Bred To Be A Champion",
      email: "sales@corechamps.com",
      phone: "+1-802-227-2721",
      address: "1013, Centre Road, Wilmington, Delaware 19805",
      currency: "USD",
      taxRate: 0,
      shippingFlatRate: 0,
      heroTitle: "CORE CHAMPS",
      heroSubtitle: "Bred to be a champion",
      heroBody: "Science-based sports nutrition for protein, pre-workout, recovery, and daily performance.",
      heroImage: localizedHero[0] || products[0]?.images?.[0]?.src || ""
    },
    navigation: {
      primary: [
        { label: "Home", href: "/" },
        { label: "Supplements", href: "/collections/protein" },
        { label: "Categories", href: "/collections/muscle-building" },
        { label: "Authenticity Check", href: "/pages/global-presence" }
      ],
      categories: collections.map((collection) => ({
        label: collection.title,
        href: `/collections/${collection.slug}`
      })),
      footer: pageSeeds.map((page) => ({
        label: page.title,
        href: `/pages/${page.slug}`
      }))
    },
    pages: pageSeeds,
    collections,
    products,
    media: mediaLibrary,
    marketing: {
      announcement: "Hot selling products with free shipping",
      newsletterTitle: "Sign up for Newsletter",
      newsletterBody: "Get training fuel updates, product launches, and promotions.",
      banners: localizedHero.slice(1, 4).map((src, index) => ({
        id: `banner-${index + 1}`,
        title: ["Protein is the spice of muscle life.", "Pre-game rituals for the fitness enthusiast.", "BCAAs & EAAs are post-workout essentials."][index] || "Core Champs",
        cta: "Shop now",
        href: ["/collections/protein", "/collections/pre-workout", "/collections/bcaas-eaas"][index] || "/collections/protein",
        image: src
      }))
    },
    design: {
      accentColor: "#e1251b",
      theme: "athletic",
      logoText: "CORE CHAMPS",
      heroTreatment: "full-bleed performance image with strong black/red contrast"
    },
    users: [
      {
        id: "owner",
        name: "Store Owner",
        email: "owner@corechamps.local",
        role: "Administrator",
        status: "active"
      },
      {
        id: "editor",
        name: "Content Editor",
        email: "editor@corechamps.local",
        role: "Catalog Manager",
        status: "active"
      }
    ],
    roles: [
      {
        name: "Administrator",
        permissions: ["dashboard", "catalog", "content", "design", "marketing", "media", "settings", "users"]
      },
      {
        name: "Catalog Manager",
        permissions: ["dashboard", "catalog", "media"]
      },
      {
        name: "Content Editor",
        permissions: ["dashboard", "content", "marketing", "media"]
      }
    ]
  };

  await writeFile(path.join(DATA_DIR, "seed.json"), JSON.stringify(seed, null, 2));
  await writeFile(
    path.join(DATA_DIR, "import-report.json"),
    JSON.stringify(
      {
        pagesDiscovered: ["/", ...collections.map((c) => `/collections/${c.slug}`), ...products.map((p) => `/products/${p.slug}`), ...pageSeeds.map((p) => `/pages/${p.slug}`), "/cart", "/admin"],
        productsImported: products.length,
        collectionsImported: collections.length,
        mediaDownloaded: mediaLibrary.filter((item) => item.filename).length
      },
      null,
      2
    )
  );

  console.log(`Imported ${products.length} products, ${collections.length} collections, and ${mediaLibrary.length} media records.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

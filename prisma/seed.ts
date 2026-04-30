import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Core Champs database...')

  // ── SITE SETTINGS ──────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteName: 'CORE CHAMPS',
      tagline: 'BRED TO BE A CHAMPION!',
      currency: 'INR',
      currencySymbol: '₹',
      email: 'info@corechamps.com',
      phone: '+91 00000 00000',
      facebookUrl: 'https://facebook.com/CORECHAMPS',
      announcementText: '🔥 Free Shipping on Orders Above ₹999! Use code CHAMPS10 for 10% OFF',
      announcementLink: '/collections/all',
      announcementShow: true,
      seoTitle: 'CORE CHAMPS | Bred To Be A Champion',
      seoDesc: 'Science-based sports nutrition supplements for muscle building, performance and recovery.',
      primaryColor: '#FF6B00',
      secondaryColor: '#1a1a1a',
    },
  })

  // ── ADMIN USER ──────────────────────────────────────────────────
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12)
  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hash,
    },
  })

  // ── COLLECTIONS ─────────────────────────────────────────────────
  const collections = [
    { handle: 'protein', name: 'Protein', description: 'Premium whey protein and mass gainers for muscle building.', order: 1 },
    { handle: 'pre-workout', name: 'Pre-Workout', description: 'Powerful pre-workout formulas for energy, focus and pumps.', order: 2 },
    { handle: 'bcaas-eaas', name: 'BCAAs & EAAs', description: 'Essential amino acids for muscle growth and recovery.', order: 3 },
    { handle: 'creatine', name: 'Creatine', description: '100% pure micronized creatine monohydrate.', order: 4 },
    { handle: 'vitamins-minerals', name: 'Vitamins & Minerals', description: 'Essential vitamins and mineral supplements for overall health.', order: 5 },
    { handle: 'weight-loss', name: 'Weight Loss', description: 'Supplements to support healthy weight loss and fat burning.', order: 6 },
    { handle: 'all', name: 'All Products', description: 'Browse the complete Core Champs supplement range.', order: 0 },
  ]

  const createdCollections: Record<string, string> = {}
  for (const col of collections) {
    const c = await prisma.collection.upsert({
      where: { handle: col.handle },
      update: {},
      create: { ...col, seoTitle: `${col.name} | CORE CHAMPS`, seoDesc: col.description },
    })
    createdCollections[col.handle] = c.id
  }

  // ── PRODUCTS ────────────────────────────────────────────────────
  const products = [
    {
      handle: 'whey',
      name: 'CORE CHAMPS 100% WHEY PROTEIN',
      shortDesc: 'Superior quality protein with great taste',
      description: 'CORE CHAMPS WHEY offers the perfect mix for superior quality of protein with great taste. Protein contributes to the growth and maintenance of muscle mass. Each scoop provides 25 grams of protein packed with naturally occurring BCAAs and glutamine.',
      price: 2499,
      comparePrice: 3499,
      images: ['/images/products/whey-1.jpg', '/images/products/whey-2.jpg'],
      tags: ['["protein","whey","muscle-building"]'],
      stock: 100,
      sku: 'CC-WHEY-2LB',
      suggestedUse: 'Mix 1 scoop (34g) with 8–10 oz of cold water. Mix thoroughly in a shaker or blender.',
      allergenInfo: 'Contains Milk and Soy. Made in a facility that also processes sesame, eggs, peanuts, tree nuts, fish/crustaceans/shellfish oils, and wheat products.',
      collectionHandle: 'protein',
      variants: [
        { id: 'whey-chocolate', title: 'Chocolate', options: { flavor: 'Chocolate' }, price: 2499, stock: 50, sku: 'CC-WHEY-CHOC' },
        { id: 'whey-vanilla', title: 'Vanilla', options: { flavor: 'Vanilla' }, price: 2499, stock: 30, sku: 'CC-WHEY-VAN' },
        { id: 'whey-strawberry', title: 'Strawberry', options: { flavor: 'Strawberry' }, price: 2499, stock: 20, sku: 'CC-WHEY-STR' },
      ],
    },
    {
      handle: 'isolate-whey',
      name: 'CORE CHAMPS 100% ISOLATE WHEY PROTEIN',
      shortDesc: 'Lean muscle building with 25g protein',
      description: 'Enhance your muscle building with CORE CHAMPS ISOLATE — the ultimate fuel for your fitness journey. Packed with 25 grams of protein and all the essential amino acids, this powerful supplement supports even the most serious resistance-training programs.',
      price: 3499,
      comparePrice: 4999,
      images: ['/images/products/isolate-1.jpg'],
      tags: ['["protein","isolate","lean-muscle"]'],
      stock: 80,
      sku: 'CC-ISO-2LB',
      suggestedUse: 'Mix 1 scoop (30g) with 8–10 oz of cold water or milk. Mix thoroughly in shaker or blender.',
      allergenInfo: 'Contains Milk and Soy. Made in a facility that also processes sesame, egg, peanuts, tree nuts, fish/crustaceans/shellfish oils, and wheat products.',
      collectionHandle: 'protein',
      variants: [
        { id: 'iso-chocolate', title: 'Chocolate', options: { flavor: 'Chocolate' }, price: 3499, stock: 40, sku: 'CC-ISO-CHOC' },
        { id: 'iso-vanilla', title: 'Vanilla', options: { flavor: 'Vanilla' }, price: 3499, stock: 40, sku: 'CC-ISO-VAN' },
      ],
    },
    {
      handle: 'mass-gainer',
      name: 'CORE CHAMPS MASS GAINER',
      shortDesc: 'High-calorie formula for serious mass gains',
      description: 'CORE CHAMPS MASS Gainer is made with 100% whey protein that provides superior quality protein for muscle building. High in calories and carbohydrates to support serious muscle mass gains.',
      price: 2999,
      comparePrice: 3999,
      images: ['/images/products/mass-gainer-1.jpg'],
      tags: ['["protein","mass-gainer","bulking"]'],
      stock: 60,
      sku: 'CC-MASS-5LB',
      suggestedUse: 'Mix 2 scoops with 16–20 oz of cold water or milk. Best taken post-workout.',
      allergenInfo: 'Contains Milk and Soy. Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'protein',
      variants: [
        { id: 'mass-chocolate', title: 'Chocolate', options: { flavor: 'Chocolate' }, price: 2999, stock: 30, sku: 'CC-MASS-CHOC' },
        { id: 'mass-vanilla', title: 'Vanilla', options: { flavor: 'Vanilla' }, price: 2999, stock: 30, sku: 'CC-MASS-VAN' },
      ],
    },
    {
      handle: 'rdx-pre-workout',
      name: 'CORE CHAMPS RDX PRE-WORKOUT',
      shortDesc: 'Most powerful pre-workout formula',
      description: 'CORE CHAMPS RDX pre-workout supplement is specially formulated to provide a powerful surge of energy and focus. Fueled by 8.9g of CORE RDX Blend, it delivers long-lasting energy, skin-splitting muscle pumps, improved focus, and more strength for high-intensity workouts.',
      price: 1999,
      comparePrice: 2799,
      images: ['/images/products/rdx-1.jpg'],
      tags: ['["pre-workout","energy","focus","pumps"]'],
      stock: 90,
      sku: 'CC-RDX-420G',
      suggestedUse: 'Beginners: take 1/2 scoop 30 minutes before workout in 8–10 oz cold water. Advanced: 1 full scoop. Do not exceed 1 serving per day.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts, fish/crustaceans/shellfish oils, and wheat products.',
      collectionHandle: 'pre-workout',
      variants: [
        { id: 'rdx-fruit-punch', title: 'Fruit Punch', options: { flavor: 'Fruit Punch' }, price: 1999, stock: 50, sku: 'CC-RDX-FP' },
        { id: 'rdx-blue-razz', title: 'Blue Razz', options: { flavor: 'Blue Razz' }, price: 1999, stock: 40, sku: 'CC-RDX-BR' },
      ],
    },
    {
      handle: 'nitric-oxide',
      name: 'CORE CHAMPS NITRIC OXIDE EXTREME PUMP',
      shortDesc: 'Extreme muscle pumps and vascularity',
      description: 'CORE CHAMPS Nitric Oxide is crafted to help fuel your most intense training sessions with extreme pumps and enhanced vascularity.',
      price: 1799,
      comparePrice: 2299,
      images: ['/images/products/nitric-oxide-1.jpg'],
      tags: ['["pre-workout","pump","nitric-oxide"]'],
      stock: 70,
      sku: 'CC-NO-300G',
      suggestedUse: 'Take 1 scoop 30 minutes before workout with 8–10 oz of water.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'pre-workout',
      variants: [],
    },
    {
      handle: 'bcaa-7000mg',
      name: 'CORE CHAMPS BCAA 7000 MG',
      shortDesc: 'Essential for muscle growth and repair',
      description: 'BCAAs are essential for muscle growth and repair. Leucine, isoleucine, and valine work together to stimulate protein synthesis and reduce muscle breakdown.',
      price: 1499,
      comparePrice: 1999,
      images: ['/images/products/bcaa-1.jpg'],
      tags: ['["bcaa","amino-acids","recovery"]'],
      stock: 100,
      sku: 'CC-BCAA-300G',
      suggestedUse: 'Mix 1 scoop with 8–10 oz of water. Take intra-workout or post-workout.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'bcaas-eaas',
      variants: [
        { id: 'bcaa-watermelon', title: 'Watermelon', options: { flavor: 'Watermelon' }, price: 1499, stock: 50, sku: 'CC-BCAA-WM' },
        { id: 'bcaa-grape', title: 'Grape', options: { flavor: 'Grape' }, price: 1499, stock: 50, sku: 'CC-BCAA-GR' },
      ],
    },
    {
      handle: 'eaa',
      name: 'CORE CHAMPS EAA',
      shortDesc: 'Revitalize and recharge with essential amino acids',
      description: 'Revitalize and Recharge with CORE CHAMPS Essential Amino Acid Supplement! Packed with all 9 essential amino acids your body cannot produce on its own.',
      price: 1699,
      comparePrice: 2199,
      images: ['/images/products/eaa-1.jpg'],
      tags: ['["eaa","amino-acids","recovery"]'],
      stock: 80,
      sku: 'CC-EAA-300G',
      suggestedUse: 'Mix 1 scoop with 10–12 oz of water. Consume during or after workout.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'bcaas-eaas',
      variants: [],
    },
    {
      handle: 'creatine',
      name: 'CORE CHAMPS CREATINE 5000 MG',
      shortDesc: '100% pure micronized creatine monohydrate',
      description: 'CORE CHAMPS Creatine Monohydrate is 100% pure, flavorless, micronized creatine monohydrate. Creatine supports strength, power output, and muscle volume.',
      price: 999,
      comparePrice: 1499,
      images: ['/images/products/creatine-1.jpg'],
      tags: ['["creatine","strength","power"]'],
      stock: 150,
      sku: 'CC-CRE-300G',
      suggestedUse: 'Mix 1 scoop (5g) with 8–10 oz of water. Take daily with or without meals.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'creatine',
      variants: [],
    },
    {
      handle: 'glutamine',
      name: 'CORE CHAMPS GLUTAMINE 5000 MG',
      shortDesc: 'Build, repair and protect muscles',
      description: 'CORE CHAMPS GLUTAMINE 5000 MG helps your body rapidly replenish the glutamine used during intense training. L-Glutamine helps build, repair, and protect muscles from damage.',
      price: 1299,
      comparePrice: 1799,
      images: ['/images/products/glutamine-1.jpg'],
      tags: ['["glutamine","recovery","amino-acids"]'],
      stock: 90,
      sku: 'CC-GLU-300G',
      suggestedUse: 'Add 1 scoop to 8–10 oz of water or your favorite beverage. Take pre or post workout.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'bcaas-eaas',
      variants: [],
    },
    {
      handle: 'cla-conjugated-linoleic-acid',
      name: 'CORE CHAMPS CLA 1000 MG',
      shortDesc: 'Support weight loss and lean muscle retention',
      description: 'CORE CHAMPS CLA features a 1,000 mg blend of Conjugated Linoleic Acid, Extra Virgin Olive Oil, and Avocado Oil per serving to help support weight loss and maintain lean muscle.',
      price: 1399,
      comparePrice: 1899,
      images: ['/images/products/cla-1.jpg'],
      tags: ['["cla","weight-loss","fat-burner"]'],
      stock: 80,
      sku: 'CC-CLA-90SG',
      suggestedUse: 'Take 1 softgel with your meals or as directed by a physician or licensed nutritionist.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts, fish/crustaceans/shellfish oils, and wheat products.',
      collectionHandle: 'weight-loss',
      variants: [],
    },
    {
      handle: 'multivitamin',
      name: 'CORE CHAMPS MULTIVITAMIN',
      shortDesc: 'Boost vitality and support overall health',
      description: 'CORE CHAMPS Multivitamin: Boost your vitality and support your overall health with our comprehensive multivitamin formula designed for active individuals.',
      price: 799,
      comparePrice: 1099,
      images: ['/images/products/multivitamin-1.jpg'],
      tags: ['["vitamins","health","wellness"]'],
      stock: 200,
      sku: 'CC-MULTI-60T',
      suggestedUse: 'Take 2 tablets daily with food.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'vitamins-minerals',
      variants: [],
    },
    {
      handle: 'zmb6',
      name: 'CORE CHAMPS ZMB6',
      shortDesc: 'Zinc, Magnesium and Vitamin B6 complex',
      description: 'ZMB6 is a vital combination of Zinc, Magnesium, and Vitamin B6, supporting protein synthesis, bone health, and hormonal balance for athletic performance.',
      price: 699,
      comparePrice: 999,
      images: ['/images/products/zmb6-1.jpg'],
      tags: ['["zinc","magnesium","vitamins","recovery"]'],
      stock: 150,
      sku: 'CC-ZMB6-90T',
      suggestedUse: 'Take 3 capsules on an empty stomach 30–60 minutes before sleep.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'vitamins-minerals',
      variants: [],
    },
    {
      handle: 'testro-gen',
      name: 'CORE CHAMPS TESTRO GEN',
      shortDesc: 'Natural testosterone support for peak performance',
      description: 'Unlock your true potential with CORE CHAMPS TESTRO GEN — designed to support your body\'s natural testosterone production with scientifically backed ingredients that boost energy, strength, and endurance.',
      price: 1599,
      comparePrice: 2199,
      images: ['/images/products/testrogen-1.jpg'],
      tags: ['["testosterone","performance","vitality"]'],
      stock: 70,
      sku: 'CC-TEST-60T',
      suggestedUse: 'Take 2 tablets on a light to empty stomach or as directed by a physician.',
      allergenInfo: 'Made in a facility that also processes sesame, egg, peanuts, tree nuts, fish/crustaceans/shellfish oils, and wheat products.',
      collectionHandle: 'vitamins-minerals',
      variants: [],
    },
    {
      handle: 'l-citrulline',
      name: 'CORE CHAMPS L-CITRULLINE 2000 MG',
      shortDesc: 'Vasodilation through nitric oxide production',
      description: 'CORE CHAMPS L-CITRULLINE 2000 MG supports vasodilation through nitric oxide production, helping to improve blood flow and muscle pumps during training.',
      price: 1299,
      comparePrice: 1799,
      images: ['/images/products/l-citrulline-1.jpg'],
      tags: ['["pump","nitric-oxide","amino-acids"]'],
      stock: 80,
      sku: 'CC-CIT-300G',
      suggestedUse: 'Mix 1 scoop with 8–10 oz of water 30 minutes before workout.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'pre-workout',
      variants: [],
    },
    {
      handle: 'agmatine-750mg',
      name: 'CORE CHAMPS AGMATINE 750 MG',
      shortDesc: 'Nitric oxide regulator for extreme pumps',
      description: 'As a regulator of nitric oxide synthesis, Agmatine acts as a pump amplifier during intense workouts, enhancing vascularity and nutrient delivery to muscles.',
      price: 1499,
      comparePrice: 1999,
      images: ['/images/products/agmatine-1.jpg'],
      tags: ['["pump","nitric-oxide","pre-workout"]'],
      stock: 60,
      sku: 'CC-AGM-90C',
      suggestedUse: 'Take 1–2 capsules 30 minutes before workout.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'pre-workout',
      variants: [],
    },
    {
      handle: 'l-arginine-1000mg',
      name: 'CORE CHAMPS L-ARGININE 1000 MG',
      shortDesc: 'Unlocking nitric oxide for optimal performance',
      description: 'CORE CHAMPS L-ARGININE: Unlocking the Power of Nitric Oxide for Optimal Blood Flow and Athletic Performance.',
      price: 999,
      comparePrice: 1399,
      images: ['/images/products/l-arginine-1.jpg'],
      tags: ['["amino-acids","pump","nitric-oxide"]'],
      stock: 90,
      sku: 'CC-ARG-90T',
      suggestedUse: 'Take 2 tablets 30–60 minutes before workout with water.',
      allergenInfo: 'Made in a facility that also processes sesame, eggs, peanuts, tree nuts.',
      collectionHandle: 'bcaas-eaas',
      variants: [],
    },
  ]

  for (const p of products) {
    const { collectionHandle, variants, tags, ...productData } = p
    await prisma.product.upsert({
      where: { handle: p.handle },
      update: {},
      create: {
        ...productData,
        tags: JSON.stringify(tags),
        images: JSON.stringify(p.images),
        variants: JSON.stringify(variants),
        currency: 'INR',
        seoTitle: `${p.name} | CORE CHAMPS`,
        seoDesc: p.shortDesc,
        collectionId: collectionHandle ? createdCollections[collectionHandle] : undefined,
      },
    })
  }

  // ── HOMEPAGE SECTIONS ───────────────────────────────────────────
  const sections = [
    {
      page: 'home', type: 'hero', order: 1, visible: true,
      content: JSON.stringify({
        headline: 'BRED TO BE A CHAMPION',
        subheadline: 'Science-based sports nutrition supplements formulated with the world\'s most powerful ingredients at full clinical doses.',
        ctaLabel: 'Shop Now', ctaUrl: '/collections/all',
        image: '/images/hero/hero-bg.jpg',
        bgColor: '#0a0a0a',
      }),
    },
    {
      page: 'home', type: 'category-cards', order: 2, visible: true,
      content: JSON.stringify({
        cards: [
          { id: '1', label: 'Protein', tagline: 'Protein: The secret ingredient to muscle magic', image: '/images/collections/protein.jpg', url: '/collections/protein' },
          { id: '2', label: 'Pre-Workout', tagline: 'Pre-workout: The turbo boost for your fitness journey', image: '/images/collections/pre-workout.jpg', url: '/collections/pre-workout' },
          { id: '3', label: 'BCAAs & EAAs', tagline: 'BCAAs & EAAs are my post-workout bestie', image: '/images/collections/bcaas-eaas.jpg', url: '/collections/bcaas-eaas' },
        ],
      }),
    },
    {
      page: 'home', type: 'featured-products', order: 3, visible: true,
      content: JSON.stringify({
        title: 'BESTSELLERS',
        subtitle: 'Most popular',
        productHandles: ['whey', 'isolate-whey', 'rdx-pre-workout', 'creatine'],
        viewAllUrl: '/collections/all',
      }),
    },
    {
      page: 'home', type: 'brand-banner', order: 4, visible: true,
      content: JSON.stringify({
        headline: 'BRED TO BE A CHAMPION!',
        subtext: 'Vitamin & Mineral Supplements for A Healthy Lifestyle',
        badge: 'SCIENCE-BASED FORMULAS',
        ctaLabel: 'Explore All Products',
        ctaUrl: '/collections/all',
      }),
    },
    {
      page: 'home', type: 'featured-products', order: 5, visible: true,
      content: JSON.stringify({
        title: 'VITAMINS & HEALTH',
        subtitle: 'Complete your stack',
        productHandles: ['multivitamin', 'zmb6', 'testro-gen', 'glutamine'],
        viewAllUrl: '/collections/vitamins-minerals',
      }),
    },
  ]

  for (const section of sections) {
    await prisma.pageSection.create({ data: section })
  }

  // ── NAVIGATION ──────────────────────────────────────────────────
  const navItems = [
    // Main menu
    { menu: 'main', label: 'Protein', url: '/collections/protein', type: 'collection', order: 1 },
    { menu: 'main', label: 'Pre-Workout', url: '/collections/pre-workout', type: 'collection', order: 2 },
    { menu: 'main', label: 'BCAAs & EAAs', url: '/collections/bcaas-eaas', type: 'collection', order: 3 },
    { menu: 'main', label: 'All Products', url: '/collections/all', type: 'collection', order: 4 },
    { menu: 'main', label: 'Blog', url: '/blogs/news', type: 'internal', order: 5 },
    // Footer shop
    { menu: 'footer', label: 'Protein', url: '/collections/protein', type: 'collection', order: 1 },
    { menu: 'footer', label: 'Pre-Workout', url: '/collections/pre-workout', type: 'collection', order: 2 },
    { menu: 'footer', label: 'BCAAs & EAAs', url: '/collections/bcaas-eaas', type: 'collection', order: 3 },
    { menu: 'footer', label: 'All Products', url: '/collections/all', type: 'collection', order: 4 },
    // Footer policies
    { menu: 'footer-policies', label: 'Privacy Policy', url: '/pages/privacy-policy', type: 'internal', order: 1 },
    { menu: 'footer-policies', label: 'Terms & Conditions', url: '/pages/terms-conditions', type: 'internal', order: 2 },
    { menu: 'footer-policies', label: 'Return & Refund', url: '/pages/return-refund-policy', type: 'internal', order: 3 },
    { menu: 'footer-policies', label: 'Shipping Policy', url: '/pages/shipping-policy', type: 'internal', order: 4 },
  ]

  for (const item of navItems) {
    await prisma.navItem.create({ data: item })
  }

  console.log('✅ Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface Props { params: { handle: string } }

// Static page content — all editable via CMS in production
const PAGES: Record<string, { title: string; content: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
      <h2>Privacy Policy</h2>
      <p>Last updated: January 2024</p>
      <p>CORE CHAMPS ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.</p>

      <h3>Information We Collect</h3>
      <p>We collect information you provide directly: name, email address, shipping address, phone number, and payment details when you place an order.</p>

      <h3>How We Use Your Information</h3>
      <ul>
        <li>To process and fulfill your orders</li>
        <li>To send order confirmations and shipping updates</li>
        <li>To respond to your inquiries</li>
        <li>To improve our website and services</li>
      </ul>

      <h3>Data Security</h3>
      <p>We use Razorpay for payment processing. Card details are never stored on our servers. All transactions are encrypted using SSL technology.</p>

      <h3>Contact</h3>
      <p>For privacy concerns, email us at info@corechamps.com.</p>
    `,
  },
  'terms-conditions': {
    title: 'Terms & Conditions',
    content: `
      <h2>Terms & Conditions</h2>
      <p>Last updated: January 2024</p>
      <p>By accessing and using this website, you accept and agree to be bound by these Terms & Conditions.</p>

      <h3>Products</h3>
      <p>All products are intended for use by healthy adults 18 years and older. Consult a physician before use if you have a medical condition. Keep out of reach of children.</p>

      <h3>Orders & Payments</h3>
      <p>All prices are in Indian Rupees (₹). We accept Razorpay (credit/debit cards, UPI, net banking) and Snapmint (no-cost EMI). Orders are confirmed only after successful payment.</p>

      <h3>Intellectual Property</h3>
      <p>All content on this website — including logos, images, product descriptions, and copy — is the property of CORE CHAMPS and may not be reproduced without written consent.</p>

      <h3>Contact</h3>
      <p>Questions? Email info@corechamps.com.</p>
    `,
  },
  'return-refund-policy': {
    title: 'Return & Refund Policy',
    content: `
      <h2>Return & Refund Policy</h2>
      <p>Last updated: January 2024</p>

      <h3>Returns</h3>
      <p>We accept returns within 7 days of delivery for unopened, sealed products in original condition. Opened or used products cannot be returned for hygiene and safety reasons.</p>

      <h3>Damaged or Incorrect Orders</h3>
      <p>If you receive a damaged or incorrect item, contact us within 48 hours of delivery with photos at info@corechamps.com. We will arrange a replacement or full refund.</p>

      <h3>Refund Process</h3>
      <p>Approved refunds are processed within 5–7 business days back to the original payment method. Razorpay refunds may take an additional 2–3 business days to appear.</p>

      <h3>Non-Returnable Items</h3>
      <p>Opened supplements, products without original packaging, and items purchased on clearance are non-returnable.</p>

      <h3>Contact for Returns</h3>
      <p>Email: info@corechamps.com with your order number, reason for return, and photos (if applicable).</p>
    `,
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    content: `
      <h2>Shipping Policy</h2>
      <p>Last updated: January 2024</p>

      <h3>Delivery Timeframes</h3>
      <ul>
        <li>Metro cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune): 2–4 business days</li>
        <li>Tier 2 & 3 cities: 4–7 business days</li>
        <li>Remote areas: 7–10 business days</li>
      </ul>

      <h3>Shipping Charges</h3>
      <p>Free shipping on all orders above ₹999. Orders below ₹999 incur a flat shipping fee of ₹99.</p>

      <h3>Order Processing</h3>
      <p>Orders are processed Monday–Saturday. Orders placed after 2 PM or on Sundays and public holidays are processed the next business day.</p>

      <h3>Tracking</h3>
      <p>You will receive a tracking link via email/SMS once your order is dispatched.</p>

      <h3>Contact</h3>
      <p>Shipping queries: info@corechamps.com</p>
    `,
  },
  'about': {
    title: 'About Us',
    content: `
      <h2>About CORE CHAMPS</h2>
      <p>CORE CHAMPS was founded with one mission: to deliver science-based sports nutrition supplements formulated with the world's most powerful ingredients at full clinical doses — no proprietary blends, no fillers, no compromises.</p>

      <h3>Our Philosophy</h3>
      <p>Every formula we create is backed by peer-reviewed research. We believe you deserve to know exactly what you're putting in your body and why. Every ingredient, every dose, fully disclosed.</p>

      <h3>Quality Standards</h3>
      <p>All CORE CHAMPS products are manufactured in GMP-certified facilities under strict quality control. We third-party test every batch for purity, potency, and safety.</p>

      <h3>BRED TO BE A CHAMPION</h3>
      <p>Whether you're a competitive athlete or someone just beginning their fitness journey, CORE CHAMPS is built for people who refuse to settle. We're not here to help you get by — we're here to help you win.</p>
    `,
  },
  'contact': {
    title: 'Contact Us',
    content: `
      <h2>Contact Us</h2>
      <p>Have a question? We're here to help.</p>

      <h3>Customer Support</h3>
      <p>Email: <a href="mailto:info@corechamps.com">info@corechamps.com</a><br/>
      Response time: Within 24–48 hours on business days.</p>

      <h3>Order Inquiries</h3>
      <p>For order status, tracking, or issues with your order, please include your order number in your email for faster resolution.</p>

      <h3>Wholesale & Partnerships</h3>
      <p>Interested in stocking CORE CHAMPS? Email us with your business details at info@corechamps.com.</p>
    `,
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = PAGES[params.handle]
  if (!page) return { title: 'Not Found' }
  return { title: `${page.title} | CORE CHAMPS` }
}

export default function StaticPage({ params }: Props) {
  const page = PAGES[params.handle]
  if (!page) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-8 pb-6 border-b border-brand-border">
        {page.title}
      </h1>
      <div
        className="prose prose-sm prose-invert max-w-none
          [&_h2]:text-lg [&_h2]:font-black [&_h2]:text-white [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
          [&_p]:text-gray-400 [&_p]:leading-relaxed [&_p]:mb-4
          [&_ul]:text-gray-400 [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:mb-4
          [&_li]:leading-relaxed
          [&_a]:text-brand-primary [&_a]:hover:underline"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  )
}

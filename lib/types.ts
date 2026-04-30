export type MediaAsset = {
  id?: string;
  title?: string;
  type?: string;
  src: string;
  originalUrl?: string;
  filename?: string;
  bytes?: number;
  alt?: string;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  sku: string;
  option1: string;
  price: number;
  compareAtPrice: number;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  compareAtPrice: number;
  available: boolean;
  summary: string;
  description: string;
  images: MediaAsset[];
  variants: ProductVariant[];
  inventory: number;
  status: "published" | "draft";
  createdAt?: string;
  updatedAt?: string;
};

export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  productSlugs: string[];
};

export type ContentPage = {
  slug: string;
  title: string;
  summary: string;
  body: string;
};

export type NavigationItem = {
  label: string;
  href: string;
};

export type Role = {
  name: string;
  permissions: string[];
};

export type CmsUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

export type StoreData = {
  meta: {
    source: string;
    importedAt: string;
    runtimeDependenciesRemoved: string[];
    audit: {
      platform: string;
      observedNavigation: string[];
      designSystem: {
        colors: string[];
        typography: string;
        imagery: string;
      };
    };
  };
  settings: {
    storeName: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    taxRate: number;
    shippingFlatRate: number;
    heroTitle: string;
    heroSubtitle: string;
    heroBody: string;
    heroImage: string;
  };
  navigation: {
    primary: NavigationItem[];
    categories: NavigationItem[];
    footer: NavigationItem[];
  };
  pages: ContentPage[];
  collections: Collection[];
  products: Product[];
  media: MediaAsset[];
  marketing: {
    announcement: string;
    newsletterTitle: string;
    newsletterBody: string;
    banners: Array<{
      id: string;
      title: string;
      cta: string;
      href: string;
      image: string;
    }>;
  };
  design: {
    accentColor: string;
    theme: string;
    logoText: string;
    heroTreatment: string;
  };
  users: CmsUser[];
  roles: Role[];
};

export type CartLine = {
  slug: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  price: number;
  image?: string;
  quantity: number;
};

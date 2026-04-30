"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import seedData from "@/data/seed.json";
import type { CartLine, ContentPage, MediaAsset, Product, StoreData } from "@/lib/types";

const CMS_KEY = "corechamps-cms-data";
const CART_KEY = "corechamps-cart";
const seed = seedData as StoreData;

type CmsContextValue = {
  data: StoreData;
  cart: CartLine[];
  resetCms: () => void;
  importCms: (nextData: StoreData) => void;
  updateSettings: (settings: Partial<StoreData["settings"]>) => void;
  updateDesign: (design: Partial<StoreData["design"]>) => void;
  updateMarketing: (marketing: Partial<StoreData["marketing"]>) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (slug: string) => void;
  savePage: (page: ContentPage) => void;
  saveMedia: (asset: MediaAsset) => void;
  saveUser: (user: StoreData["users"][number]) => void;
  addToCart: (line: CartLine) => void;
  updateCartQuantity: (slug: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
};

const CmsContext = createContext<CmsContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createBlankProduct(): Product {
  return {
    id: `manual-${Date.now()}`,
    slug: `new-product-${Date.now()}`,
    title: "New Product",
    vendor: "CORE CHAMPS",
    type: "Supplement",
    tags: [],
    price: 0,
    compareAtPrice: 0,
    available: true,
    summary: "Product summary",
    description: "Product description",
    images: [],
    variants: [
      {
        id: `variant-${Date.now()}`,
        title: "Default Title",
        sku: "",
        option1: "Default Title",
        price: 0,
        compareAtPrice: 0,
        available: true
      }
    ],
    inventory: 0,
    status: "draft"
  };
}

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData>(seed);
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => {
    setData(readStorage(CMS_KEY, seed));
    setCart(readStorage(CART_KEY, []));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CMS_KEY, JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const resetCms = useCallback(() => {
    setData(seed);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CMS_KEY);
    }
  }, []);

  const importCms = useCallback((nextData: StoreData) => {
    setData(nextData);
  }, []);

  const updateSettings = useCallback((settings: Partial<StoreData["settings"]>) => {
    setData((current) => ({ ...current, settings: { ...current.settings, ...settings } }));
  }, []);

  const updateDesign = useCallback((design: Partial<StoreData["design"]>) => {
    setData((current) => ({ ...current, design: { ...current.design, ...design } }));
  }, []);

  const updateMarketing = useCallback((marketing: Partial<StoreData["marketing"]>) => {
    setData((current) => ({ ...current, marketing: { ...current.marketing, ...marketing } }));
  }, []);

  const saveProduct = useCallback((product: Product) => {
    const normalized = { ...product, slug: slugify(product.slug || product.title) };
    setData((current) => {
      const exists = current.products.some((entry) => entry.slug === normalized.slug);
      return {
        ...current,
        products: exists
          ? current.products.map((entry) => (entry.slug === normalized.slug ? normalized : entry))
          : [normalized, ...current.products]
      };
    });
  }, []);

  const deleteProduct = useCallback((slug: string) => {
    setData((current) => ({
      ...current,
      products: current.products.filter((product) => product.slug !== slug),
      collections: current.collections.map((collection) => ({
        ...collection,
        productSlugs: collection.productSlugs.filter((productSlug) => productSlug !== slug)
      }))
    }));
  }, []);

  const savePage = useCallback((page: ContentPage) => {
    const normalized = { ...page, slug: slugify(page.slug || page.title) };
    setData((current) => {
      const exists = current.pages.some((entry) => entry.slug === normalized.slug);
      return {
        ...current,
        pages: exists
          ? current.pages.map((entry) => (entry.slug === normalized.slug ? normalized : entry))
          : [normalized, ...current.pages]
      };
    });
  }, []);

  const saveMedia = useCallback((asset: MediaAsset) => {
    setData((current) => ({
      ...current,
      media: [{ ...asset, id: asset.id || `media-${Date.now()}` }, ...current.media]
    }));
  }, []);

  const saveUser = useCallback((user: StoreData["users"][number]) => {
    setData((current) => {
      const exists = current.users.some((entry) => entry.id === user.id);
      return {
        ...current,
        users: exists
          ? current.users.map((entry) => (entry.id === user.id ? user : entry))
          : [user, ...current.users]
      };
    });
  }, []);

  const addToCart = useCallback((line: CartLine) => {
    setCart((current) => {
      const index = current.findIndex(
        (entry) => entry.slug === line.slug && entry.variantId === line.variantId
      );
      if (index === -1) return [...current, line];
      return current.map((entry, entryIndex) =>
        entryIndex === index
          ? { ...entry, quantity: entry.quantity + line.quantity }
          : entry
      );
    });
  }, []);

  const updateCartQuantity = useCallback(
    (slug: string, variantId: string | undefined, quantity: number) => {
      setCart((current) =>
        current
          .map((entry) =>
            entry.slug === slug && entry.variantId === variantId
              ? { ...entry, quantity }
              : entry
          )
          .filter((entry) => entry.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(
    () => ({
      data,
      cart,
      resetCms,
      importCms,
      updateSettings,
      updateDesign,
      updateMarketing,
      saveProduct,
      deleteProduct,
      savePage,
      saveMedia,
      saveUser,
      addToCart,
      updateCartQuantity,
      clearCart
    }),
    [
      data,
      cart,
      resetCms,
      importCms,
      updateSettings,
      updateDesign,
      updateMarketing,
      saveProduct,
      deleteProduct,
      savePage,
      saveMedia,
      saveUser,
      addToCart,
      updateCartQuantity,
      clearCart
    ]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) throw new Error("useCms must be used within CmsProvider");
  return context;
}

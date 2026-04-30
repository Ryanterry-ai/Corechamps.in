"use client";

import {
  BarChart3,
  Boxes,
  Brush,
  Download,
  FileText,
  ImagePlus,
  LayoutDashboard,
  Megaphone,
  Plus,
  RefreshCcw,
  Save,
  Settings,
  Shield,
  Trash2,
  Upload,
  Users
} from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { createBlankProduct, useCms } from "@/lib/cms-store";
import { formatMoney } from "@/lib/data";
import type { ContentPage, Product, StoreData } from "@/lib/types";

const sections = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "catalog", label: "Catalog", icon: Boxes },
  { id: "content", label: "Content", icon: FileText },
  { id: "design", label: "Design", icon: Brush },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "media", label: "Media", icon: ImagePlus },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "users", label: "Users/Roles/Permissions", icon: Shield }
] as const;

type SectionId = (typeof sections)[number]["id"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-black/50">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-11 border border-black/15 px-3"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 5
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-black/50">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring resize-y border border-black/15 p-3"
      />
    </label>
  );
}

export function AdminApp() {
  const {
    data,
    resetCms,
    importCms,
    updateSettings,
    updateDesign,
    updateMarketing,
    saveProduct,
    deleteProduct,
    savePage,
    saveMedia,
    saveUser
  } = useCms();
  const [active, setActive] = useState<SectionId>("dashboard");
  const [selectedSlug, setSelectedSlug] = useState(data.products[0]?.slug || "");
  const [selectedPageSlug, setSelectedPageSlug] = useState(data.pages[0]?.slug || "");
  const selectedProduct =
    data.products.find((product) => product.slug === selectedSlug) || data.products[0];
  const selectedPage = data.pages.find((page) => page.slug === selectedPageSlug) || data.pages[0];

  const stats = useMemo(
    () => [
      ["Products", data.products.length],
      ["Collections", data.collections.length],
      ["Pages", data.pages.length],
      ["Media", data.media.length],
      ["Users", data.users.length]
    ],
    [data]
  );

  function exportCms() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "corechamps-cms-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importCms(JSON.parse(String(reader.result)) as StoreData);
      } catch {
        alert("Import failed. Use a valid Core Champs CMS JSON export.");
      }
    };
    reader.readAsText(file);
  }

  function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      saveMedia({
        id: `upload-${Date.now()}`,
        title: file.name,
        type: "upload",
        src: String(reader.result),
        filename: file.name,
        bytes: file.size
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-black/10 bg-white lg:block">
        <div className="border-b border-black/10 p-6">
          <p className="font-display text-4xl leading-none">CORE CHAMPS</p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-ember">
            OpenCart-style admin
          </p>
        </div>
        <nav className="grid gap-1 p-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActive(section.id)}
              className={`focus-ring flex items-center gap-3 px-4 py-3 text-left text-sm font-black ${
                active === section.id ? "bg-ink text-white" : "hover:bg-black/5"
              }`}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-black/10 bg-white">
          <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">
                Admin Panel
              </p>
              <h1 className="text-2xl font-black">{sections.find((s) => s.id === active)?.label}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="focus-ring inline-flex cursor-pointer items-center gap-2 border border-black/15 px-4 py-3 text-sm font-black uppercase">
                <Upload size={16} /> Import
                <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
              </label>
              <button
                onClick={exportCms}
                className="focus-ring inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-sm font-black uppercase"
              >
                <Download size={16} /> Export
              </button>
              <button
                onClick={resetCms}
                className="focus-ring inline-flex items-center gap-2 bg-ink px-4 py-3 text-sm font-black uppercase text-white"
              >
                <RefreshCcw size={16} /> Reset seed
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto border-t border-black/10 px-5 py-3 lg:hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActive(section.id)}
                className={`shrink-0 px-3 py-2 text-xs font-black uppercase ${
                  active === section.id ? "bg-ink text-white" : "bg-black/5"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </header>

        <main className="p-5 lg:p-8">
          {active === "dashboard" ? (
            <section className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {stats.map(([label, value]) => (
                  <div key={label} className="border border-black/10 bg-white p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-black/45">{label}</p>
                    <p className="mt-4 text-4xl font-black">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="border border-black/10 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="text-ember" />
                    <h2 className="text-xl font-black">Audit summary</h2>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm leading-6 text-black/65">
                    <p>Source platform: {data.meta.audit.platform}</p>
                    <p>Imported at: {new Date(data.meta.importedAt).toLocaleString()}</p>
                    <p>Runtime dependencies removed: {data.meta.runtimeDependenciesRemoved.join(", ")}.</p>
                    <p>Design system: {data.meta.audit.designSystem.imagery}</p>
                  </div>
                </div>
                <div className="border border-black/10 bg-white p-6">
                  <h2 className="text-xl font-black">Operational notes</h2>
                  <ul className="mt-5 grid gap-3 text-sm leading-6 text-black/65">
                    <li>Catalog, page, media, and user changes persist in browser localStorage.</li>
                    <li>Export JSON after edits to move content between browsers or environments.</li>
                    <li>Connect a database later by replacing the CMS provider with API persistence.</li>
                  </ul>
                </div>
              </div>
            </section>
          ) : null}

          {active === "catalog" && selectedProduct ? (
            <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
              <div className="border border-black/10 bg-white">
                <div className="flex items-center justify-between border-b border-black/10 p-4">
                  <h2 className="font-black">Products</h2>
                  <button
                    className="focus-ring flex h-10 w-10 items-center justify-center bg-ember text-white"
                    onClick={() => {
                      const product = createBlankProduct();
                      saveProduct(product);
                      setSelectedSlug(product.slug);
                    }}
                    aria-label="Create product"
                  >
                    <Plus size={17} />
                  </button>
                </div>
                <div className="max-h-[70vh] overflow-auto">
                  {data.products.map((product) => (
                    <button
                      key={product.slug}
                      onClick={() => setSelectedSlug(product.slug)}
                      className={`grid w-full grid-cols-[54px_1fr] gap-3 border-b border-black/10 p-3 text-left ${
                        product.slug === selectedProduct.slug ? "bg-black/5" : "bg-white"
                      }`}
                    >
                      <div className="h-14 bg-steel p-1">
                        {product.images[0]?.src ? (
                          <img src={product.images[0].src} alt="" className="h-full w-full object-contain" />
                        ) : null}
                      </div>
                      <span>
                        <span className="block text-sm font-black uppercase">{product.title}</span>
                        <span className="text-xs text-black/50">
                          {formatMoney(product.price, data.settings.currency)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <ProductEditor
                key={selectedProduct.slug}
                product={selectedProduct}
                onSave={saveProduct}
                onDelete={(slug) => {
                  deleteProduct(slug);
                  setSelectedSlug(data.products[0]?.slug || "");
                }}
              />
            </section>
          ) : null}

          {active === "content" && selectedPage ? (
            <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
              <div className="border border-black/10 bg-white">
                <div className="flex items-center justify-between border-b border-black/10 p-4">
                  <h2 className="font-black">Pages</h2>
                  <button
                    className="focus-ring flex h-10 w-10 items-center justify-center bg-ember text-white"
                    onClick={() => {
                      const page = {
                        slug: `new-page-${Date.now()}`,
                        title: "New Page",
                        summary: "Page summary",
                        body: "Page content"
                      };
                      savePage(page);
                      setSelectedPageSlug(page.slug);
                    }}
                    aria-label="Create page"
                  >
                    <Plus size={17} />
                  </button>
                </div>
                {data.pages.map((page) => (
                  <button
                    key={page.slug}
                    onClick={() => setSelectedPageSlug(page.slug)}
                    className={`block w-full border-b border-black/10 p-4 text-left text-sm font-black ${
                      page.slug === selectedPage.slug ? "bg-black/5" : "bg-white"
                    }`}
                  >
                    {page.title}
                  </button>
                ))}
              </div>
              <PageEditor key={selectedPage.slug} page={selectedPage} onSave={savePage} />
            </section>
          ) : null}

          {active === "design" ? (
            <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <div className="grid gap-4 border border-black/10 bg-white p-6">
                <Field label="Logo text" value={data.design.logoText} onChange={(value) => updateDesign({ logoText: value })} />
                <Field label="Accent color" value={data.design.accentColor} onChange={(value) => updateDesign({ accentColor: value })} type="color" />
                <Field label="Theme" value={data.design.theme} onChange={(value) => updateDesign({ theme: value })} />
                <TextArea label="Hero treatment" value={data.design.heroTreatment} onChange={(value) => updateDesign({ heroTreatment: value })} />
              </div>
              <div className="border border-black/10 bg-white p-6">
                <p className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: data.design.accentColor }}>
                  Preview
                </p>
                <p className="mt-3 font-display text-6xl uppercase leading-none">{data.design.logoText}</p>
                <div className="mt-6 h-44 bg-ink p-6 text-white">
                  <p className="font-black uppercase">{data.settings.heroSubtitle}</p>
                  <p className="mt-3 text-white/70">{data.design.heroTreatment}</p>
                </div>
              </div>
            </section>
          ) : null}

          {active === "marketing" ? (
            <section className="grid gap-6">
              <div className="grid gap-4 border border-black/10 bg-white p-6">
                <Field label="Announcement" value={data.marketing.announcement} onChange={(value) => updateMarketing({ announcement: value })} />
                <Field label="Newsletter title" value={data.marketing.newsletterTitle} onChange={(value) => updateMarketing({ newsletterTitle: value })} />
                <TextArea label="Newsletter body" value={data.marketing.newsletterBody} onChange={(value) => updateMarketing({ newsletterBody: value })} />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {data.marketing.banners.map((banner) => (
                  <div key={banner.id} className="border border-black/10 bg-white p-4">
                    <div className="h-40 bg-steel">
                      {banner.image ? <img src={banner.image} alt="" className="h-full w-full object-cover" /> : null}
                    </div>
                    <p className="mt-4 font-black">{banner.title}</p>
                    <p className="text-sm text-black/55">{banner.href}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {active === "media" ? (
            <section className="grid gap-6">
              <div className="border border-black/10 bg-white p-6">
                <label className="focus-ring inline-flex cursor-pointer items-center gap-2 bg-ember px-5 py-4 text-sm font-black uppercase text-white">
                  <Upload size={17} /> Upload image
                  <input type="file" accept="image/*" onChange={handleMediaUpload} className="hidden" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.media.map((asset) => (
                  <div key={`${asset.src}-${asset.title}`} className="border border-black/10 bg-white p-4">
                    <div className="aspect-square bg-steel p-3">
                      <img src={asset.src} alt="" className="h-full w-full object-contain" />
                    </div>
                    <p className="mt-3 truncate text-sm font-black">{asset.title || asset.filename}</p>
                    <p className="text-xs text-black/45">{asset.type || "media"}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {active === "settings" ? (
            <section className="grid gap-4 border border-black/10 bg-white p-6 xl:grid-cols-2">
              <Field label="Store name" value={data.settings.storeName} onChange={(value) => updateSettings({ storeName: value })} />
              <Field label="Tagline" value={data.settings.tagline} onChange={(value) => updateSettings({ tagline: value })} />
              <Field label="Email" value={data.settings.email} onChange={(value) => updateSettings({ email: value })} />
              <Field label="Phone" value={data.settings.phone} onChange={(value) => updateSettings({ phone: value })} />
              <Field label="Currency" value={data.settings.currency} onChange={(value) => updateSettings({ currency: value })} />
              <Field label="Flat shipping" value={data.settings.shippingFlatRate} type="number" onChange={(value) => updateSettings({ shippingFlatRate: Number(value) })} />
              <Field label="Hero title" value={data.settings.heroTitle} onChange={(value) => updateSettings({ heroTitle: value })} />
              <Field label="Hero subtitle" value={data.settings.heroSubtitle} onChange={(value) => updateSettings({ heroSubtitle: value })} />
              <TextArea label="Address" value={data.settings.address} onChange={(value) => updateSettings({ address: value })} />
              <TextArea label="Hero body" value={data.settings.heroBody} onChange={(value) => updateSettings({ heroBody: value })} />
            </section>
          ) : null}

          {active === "users" ? (
            <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <div className="border border-black/10 bg-white">
                <div className="border-b border-black/10 p-4">
                  <h2 className="font-black">Users</h2>
                </div>
                {data.users.map((user) => (
                  <div key={user.id} className="grid gap-3 border-b border-black/10 p-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
                    <div>
                      <p className="font-black">{user.name}</p>
                      <p className="text-sm text-black/55">{user.email}</p>
                    </div>
                    <select
                      value={user.role}
                      onChange={(event) => saveUser({ ...user, role: event.target.value })}
                      className="focus-ring h-11 border border-black/15 px-3"
                    >
                      {data.roles.map((role) => (
                        <option key={role.name} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs font-black uppercase text-emerald-700">{user.status}</span>
                  </div>
                ))}
              </div>
              <div className="border border-black/10 bg-white p-6">
                <div className="flex items-center gap-3">
                  <Users className="text-ember" />
                  <h2 className="text-xl font-black">Roles and permissions</h2>
                </div>
                <div className="mt-5 grid gap-4">
                  {data.roles.map((role) => (
                    <div key={role.name} className="border border-black/10 p-4">
                      <p className="font-black">{role.name}</p>
                      <p className="mt-2 text-sm leading-6 text-black/60">
                        {role.permissions.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function ProductEditor({
  product,
  onSave,
  onDelete
}: {
  product: Product;
  onSave: (product: Product) => void;
  onDelete: (slug: string) => void;
}) {
  const [draft, setDraft] = useState(product);

  return (
    <div className="grid gap-5 border border-black/10 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black">Product editor</h2>
        <div className="flex gap-2">
          <button
            className="focus-ring inline-flex items-center gap-2 bg-ember px-4 py-3 text-sm font-black uppercase text-white"
            onClick={() => onSave({ ...draft, slug: slugify(draft.slug || draft.title) })}
          >
            <Save size={16} /> Save
          </button>
          <button
            className="focus-ring inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-sm font-black uppercase"
            onClick={() => onDelete(product.slug)}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
        <Field label="Slug" value={draft.slug} onChange={(value) => setDraft({ ...draft, slug: value })} />
        <Field label="Type" value={draft.type} onChange={(value) => setDraft({ ...draft, type: value })} />
        <Field label="Price" value={draft.price} type="number" onChange={(value) => setDraft({ ...draft, price: Number(value) })} />
        <Field label="Inventory" value={draft.inventory} type="number" onChange={(value) => setDraft({ ...draft, inventory: Number(value), available: Number(value) > 0 })} />
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-black/50">Status</span>
          <select
            className="focus-ring h-11 border border-black/15 px-3"
            value={draft.status}
            onChange={(event) => setDraft({ ...draft, status: event.target.value as Product["status"] })}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
      </div>
      <TextArea label="Summary" value={draft.summary} onChange={(value) => setDraft({ ...draft, summary: value })} />
      <TextArea label="Description" value={draft.description} rows={10} onChange={(value) => setDraft({ ...draft, description: value })} />
      <Field
        label="Primary image URL or data URL"
        value={draft.images[0]?.src || ""}
        onChange={(value) =>
          setDraft({
            ...draft,
            images: [{ src: value, alt: draft.title }, ...draft.images.slice(1)]
          })
        }
      />
    </div>
  );
}

function PageEditor({
  page,
  onSave
}: {
  page: ContentPage;
  onSave: (page: ContentPage) => void;
}) {
  const [draft, setDraft] = useState(page);

  return (
    <div className="grid gap-5 border border-black/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Page editor</h2>
        <button
          className="focus-ring inline-flex items-center gap-2 bg-ember px-4 py-3 text-sm font-black uppercase text-white"
          onClick={() => onSave({ ...draft, slug: slugify(draft.slug || draft.title) })}
        >
          <Save size={16} /> Save
        </button>
      </div>
      <Field label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
      <Field label="Slug" value={draft.slug} onChange={(value) => setDraft({ ...draft, slug: value })} />
      <TextArea label="Summary" value={draft.summary} onChange={(value) => setDraft({ ...draft, summary: value })} />
      <TextArea label="Body" value={draft.body} rows={12} onChange={(value) => setDraft({ ...draft, body: value })} />
    </div>
  );
}

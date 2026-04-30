"use client";

import { useCms } from "@/lib/cms-store";

export function ContentPageView({ slug }: { slug: string }) {
  const { data } = useCms();
  const page = data.pages.find((entry) => entry.slug === slug);

  if (!page) {
    return (
      <section className="section-pad">
        <div className="container-wide">
          <h1 className="font-display text-5xl uppercase">Page not found</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <div className="container-wide max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">
          CORE CHAMPS
        </p>
        <h1 className="mt-3 font-display text-6xl uppercase leading-none">
          {page.title}
        </h1>
        <p className="mt-5 text-xl leading-8 text-black/60">{page.summary}</p>
        <div className="prose-store mt-10 whitespace-pre-line text-lg">
          <p>{page.body}</p>
        </div>
      </div>
    </section>
  );
}

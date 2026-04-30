"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCms } from "@/lib/cms-store";
import { formatMoney } from "@/lib/data";

export function CartView() {
  const { cart, updateCartQuantity, clearCart, data } = useCms();
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = cart.length ? data.settings.shippingFlatRate : 0;
  const tax = subtotal * data.settings.taxRate;
  const total = subtotal + shipping + tax;

  return (
    <section className="section-pad">
      <div className="container-wide">
        <h1 className="font-display text-6xl uppercase leading-none">Cart</h1>
        {cart.length === 0 ? (
          <div className="mt-10 border border-black/10 p-10">
            <p className="text-xl font-black">Your cart is currently empty.</p>
            <Link
              href="/collections/protein"
              className="mt-6 inline-block bg-ember px-6 py-4 text-sm font-black uppercase text-white"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-4">
              {cart.map((line) => (
                <div
                  key={`${line.slug}-${line.variantId}`}
                  className="grid gap-4 border border-black/10 p-4 sm:grid-cols-[96px_1fr_auto]"
                >
                  <div className="h-24 bg-steel p-2">
                    {line.image ? (
                      <img src={line.image} alt="" className="h-full w-full object-contain" />
                    ) : null}
                  </div>
                  <div>
                    <Link href={`/products/${line.slug}`} className="font-black uppercase hover:text-ember">
                      {line.title}
                    </Link>
                    <p className="mt-1 text-sm text-black/55">{line.variantTitle}</p>
                    <p className="mt-3 font-black">
                      {formatMoney(line.price, data.settings.currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      className="focus-ring h-11 w-20 border border-black/15 px-3"
                      type="number"
                      min={0}
                      value={line.quantity}
                      onChange={(event) =>
                        updateCartQuantity(
                          line.slug,
                          line.variantId,
                          Number(event.target.value)
                        )
                      }
                    />
                    <button
                      className="focus-ring flex h-11 w-11 items-center justify-center border border-black/15"
                      onClick={() => updateCartQuantity(line.slug, line.variantId, 0)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <aside className="border border-black/10 p-6 lg:sticky lg:top-32 lg:self-start">
              <p className="font-display text-4xl uppercase">Order summary</p>
              <div className="mt-6 grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong>{formatMoney(subtotal, data.settings.currency)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong>{formatMoney(shipping, data.settings.currency)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <strong>{formatMoney(tax, data.settings.currency)}</strong>
                </div>
                <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-lg">
                  <span className="font-black">Total</span>
                  <strong>{formatMoney(total, data.settings.currency)}</strong>
                </div>
              </div>
              <button className="mt-6 w-full bg-ember px-6 py-4 text-sm font-black uppercase text-white">
                Check out
              </button>
              <button
                className="mt-3 w-full border border-black/15 px-6 py-4 text-sm font-black uppercase"
                onClick={clearCart}
              >
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

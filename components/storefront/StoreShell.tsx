import { Footer } from "@/components/storefront/Footer";
import { Header } from "@/components/storefront/Header";

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

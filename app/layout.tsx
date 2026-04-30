import type { Metadata } from "next";
import "./globals.css";
import { CmsProvider } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "CORE CHAMPS",
  description: "Standalone Core Champs storefront and CMS"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CmsProvider>{children}</CmsProvider>
      </body>
    </html>
  );
}

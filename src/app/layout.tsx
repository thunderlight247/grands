import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import { businessInfo } from "@/data/businessInfo";
import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/providers/SmoothScroll";
import RestaurantSchema from "@/components/seo/RestaurantSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    "[grand-gees] NEXT_PUBLIC_SITE_URL is not set. Canonical links, Open Graph tags, the sitemap and JSON-LD will point to http://localhost:3000.",
  );
}

const title = `${businessInfo.name} | ${businessInfo.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(businessInfo.siteUrl),
  title: {
    default: title,
    template: `%s | ${businessInfo.name}`,
  },
  description: businessInfo.description,
  keywords: [
    "restaurant Bortianor",
    "Ghanaian food Accra",
    "Nigerian food Accra",
    "Skyways Hotel restaurant",
    "Jack Mullar Beach Junction",
    "catering Accra",
    "fufu light soup",
    "jollof rice Accra",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: businessInfo.name,
    title,
    description: businessInfo.description,
    // Image comes from src/app/opengraph-image.tsx (1200×630).
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: businessInfo.description,
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" className={`${geistSans.variable} ${fraunces.variable} antialiased`}>
      <body className="min-h-dvh bg-stone-50 font-sans text-stone-900">
        <RestaurantSchema />
        <SmoothScroll>
          <CartProvider>{children}</CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

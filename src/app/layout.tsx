import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { businessInfo } from "@/data/businessInfo";
import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/providers/SmoothScroll";
import RestaurantSchema from "@/components/seo/RestaurantSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    images: [
      {
        url: "/images/hero-mixed-platter.jpg",
        width: 720,
        height: 718,
        alt: "Grand Gees mixed platter with jollof, fried rice, plantain and chicken",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: businessInfo.description,
    images: ["/images/hero-mixed-platter.jpg"],
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-dvh bg-neutral-50 font-sans text-neutral-900">
        <RestaurantSchema />
        <SmoothScroll>
          <CartProvider>{children}</CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

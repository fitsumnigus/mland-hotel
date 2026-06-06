// src/app/layout.tsx
import React from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Markland Hotel & Spa — Luxury Redefined",
    template: "%s | Markland Hotel & Spa",
  },
  description:
    "Experience unparalleled luxury at Markland Hotel & Spa. Award-winning rooms, world-class spa treatments, and exceptional dining in an unforgettable setting.",
  keywords: ["luxury hotel", "spa", "fine dining", "boutique hotel", "Markland"],
  authors: [{ name: "Markland Hotel & Spa" }],
  creator: "Markland Hotel & Spa",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://marklandhotel.com",
    siteName: "Markland Hotel & Spa",
    title: "Markland Hotel & Spa — Luxury Redefined",
    description: "Experience unparalleled luxury at Markland Hotel & Spa.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Markland Hotel & Spa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markland Hotel & Spa",
    description: "Luxury redefined.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0d0b0a" },
    { media: "(prefers-color-scheme: light)", color: "#fdfcf9" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}

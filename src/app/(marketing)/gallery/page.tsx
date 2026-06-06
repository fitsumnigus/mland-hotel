// src/app/(marketing)/gallery/page.tsx
import { Metadata } from "next";
import { GalleryPageClient } from "@/components/pages/GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photography of Markland Hotel & Spa — rooms and suites, spa, dining, estate grounds, and the Wicklow landscape.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}

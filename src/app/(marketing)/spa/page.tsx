// src/app/(marketing)/spa/page.tsx
import { Metadata } from "next";
import { SpaPageClient } from "@/components/pages/SpaPageClient";

export const metadata: Metadata = {
  title: "Spa & Wellness",
  description:
    "Markland's 4,200 sq ft spa sanctuary — thermal pools, signature rituals, and total restoration in the heart of County Wicklow.",
};

export default function SpaPage() {
  return <SpaPageClient />;
}

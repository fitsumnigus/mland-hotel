// src/app/(marketing)/dining/page.tsx
import { Metadata } from "next";
import { DiningPageClient } from "@/components/pages/DiningPageClient";

export const metadata: Metadata = {
  title: "Dining",
  description:
    "Three distinct dining experiences at Markland — from two Michelin-starred tasting menus to leisurely garden terrace brunches.",
};

export default function DiningPage() {
  return <DiningPageClient />;
}

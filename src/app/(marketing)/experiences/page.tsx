// src/app/(marketing)/experiences/page.tsx
import { Metadata } from "next";
import { ExperiencesPageClient } from "@/components/pages/ExperiencesPageClient";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Curated experiences at Markland — from private estate tours and whiskey tastings to falconry and guided wild swimming.",
};

export default function ExperiencesPage() {
  return <ExperiencesPageClient />;
}

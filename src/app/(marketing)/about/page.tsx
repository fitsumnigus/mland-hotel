// src/app/(marketing)/about/page.tsx
import { Metadata } from "next";
import { AboutPageClient } from "@/components/pages/AboutPageClient";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Established in 1923, Markland Hotel & Spa has been a benchmark of Irish luxury hospitality for over a century.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}

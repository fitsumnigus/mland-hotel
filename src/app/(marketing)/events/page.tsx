// src/app/(marketing)/events/page.tsx
import { Metadata } from "next";
import { EventsPageClient } from "@/components/pages/EventsPageClient";

export const metadata: Metadata = {
  title: "Meetings & Events",
  description:
    "Six event spaces for weddings, conferences, private dining, and retreats at Markland Hotel & Spa, County Wicklow.",
};

export default function EventsPage() {
  return <EventsPageClient />;
}

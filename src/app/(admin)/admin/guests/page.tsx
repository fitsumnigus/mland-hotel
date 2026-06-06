// src/app/(admin)/admin/guests/page.tsx
import { Metadata } from "next";
import { AdminGuestsPageClient } from "@/components/admin/AdminGuestsPageClient";

export const metadata: Metadata = { title: "Guests | Markland Admin" };

export default function AdminGuestsPage() {
  return <AdminGuestsPageClient />;
}

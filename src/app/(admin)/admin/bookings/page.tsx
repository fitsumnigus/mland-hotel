// src/app/(admin)/admin/bookings/page.tsx
import { Metadata } from "next";
import { AdminBookingsPageClient } from "@/components/admin/AdminBookingsPageClient";

export const metadata: Metadata = { title: "Bookings | Markland Admin" };

export default function AdminBookingsPage() {
  return <AdminBookingsPageClient />;
}

// src/app/(admin)/admin/rooms/page.tsx
import { Metadata } from "next";
import { AdminRoomsPageClient } from "@/components/admin/AdminRoomsPageClient";

export const metadata: Metadata = { title: "Rooms | Markland Admin" };

export default function AdminRoomsPage() {
  return <AdminRoomsPageClient />;
}

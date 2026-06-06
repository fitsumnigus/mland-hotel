// src/app/(admin)/admin/settings/page.tsx
import { Metadata } from "next";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export const metadata: Metadata = { title: "Settings | Markland Admin" };

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}

// src/app/(admin)/admin/page.tsx
import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Dashboard | Markland Admin" };

export default function AdminPage() {
  return <AdminDashboard />;
}

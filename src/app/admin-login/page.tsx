// src/app/admin-login/page.tsx
import { Metadata } from "next";
import { AdminLoginClient } from "@/components/admin/AdminLoginClient";

export const metadata: Metadata = { title: "Admin Login | Markland Hotel" };

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}

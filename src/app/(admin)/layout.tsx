// src/app/(admin)/layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookie();
  if (!session) redirect("/admin-login");

  return (
    <AdminShell session={session!}>
      {children}
    </AdminShell>
  );
}

// src/app/(admin)/admin/analytics/page.tsx
import { Metadata } from "next";
import { AdminAnalyticsClient } from "@/components/admin/AdminAnalyticsClient";

export const metadata: Metadata = { title: "Analytics | Markland Admin" };

export default function AdminAnalyticsPage() {
  return <AdminAnalyticsClient />;
}

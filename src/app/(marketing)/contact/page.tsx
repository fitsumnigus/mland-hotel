// src/app/(marketing)/contact/page.tsx
import { Metadata } from "next";
import { ContactPageClient } from "@/components/pages/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Markland Hotel & Spa — reservations, enquiries, and concierge requests.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}

// src/app/(marketing)/spa/book/page.tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Book a Spa Treatment",
  description: "Book a spa treatment at Markland Hotel & Spa.",
};

// Spa booking is handled via the contact/reservations team.
// Redirect to contact page with intent pre-filled via query param.
export default function SpaBookPage() {
  redirect("/contact?enquiry=spa");
}

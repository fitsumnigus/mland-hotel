// src/app/(marketing)/concierge/page.tsx
import { Metadata } from "next";
import { SimplePageClient } from "@/components/pages/SimplePageClient";

export const metadata: Metadata = {
  title: "Concierge",
  description:
    "Markland's concierge team — available 24 hours to arrange anything from private transfers to impossible restaurant reservations.",
};

export default function ConciergePage() {
  return (
    <SimplePageClient
      eyebrow="Guest Services"
      title={"Your Concierge,\nAvailable Always"}
      subtitle="Our team of dedicated concierges is available 24 hours a day, seven days a week. Nothing is too small; very little is too large."
      heroImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90"
      heroAlt="Markland Hotel concierge desk"
      backHref="/"
      backLabel="Home"
      sections={[
        {
          heading: "What We Arrange",
          body: "Private transfers to and from Dublin Airport and city centre. Restaurant reservations in Dublin and across Ireland, including venues that are otherwise fully booked. Theatre and concert tickets, sporting events, and private tours. Childcare, personal shopping, dry cleaning, and flower arrangements. Helicopter charters, yacht hire, and private aircraft. If you need it, we will find a way.",
        },
        {
          heading: "In-Room Requests",
          body: "Dial 0 from your room at any hour. Our team responds within ten minutes to all requests. For advance arrangements — a breakfast surprise, a bottle of a specific vintage, a personalised itinerary — contact us before your arrival and we will have everything ready when you check in.",
        },
        {
          heading: "Reach Us",
          body: "Tel: +353 1 234 5678 (ext. 1) · concierge@marklandhotel.com · In person at the concierge desk in the main lobby, open 07:00 – 23:00 daily. After hours: dial 0 from any room telephone.",
        },
      ]}
      ctas={[
        { label: "Contact Concierge", href: "/contact", variant: "primary" },
        { label: "Book a Room",       href: "/book",    variant: "outline" },
      ]}
    />
  );
}

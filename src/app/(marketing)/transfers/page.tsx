// src/app/(marketing)/transfers/page.tsx
import { Metadata } from "next";
import { SimplePageClient } from "@/components/pages/SimplePageClient";

export const metadata: Metadata = {
  title: "Transfers",
  description:
    "Private chauffeur transfers between Markland Hotel & Spa and Dublin Airport, city centre, and beyond.",
};

export default function TransfersPage() {
  return (
    <SimplePageClient
      eyebrow="Guest Services"
      title={"Private Transfers"}
      subtitle="Arrive and depart in complete comfort. Our chauffeur service operates 24 hours, seven days a week."
      heroImage="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=90"
      heroAlt="Private chauffeur transfer vehicle"
      backHref="/"
      backLabel="Home"
      sections={[
        {
          heading: "Dublin Airport",
          body: "One-way transfer between Markland and Dublin Airport: €180 per vehicle. Journey time is approximately 75 minutes depending on traffic. Our driver will track your flight and adjust pickup time accordingly. We accommodate up to seven passengers with luggage in our Mercedes-Benz V-Class.",
        },
        {
          heading: "Dublin City Centre",
          body: "One-way transfer to or from central Dublin: €140 per vehicle. Popular for theatre evenings, business meetings, or day trips to the capital. Return transfers can be pre-booked at a combined rate of €260.",
        },
        {
          heading: "Bespoke Routes",
          body: "We arrange transfers to any destination in Ireland — Kilkenny, Cork, Galway, Belfast, and beyond. Rates vary by distance. Multi-day chauffeur hire is available for guests who prefer not to drive during their stay. All vehicles are maintained to the highest standard and driven by fully licensed, insured professionals.",
        },
        {
          heading: "How to Book",
          body: "Contact our concierge team at least 24 hours before your required transfer time. For same-day bookings, we will do our best to accommodate. Payment is added to your room account. Cancellation without charge is available up to four hours before pickup.",
        },
      ]}
      ctas={[
        { label: "Arrange a Transfer", href: "/contact", variant: "primary" },
        { label: "Contact Concierge",  href: "/concierge", variant: "outline" },
      ]}
    />
  );
}

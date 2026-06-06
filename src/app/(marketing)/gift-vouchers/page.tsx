// src/app/(marketing)/gift-vouchers/page.tsx
import { Metadata } from "next";
import { SimplePageClient } from "@/components/pages/SimplePageClient";

export const metadata: Metadata = {
  title: "Gift Vouchers",
  description:
    "Markland Hotel & Spa gift vouchers — for stays, spa treatments, dining, and experiences. The gift that begins before it is opened.",
};

export default function GiftVouchersPage() {
  return (
    <SimplePageClient
      eyebrow="Gift Giving"
      title={"The Gift That\nBegins Before\nIt Is Opened"}
      subtitle="A Markland gift voucher is an invitation to something extraordinary. Available for stays, spa treatments, dining, or as an open-value card."
      heroImage="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&q=90"
      heroAlt="Markland Hotel gift voucher"
      backHref="/"
      backLabel="Home"
      sections={[
        {
          heading: "Overnight Stays",
          body: "Gift a one, two, or three-night stay in any of our room categories, from a Deluxe Garden Room to the Presidential Suite. The recipient chooses their dates and we handle everything else. Overnight stay vouchers include breakfast for two and complimentary thermal spa access.",
        },
        {
          heading: "Spa Treatments",
          body: "Spa vouchers can be redeemed against any treatment in our menu — from the 45-minute Atlantic Seaweed Bath to the 120-minute Markland Ritual. Couples spa vouchers for side-by-side treatments are among our most popular gifts.",
        },
        {
          heading: "Dining Experiences",
          body: "Gift a dinner at The Grove (Michelin ★★), a lunch in The Cellars, or a Sunday champagne brunch on the Garden Terrace. Dining vouchers are also available as open-value credits against the full food and beverage bill.",
        },
        {
          heading: "Open-Value Vouchers",
          body: "Prefer to let the recipient choose? Open-value vouchers are available from €50 to €5,000 and can be redeemed against any element of the Markland experience — accommodation, dining, spa, or transfers. Valid for 24 months from date of purchase.",
        },
        {
          heading: "How to Order",
          body: "Contact our reservations team by phone or email. Vouchers are dispatched by post in a bespoke Markland gift box within two working days, or issued by email for last-minute gifts. Printed vouchers can also be collected at the hotel.",
        },
      ]}
      ctas={[
        { label: "Order a Voucher",   href: "/contact", variant: "primary" },
        { label: "Call Reservations", href: "/contact", variant: "outline" },
      ]}
    />
  );
}

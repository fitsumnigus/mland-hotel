// src/app/(marketing)/careers/page.tsx
import { Metadata } from "next";
import { SimplePageClient } from "@/components/pages/SimplePageClient";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Markland Hotel & Spa team — hospitality careers in County Wicklow's finest luxury hotel.",
};

export default function CareersPage() {
  return (
    <SimplePageClient
      eyebrow="Join Our Team"
      title={"Work Where\nOthers Holiday"}
      subtitle="We are always looking for people who care deeply about the details — those who understand that hospitality is not a transaction but a craft."
      heroImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=90"
      heroAlt="Markland Hotel team"
      backHref="/about"
      backLabel="Our Story"
      sections={[
        {
          heading: "Our Culture",
          body: "Markland is a privately owned, independently operated hotel. That means decisions are made by people who are present every day — not by shareholders in another country. We invest heavily in our team: staff training, mentorship, career progression, and wellbeing. 78% of our management team joined us in entry-level roles.",
        },
        {
          heading: "Current Opportunities",
          body: "We recruit across all departments: Food & Beverage (kitchen brigade, floor service, sommelier), Spa (therapists, reception), Front of House (reception, concierge, reservations), Housekeeping, Maintenance, and Management. We run a formal apprenticeship programme in partnership with the Irish Hotels Federation.",
        },
        {
          heading: "Benefits",
          body: "Competitive salary benchmarked annually. Free meals on duty. Staff accommodation available. Employee discounts on accommodation, dining, and spa. Health insurance contribution after six months. 25 days annual leave rising to 28 after three years. Annual professional development budget of €800 per person.",
        },
        {
          heading: "How to Apply",
          body: "Send your CV and a short covering note — telling us what draws you to Markland specifically — to careers@marklandhotel.com. We read every application personally and respond within five working days. We do not use automated screening.",
        },
      ]}
      ctas={[
        { label: "Send Your Application", href: "/contact", variant: "primary" },
      ]}
    />
  );
}

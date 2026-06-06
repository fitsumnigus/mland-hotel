// src/app/(marketing)/press/page.tsx
import { Metadata } from "next";
import { SimplePageClient } from "@/components/pages/SimplePageClient";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Markland Hotel & Spa press information, media contacts, press kit download, and recent coverage.",
};

export default function PressPage() {
  return (
    <SimplePageClient
      eyebrow="Media"
      title={"Press &\nMedia"}
      subtitle="For interview requests, photography access, review stays, and press kit materials — our PR team responds within one working day."
      heroImage="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=90"
      heroAlt="Markland Hotel estate"
      backHref="/about"
      backLabel="Our Story"
      sections={[
        {
          heading: "Recent Coverage",
          body: "Condé Nast Traveller — 'One of Europe's great hidden hotels' (2024). The Times — 'Sublime in every particular' (2024). Tatler — 'The new benchmark for Irish luxury' (2024). Forbes Travel Guide — Five Star Award (2024). The Sunday Times — Hotel of the Year, Ireland (2023). National Geographic — Unique Lodges of the World (2023).",
        },
        {
          heading: "Media Contact",
          body: "All press enquiries should be directed to our communications team: press@marklandhotel.com · +353 1 234 5679. We accommodate review stays, photography shoots, and broadcast visits by prior arrangement. We ask that publications share a copy of any coverage upon publication.",
        },
        {
          heading: "Press Kit",
          body: "Our press kit includes high-resolution photography (rooms, spa, dining, estate grounds), property fact sheet, ownership and management biography, sustainability report, awards history, and sample menus. Download links are issued upon request to accredited journalists and media professionals.",
        },
        {
          heading: "Photography Guidelines",
          body: "All photography of guests, staff, or private areas requires prior written consent from the General Manager. Media photographers must be accompanied by a member of the communications team at all times. Our press kit photography is available for editorial use with credit.",
        },
      ]}
      ctas={[
        { label: "Contact Press Team", href: "/contact", variant: "primary" },
      ]}
    />
  );
}

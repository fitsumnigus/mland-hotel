// src/app/(marketing)/sustainability/page.tsx
import { Metadata } from "next";
import { SimplePageClient } from "@/components/pages/SimplePageClient";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Markland's commitment to the Wicklow landscape — how we work to protect the environment that makes us who we are.",
};

export default function SustainabilityPage() {
  return (
    <SimplePageClient
      eyebrow="Our Responsibility"
      title={"Stewardship\nof the Land"}
      subtitle="The Wicklow landscape is not our backdrop. It is the reason we exist. Protecting it is not a policy — it is our oldest obligation."
      heroImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=90"
      heroAlt="Markland estate woodland"
      backHref="/about"
      backLabel="Our Story"
      sections={[
        {
          heading: "The Estate",
          body: "Our 300-acre estate is managed under a biodiversity plan developed with the National Parks and Wildlife Service. Forty percent of the woodland is designated as a wildlife corridor and managed with no human intervention. We maintain two rewilded meadows, three managed ponds, and a 2-acre organic kitchen garden that supplies both restaurants.",
        },
        {
          heading: "Energy",
          body: "Since 2021, 100% of Markland's electricity comes from renewable sources — a combination of our own 48-panel solar array, a 200kW ground-source heat pump system, and a Power Purchase Agreement with a County Wexford wind farm. We have reduced our total energy consumption by 34% since 2018.",
        },
        {
          heading: "Food & Supply",
          body: "Our kitchen teams source 80% of ingredients from within 60 kilometres. We partner with 24 local producers — farmers, fishermen, cheesemakers, and foragers — all of whom we visit personally before listing. Food waste is composted on-site; cooking oil is converted to biodiesel for our estate vehicles.",
        },
        {
          heading: "Building & Materials",
          body: "Our 2023 spa extension was built using reclaimed Wicklow granite, sustainably sourced Irish oak, and natural lime plaster. We have committed to sourcing only FSC-certified timber and recycled or natural materials in all future building works.",
        },
        {
          heading: "Community",
          body: "We employ 78% of our 140 staff from within County Wicklow. We fund two apprenticeships annually through the Hospitality Skills programme. Since 2020, we have donated €180,000 to local environmental organisations and contributed 2,000 volunteer hours to habitat restoration projects in the Wicklow Mountains National Park.",
        },
      ]}
      ctas={[
        { label: "Read Our Full Report", href: "/contact", variant: "primary" },
        { label: "Our Story",            href: "/about",   variant: "outline" },
      ]}
    />
  );
}

// src/app/(marketing)/dining/wine/page.tsx
import { Metadata } from "next";
import { SimplePageClient } from "@/components/pages/SimplePageClient";

export const metadata: Metadata = {
  title: "The Wine Cellar",
  description:
    "Markland's cellar of 12,000 bottles — grand Burgundy, rare Irish craft spirits, and private tastings with our master sommelier.",
};

export default function WinePage() {
  return (
    <SimplePageClient
      eyebrow="The Cellar"
      title={"12,000 Bottles.\nOne Story."}
      subtitle="A cellar curated over four decades by our master sommelier — spanning the great châteaux of Bordeaux, the finest Irish whiskeys, and everything in between."
      heroImage="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1920&q=90"
      heroAlt="Markland wine cellar"
      backHref="/dining"
      backLabel="Dining"
      sections={[
        {
          heading: "The Collection",
          body: "Our cellar holds 12,000 bottles across 600 labels. The collection spans six decades of vintages from Burgundy, Bordeaux, Champagne, and the Rhône, alongside a hand-selected portfolio of New World wines and Irish craft spirits. Every bottle has a story; our sommelier knows all of them.",
          image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80",
        },
        {
          heading: "Private Tastings",
          body: "Private cellar tastings are available for groups of two to twelve. Our master sommelier will guide you through a curated flight — whether a vertical tasting of a single estate, a journey through Irish whiskey, or a bespoke pairing designed around your palate. Tastings last approximately 90 minutes.",
        },
        {
          heading: "Cellar Tours",
          body: "A guided walk through the original 18th-century cellar, built with the manor house and extended twice in the 19th century. You will see the oldest bottles in our collection — some dating to 1971 — and learn the history of how this particular collection came to be. Tours run Tuesday and Thursday at 6pm.",
        },
      ]}
      ctas={[
        { label: "Book a Tasting", href: "/contact", variant: "primary" },
        { label: "View Dining", href: "/dining", variant: "outline" },
      ]}
    />
  );
}

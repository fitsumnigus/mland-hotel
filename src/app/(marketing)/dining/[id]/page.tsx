// src/app/(marketing)/dining/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiningDetailClient } from "@/components/pages/DiningDetailClient";

const RESTAURANTS = {
  grove: {
    id:      "grove",
    name:    "The Grove",
    tag:     "Michelin ★★",
    cuisine: "Modern Irish · Tasting Menu",
    description:
      "An intimate 32-cover dining room on the ground floor of the original manor house. Chef Sean Thornton's seasonal tasting menus evolve with the estate garden — eight courses, no shortcuts, no compromises. The Grove earned its first Michelin star in 2019 and its second in 2022.",
    detail:
      "Tuesday – Saturday · First sitting 7pm · Second sitting 9:30pm",
    heroImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85",
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1200&q=85",
    ],
    menuHighlights: [
      { course: "Amuse-bouche", dish: "Seaweed crisp, cultured cream, trout roe" },
      { course: "First",        dish: "Hand-dived scallop, cauliflower, preserved lemon" },
      { course: "Second",       dish: "Wild Wicklow venison, celeriac, juniper jus" },
      { course: "Cheese",       dish: "Selection of Irish farmhouse cheeses" },
      { course: "Dessert",      dish: "Burnt honey parfait, meadowsweet, hazelnut" },
    ],
  },
  cellars: {
    id:      "cellars",
    name:    "The Cellars",
    tag:     "Michelin ★",
    cuisine: "European Brasserie",
    description:
      "Classic European cooking in the original 18th-century wine cellar beneath the house. Stone walls, candlelight, and cooking that is rich, precise, and deeply satisfying. The Cellars is open for lunch and dinner daily, offering a more relaxed counterpoint to The Grove.",
    detail: "Daily · Lunch 12pm – 2:30pm · Dinner 6pm – 10pm",
    heroImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
    ],
    menuHighlights: [
      { course: "Starter",   dish: "Chicken liver parfait, brioche, Sauternes jelly" },
      { course: "Main",      dish: "Roast côte de boeuf for two, béarnaise, pommes frites" },
      { course: "Main",      dish: "Sole meunière, capers, lemon, brown butter" },
      { course: "Dessert",   dish: "Crème brûlée, shortbread" },
    ],
  },
  terrace: {
    id:      "terrace",
    name:    "Garden Terrace",
    tag:     "Al Fresco",
    cuisine: "Garden Seasonal",
    description:
      "When the Irish weather obliges — which it does more often than you might expect — the walled garden terrace becomes the heart of Markland. Champagne brunch on Sundays, afternoon tea daily from May through September, and light evening suppers under a canopy of wisteria.",
    detail: "May – September · 10am – 9pm daily",
    heroImage:
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1920&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1200&q=85",
    ],
    menuHighlights: [
      { course: "Brunch",  dish: "Eggs Benedict, Clonakilty black pudding" },
      { course: "Tea",     dish: "Warm scones, clotted cream, estate strawberry jam" },
      { course: "Evening", dish: "Charcuterie board, artisan breads, estate pickles" },
    ],
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return Object.keys(RESTAURANTS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const r = RESTAURANTS[id as keyof typeof RESTAURANTS];
  if (!r) return { title: "Restaurant Not Found" };
  return {
    title:       `${r.name} — Dining`,
    description: r.description.slice(0, 155),
  };
}

export default async function DiningDetailPage({ params }: PageProps) {
  const { id } = await params;
  const restaurant = RESTAURANTS[id as keyof typeof RESTAURANTS];
  if (!restaurant) notFound();
  return <DiningDetailClient restaurant={restaurant} />;
}

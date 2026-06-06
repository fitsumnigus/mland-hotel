// src/app/(marketing)/rooms/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROOM_CATALOG, getRoomBySlug } from "@/lib/data/rooms.data";
import { RoomDetailClient } from "@/components/rooms/RoomDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ROOM_CATALOG.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return { title: "Room Not Found" };

  return {
    title: `${room.name} — ${room.tierLabel}`,
    description: room.shortDesc,
    openGraph: {
      title: `${room.name} | Markland Hotel & Spa`,
      description: room.shortDesc,
      images: [{ url: room.heroImage, width: 1600, height: 900, alt: room.name }],
    },
  };
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);

  if (!room) notFound();

  // Related rooms — same tier or adjacent, excluding current
  const related = ROOM_CATALOG.filter(
    (r) => r.slug !== slug && r.sortOrder >= room.sortOrder - 1 && r.sortOrder <= room.sortOrder + 2
  ).slice(0, 3);

  return <RoomDetailClient room={room} related={related} />;
}

// src/app/(marketing)/rooms/page.tsx
import { Metadata } from "next";
import { ROOM_CATALOG } from "@/lib/data/rooms.data";
import { RoomsListingClient } from "@/components/rooms/RoomsListingClient";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Discover 48 individually designed rooms and suites at Markland Hotel & Spa — from intimate garden retreats to palatial penthouses across six distinct tiers.",
};

export default function RoomsPage() {
  return <RoomsListingClient rooms={ROOM_CATALOG} />;
}

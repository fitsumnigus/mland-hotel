// src/app/(booking)/book/page.tsx
import { Metadata } from "next";
import { BookingEngine } from "@/components/booking/BookingEngine";

export const metadata: Metadata = {
  title: "Reserve Your Stay",
  description: "Book your room at Markland Hotel & Spa. Best rates guaranteed when booking direct.",
};

interface PageProps {
  searchParams: Promise<{
    checkIn?:   string;
    checkOut?:  string;
    adults?:    string;
    children?:  string;
    roomId?:    string;
    slug?:      string;
  }>;
}

export default async function BookPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BookingEngine
      initialCheckIn={params.checkIn  ?? ""}
      initialCheckOut={params.checkOut ?? ""}
      initialAdults={Number(params.adults   ?? 2)}
      initialChildren={Number(params.children ?? 0)}
      initialRoomId={params.roomId ?? null}
      initialSlug={params.slug   ?? null}
    />
  );
}

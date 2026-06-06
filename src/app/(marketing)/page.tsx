// src/app/(marketing)/page.tsx
import { Metadata } from "next";
import { HeroSection }          from "@/components/rooms/HeroSection";
import { BookingBar }           from "@/components/booking/BookingBar";
import { FeaturedRooms }        from "@/components/rooms/FeaturedRooms";
import { SpaSection }           from "@/components/rooms/SpaSection";
import { RestaurantSection }    from "@/components/rooms/RestaurantSection";
import { EventsSection }        from "@/components/rooms/EventsSection";
import { GallerySection }       from "@/components/rooms/GallerySection";
import { TestimonialsSection }  from "@/components/rooms/TestimonialsSection";
import { AwardsSection }        from "@/components/rooms/AwardsSection";

export const metadata: Metadata = {
  title: "Markland Hotel & Spa — Luxury Redefined",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BookingBar />
      <FeaturedRooms />
      <SpaSection />
      <RestaurantSection />
      <GallerySection />
      <EventsSection />
      <TestimonialsSection />
      <AwardsSection />
    </>
  );
}

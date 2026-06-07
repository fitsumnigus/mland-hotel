// prisma/seed.ts
import {
  PrismaClient,
  RoomTier,
  RoomStatus,
  AmenityCategory,
  ServiceCategory,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { ROOM_CATALOG } from "../src/lib/data/rooms.data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Markland Hotel database…");

  // ── 1. Amenity master list ──────────────────────────────────────────
  const amenityDefs: {
    slug: string;
    name: string;
    icon: string;
    category: AmenityCategory;
  }[] = [
    { slug: "king-bed",            name: "King Bed",               icon: "bed-double",    category: AmenityCategory.ROOM },
    { slug: "twin-beds",           name: "Twin Beds",              icon: "bed-double",    category: AmenityCategory.ROOM },
    { slug: "fireplace",           name: "Stone Fireplace",        icon: "flame",         category: AmenityCategory.ROOM },
    { slug: "private-terrace",     name: "Private Terrace",        icon: "door-open",     category: AmenityCategory.ROOM },
    { slug: "sitting-room",        name: "Separate Sitting Room",  icon: "sofa",          category: AmenityCategory.ROOM },
    { slug: "dining-room",         name: "Private Dining Room",    icon: "utensils",      category: AmenityCategory.ROOM },
    { slug: "butler-pantry",       name: "Butler Pantry",          icon: "utensils",      category: AmenityCategory.ROOM },
    { slug: "soaking-tub",         name: "Soaking Tub",            icon: "bath",          category: AmenityCategory.BATHROOM },
    { slug: "copper-tub",          name: "Copper Soaking Tub",     icon: "bath",          category: AmenityCategory.BATHROOM },
    { slug: "rain-shower",         name: "Rain Shower",            icon: "shower-head",   category: AmenityCategory.BATHROOM },
    { slug: "double-vanity",       name: "Double Vanity",          icon: "sink",          category: AmenityCategory.BATHROOM },
    { slug: "marble-bath",         name: "Wicklow Marble",         icon: "gem",           category: AmenityCategory.BATHROOM },
    { slug: "wifi",                name: "High-Speed WiFi",        icon: "wifi",          category: AmenityCategory.TECHNOLOGY },
    { slug: "tv-65",               name: "65\u2033 4K TV",         icon: "tv",            category: AmenityCategory.TECHNOLOGY },
    { slug: "tv-75",               name: "75\u2033 4K TV",         icon: "tv",            category: AmenityCategory.TECHNOLOGY },
    { slug: "sonos",               name: "Sonos Sound System",     icon: "music",         category: AmenityCategory.TECHNOLOGY },
    { slug: "nespresso",           name: "Nespresso Machine",      icon: "coffee",        category: AmenityCategory.DINING },
    { slug: "minibar",             name: "Mini Bar",               icon: "wine",          category: AmenityCategory.DINING },
    { slug: "private-bar",         name: "Private Bar",            icon: "wine",          category: AmenityCategory.DINING },
    { slug: "room-service",        name: "24h Room Service",       icon: "concierge-bell",category: AmenityCategory.SERVICE },
    { slug: "housekeeping",        name: "Daily Housekeeping",     icon: "sparkles",      category: AmenityCategory.SERVICE },
    { slug: "turndown",            name: "Turn-Down Service",      icon: "moon",          category: AmenityCategory.SERVICE },
    { slug: "butler",              name: "Personal Butler",        icon: "user-check",    category: AmenityCategory.SERVICE },
    { slug: "spa-access",          name: "Spa Thermal Access",     icon: "dumbbell",      category: AmenityCategory.WELLNESS },
  ];

  console.log("  Creating amenities…");
  const amenities: Record<string, string> = {};
  for (const def of amenityDefs) {
    const a = await prisma.amenity.upsert({
      where:  { slug: def.slug },
      update: def,
      create: def,
    });
    amenities[def.slug] = a.id;
  }

  // ── 2. Room categories from static catalog ──────────────────────────
  console.log("  Creating room categories…");
  const categoryMap: Record<string, string> = {};

  for (const room of ROOM_CATALOG) {
    const cat = await prisma.roomCategory.upsert({
      where:  { slug: room.slug },
      update: {
        name:             room.name,
        tier:             room.tier as RoomTier,
        description:      room.description,
        shortDesc:        room.shortDesc,
        maxOccupancy:     room.maxOccupancy,
        maxAdults:        room.maxAdults,
        maxChildren:      room.maxChildren,
        sizeM2:           room.sizeM2,
        floorMin:         room.floorMin,
        floorMax:         room.floorMax,
        baseRateWeekday:  room.baseRateWeekday,
        baseRateWeekend:  room.baseRateWeekend,
        heroImage:        room.heroImage,
        galleryImages:    room.galleryImages,
        featured:         room.featured,
        published:        true,
        sortOrder:        room.sortOrder,
      },
      create: {
        slug:             room.slug,
        name:             room.name,
        tier:             room.tier as RoomTier,
        description:      room.description,
        shortDesc:        room.shortDesc,
        maxOccupancy:     room.maxOccupancy,
        maxAdults:        room.maxAdults,
        maxChildren:      room.maxChildren,
        sizeM2:           room.sizeM2,
        floorMin:         room.floorMin,
        floorMax:         room.floorMax,
        baseRateWeekday:  room.baseRateWeekday,
        baseRateWeekend:  room.baseRateWeekend,
        heroImage:        room.heroImage,
        galleryImages:    room.galleryImages,
        featured:         room.featured,
        published:        true,
        sortOrder:        room.sortOrder,
        cancellationHours: 48,
      },
    });
    categoryMap[room.slug] = cat.id;

    const amenityLinks: { slug: string; highlight: boolean }[] = [
      { slug: "king-bed",      highlight: true  },
      { slug: "wifi",          highlight: true  },
      { slug: "room-service",  highlight: false },
      { slug: "housekeeping",  highlight: false },
      { slug: "spa-access",    highlight: !["DELUXE","SUPERIOR"].includes(room.tier) },
    ];
    if (room.tier !== "DELUXE")
      amenityLinks.push({ slug: "minibar", highlight: false });
    if (["JUNIOR_SUITE","SUITE","GRAND_SUITE","PRESIDENTIAL"].includes(room.tier))
      amenityLinks.push({ slug: "sonos", highlight: false }, { slug: "turndown", highlight: false });
    if (["SUITE","GRAND_SUITE","PRESIDENTIAL"].includes(room.tier))
      amenityLinks.push({ slug: "butler", highlight: true }, { slug: "private-bar", highlight: false });

    for (const link of amenityLinks) {
      if (!amenities[link.slug]) continue;
      await prisma.roomCategoryAmenity.upsert({
        where:  { categoryId_amenityId: { categoryId: cat.id, amenityId: amenities[link.slug] } },
        update: { highlight: link.highlight },
        create: { categoryId: cat.id, amenityId: amenities[link.slug], highlight: link.highlight },
      });
    }
  }

  // ── 3. Physical rooms (inventory) ────────────────────────────────────
  console.log("  Creating room inventory…");
  type RoomEntry = { number: string; floor: number; slug: string };
  const roomInventory: RoomEntry[] = [
    ...Array.from({ length: 8 }, (_, i): RoomEntry => ({
      number: `${Math.floor(i / 3) + 1}0${(i % 3) + 1}`,
      floor:  Math.floor(i / 3) + 1,
      slug:   "deluxe-garden-room",
    })),
    ...Array.from({ length: 8 }, (_, i): RoomEntry => ({
      number: `${Math.floor(i / 3) + 2}1${(i % 3) + 1}`,
      floor:  Math.floor(i / 3) + 2,
      slug:   "superior-room",
    })),
    ...Array.from({ length: 8 }, (_, i): RoomEntry => ({
      number: `${Math.floor(i / 3) + 3}2${(i % 3) + 1}`,
      floor:  Math.floor(i / 3) + 3,
      slug:   "junior-suite",
    })),
    ...Array.from({ length: 6 }, (_, i): RoomEntry => ({
      number: `${Math.floor(i / 2) + 4}3${(i % 2) + 1}`,
      floor:  Math.floor(i / 2) + 4,
      slug:   "classic-suite",
    })),
    ...Array.from({ length: 4 }, (_, i): RoomEntry => ({
      number: `${i + 5}40`,
      floor:  i + 5,
      slug:   "grand-suite",
    })),
    { number: "800", floor: 8, slug: "presidential-suite" },
  ];

  for (const r of roomInventory) {
    if (!categoryMap[r.slug]) continue;
    await prisma.room.upsert({
      where:  { number: r.number },
      update: { floor: r.floor, categoryId: categoryMap[r.slug] },
      create: { number: r.number, floor: r.floor, categoryId: categoryMap[r.slug], status: RoomStatus.AVAILABLE },
    });
  }

  // ── 4. Services ───────────────────────────────────────────────────────
  console.log("  Creating services…");
  const services: {
    slug: string;
    name: string;
    description: string;
    category: ServiceCategory;
    price: number;
    duration: number | null;
  }[] = [
    { slug: "couples-massage",    name: "Couples Massage",         description: "60-minute signature couples treatment",        category: ServiceCategory.SPA,       price: 220, duration: 60   },
    { slug: "seaweed-bath",       name: "Atlantic Seaweed Bath",   description: "Traditional Irish seaweed ritual, 45 minutes", category: ServiceCategory.SPA,       price: 120, duration: 45   },
    { slug: "airport-transfer",   name: "Dublin Airport Transfer", description: "Private chauffeur, one way",                   category: ServiceCategory.TRANSPORT, price: 180, duration: null },
    { slug: "champagne",          name: "Welcome Champagne",       description: "Chilled bottle with bespoke note",             category: ServiceCategory.DINING,    price: 95,  duration: null },
    { slug: "flower-arrangement", name: "Fresh Floral Arrangement",description: "Seasonal Irish wildflowers",                  category: ServiceCategory.CONCIERGE, price: 75,  duration: null },
    { slug: "early-checkin",      name: "Early Check-In",          description: "From 10am subject to availability",            category: ServiceCategory.OTHER,     price: 50,  duration: null },
    { slug: "late-checkout",      name: "Late Check-Out",          description: "Until 4pm subject to availability",            category: ServiceCategory.OTHER,     price: 50,  duration: null },
    { slug: "breakfast-in-bed",   name: "Breakfast in Bed",        description: "Full Irish breakfast delivered to your room",  category: ServiceCategory.DINING,    price: 45,  duration: null },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where:  { slug: svc.slug },
      update: svc,
      create: { ...svc, published: true, sortOrder: 0 },
    });
  }

  // ── 5. Rate periods ───────────────────────────────────────────────────
  console.log("  Creating rate periods…");
  const year = new Date().getFullYear();
  const ratePeriods = [
    { name: "Christmas & New Year",  startDate: new Date(`${year}-12-20`), endDate: new Date(`${year + 1}-01-06`), multiplier: 2.0,  minStay: 3 },
    { name: "St Patrick's Weekend",  startDate: new Date(`${year}-03-14`), endDate: new Date(`${year}-03-17`),     multiplier: 1.6,  minStay: 2 },
    { name: "Summer High Season",    startDate: new Date(`${year}-07-01`), endDate: new Date(`${year}-08-31`),     multiplier: 1.35, minStay: 2 },
    { name: "Bank Holiday Weekend",  startDate: new Date(`${year}-05-03`), endDate: new Date(`${year}-05-05`),     multiplier: 1.4,  minStay: 2 },
  ];
  for (const period of ratePeriods) {
    await prisma.ratePeriod.create({ data: period }).catch(() => null);
  }

  // ── 6. Admin user ─────────────────────────────────────────────────────
  console.log("  Creating admin user…");
  const adminHash = await bcrypt.hash("Markland2024!", 12);
  await prisma.user.upsert({
    where:  { email: "admin@marklandhotel.com" },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email:        "admin@marklandhotel.com",
      passwordHash: adminHash,
      firstName:    "Hotel",
      lastName:     "Admin",
      name:         "Hotel Admin",
      role:         "ADMIN",
    },
  });

  const staffHash = await bcrypt.hash("Staff2024!", 12);
  await prisma.user.upsert({
    where:  { email: "staff@marklandhotel.com" },
    update: { passwordHash: staffHash, role: "STAFF" },
    create: {
      email:        "staff@marklandhotel.com",
      passwordHash: staffHash,
      firstName:    "Front",
      lastName:     "Desk",
      name:         "Front Desk",
      role:         "STAFF",
    },
  });

  // ── 7. Sample guests ──────────────────────────────────────────────────
  console.log("  Creating sample guests…");
  const guestHash = await bcrypt.hash("Guest2024!", 10);
  const sampleGuests = [
    { email: "isabelle.moreau@example.com", firstName: "Isabelle",  lastName: "Moreau",   nationality: "FR" },
    { email: "james.thornton@example.com",  firstName: "James",     lastName: "Thornton", nationality: "GB" },
    { email: "mei-ling.chen@example.com",   firstName: "Mei-Ling",  lastName: "Chen",     nationality: "SG" },
    { email: "oliver.schafer@example.com",  firstName: "Oliver",    lastName: "Schaefer", nationality: "DE" },
    { email: "valentina.rossi@example.com", firstName: "Valentina", lastName: "Rossi",    nationality: "IT" },
  ];
  const guestIds: string[] = [];
  for (const g of sampleGuests) {
    const user = await prisma.user.upsert({
      where:  { email: g.email },
      update: {},
      create: {
        email:         g.email,
        passwordHash:  guestHash,
        firstName:     g.firstName,
        lastName:      g.lastName,
        name:          `${g.firstName} ${g.lastName}`,
        nationality:   g.nationality,
        role:          "GUEST",
        loyaltyTier:   "SILVER",
        loyaltyPoints: Math.floor(Math.random() * 3000) + 500,
      },
    });
    guestIds.push(user.id);
  }

  // ── 8. Sample bookings ────────────────────────────────────────────────
  console.log("  Creating sample bookings…");
  const rooms = await prisma.room.findMany({ include: { category: true } });

  const scenarios: {
    guestIdx: number;
    slug:     string;
    daysAhead: number;
    nights:   number;
    status:   BookingStatus;
  }[] = [
    { guestIdx: 0, slug: "grand-suite",       daysAhead:  15, nights: 4, status: BookingStatus.CONFIRMED   },
    { guestIdx: 1, slug: "junior-suite",       daysAhead:   3, nights: 2, status: BookingStatus.CHECKED_IN  },
    { guestIdx: 2, slug: "presidential-suite", daysAhead:  45, nights: 7, status: BookingStatus.CONFIRMED   },
    { guestIdx: 3, slug: "deluxe-garden-room", daysAhead:  -5, nights: 3, status: BookingStatus.CHECKED_OUT },
    { guestIdx: 4, slug: "superior-room",      daysAhead:  30, nights: 2, status: BookingStatus.CONFIRMED   },
    { guestIdx: 0, slug: "classic-suite",      daysAhead:  60, nights: 5, status: BookingStatus.CONFIRMED   },
    { guestIdx: 1, slug: "deluxe-garden-room", daysAhead: -20, nights: 2, status: BookingStatus.CHECKED_OUT },
    { guestIdx: 2, slug: "junior-suite",       daysAhead: -10, nights: 3, status: BookingStatus.CHECKED_OUT },
    { guestIdx: 3, slug: "grand-suite",        daysAhead:   8, nights: 2, status: BookingStatus.CONFIRMED   },
    { guestIdx: 4, slug: "superior-room",      daysAhead: -30, nights: 4, status: BookingStatus.CHECKED_OUT },
  ];

  for (let i = 0; i < scenarios.length; i++) {
    const s    = scenarios[i];
    const room = rooms.find((r) => r.category.slug === s.slug);
    if (!room) continue;

    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + s.daysAhead);
    checkIn.setHours(15, 0, 0, 0);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + s.nights);
    checkOut.setHours(12, 0, 0, 0);

    const rate      = room.category.baseRateWeekday;
    const subtotal  = rate * s.nights;
    const taxAmount = Math.round(subtotal * 0.13 * 100) / 100;
    const total     = subtotal + taxAmount;
    const refNum    = `MH-${new Date().getFullYear()}-${String(i + 1).padStart(4, "0")}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const existing = await prisma.booking.findFirst({ where: { reference: refNum } });
    if (existing) continue;

    const booking = await prisma.booking.create({
      data: {
        reference:      refNum,
        status:         s.status,
        userId:         guestIds[s.guestIdx],
        guestFirstName: sampleGuests[s.guestIdx].firstName,
        guestLastName:  sampleGuests[s.guestIdx].lastName,
        guestEmail:     sampleGuests[s.guestIdx].email,
        guestPhone:     `+353 1 ${Math.floor(Math.random() * 9000000) + 1000000}`,
        checkIn,
        checkOut,
        nights:         s.nights,
        adults:         2,
        children:       0,
        subtotal,
        taxAmount,
        totalAmount:    total,
        currency:       "EUR",
        bookingSource:  "DIRECT",
        confirmedAt:    s.status !== BookingStatus.PENDING ? new Date() : null,
        checkedInAt:
  s.status === BookingStatus.CHECKED_IN || s.status === BookingStatus.CHECKED_OUT
    ? checkIn
    : null,
        checkedOutAt:   s.status === BookingStatus.CHECKED_OUT ? checkOut : null,
        items: {
          create: {
            roomId:       room.id,
            categoryId:   room.categoryId,
            ratePerNight: rate,
            totalRate:    subtotal,
            currency:     "EUR",
          },
        },
        payments: {
          create: {
            status:     s.status === BookingStatus.CHECKED_OUT ? PaymentStatus.CAPTURED : PaymentStatus.AUTHORISED,
            method:     PaymentMethod.CARD,
            amount:     total,
            currency:   "EUR",
            capturedAt: s.status === BookingStatus.CHECKED_OUT ? checkOut : null,
          },
        },
      },
    });

    if (s.status === BookingStatus.CHECKED_IN) {
      await prisma.room.update({
        where: { id: room.id },
        data:  { status: RoomStatus.OCCUPIED, currentBookingId: booking.id },
      });
    }
  }

  // ── 9. Sample reviews ─────────────────────────────────────────────────
  console.log("  Creating sample reviews…");
  const checkedOut = await prisma.booking.findMany({
    where:   { status: BookingStatus.CHECKED_OUT, userId: { not: null } },
    include: { review: true },
    take:    4,
  });

  const reviewTexts = [
    "We've stayed at Claridge's, The Lanesborough, and Ashford Castle. Markland is different — quieter, more genuinely attentive. The kind of place you ring to return before your car has left the driveway.",
    "The Grove alone is worth the journey from London. Two Michelin stars that never feel precious — just extraordinarily good food in a room that makes you feel the world has slowed down.",
    "I booked one night. I stayed four. The spa and the landscape conspired. There is something in the silence of the Wicklow hills that the hotel has somehow bottled.",
    "The afternoon tea, taken on the terrace as the mist rolled across the valley — I have thought of it every day since returning home.",
  ];

  for (let i = 0; i < checkedOut.length; i++) {
    const b = checkedOut[i];
    if (b.review || !b.userId) continue;
    await prisma.review.create({
      data: {
        bookingId:         b.id,
        userId:            b.userId!,
        rating:            5,
        title:             "An exceptional experience",
        body:              reviewTexts[i] ?? "Wonderful stay.",
        ratingCleanliness: 5,
        ratingComfort:     5,
        ratingLocation:    5,
        ratingService:     5,
        ratingValue:       4,
        published:         i < 3,
      },
    }).catch(() => null);
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

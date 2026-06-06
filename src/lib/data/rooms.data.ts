// src/lib/data/rooms.data.ts
// Static room catalog — used for UI, seeding, and API fallback

export interface RoomData {
  id: string;
  slug: string;
  tier: "DELUXE" | "SUPERIOR" | "JUNIOR_SUITE" | "SUITE" | "GRAND_SUITE" | "PRESIDENTIAL";
  tierLabel: string;
  name: string;
  tagline: string;
  shortDesc: string;
  description: string;
  sizeM2: number;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  floorMin: number;
  floorMax: number;
  baseRateWeekday: number;
  baseRateWeekend: number;
  heroImage: string;
  galleryImages: string[];
  features: string[];
  amenities: { category: string; name: string; icon: string }[];
  featured: boolean;
  sortOrder: number;
}

export const ROOM_CATALOG: RoomData[] = [
  {
    id:          "cat-deluxe-garden",
    slug:        "deluxe-garden-room",
    tier:        "DELUXE",
    tierLabel:   "Deluxe Room",
    name:        "Garden Room",
    tagline:     "Morning light through Irish oak",
    shortDesc:   "King bedroom with sculpted garden views, original stone fireplace, and Wicklow marble bathroom.",
    description: "Our Garden Rooms are the heartbeat of Markland — intimate, warm, and generous in detail. Each is anchored by a king bed dressed in hand-loomed Irish linen, positioned to capture the first light as it breaks through the ancient oaks beyond. Original stone fireplaces, individually commissioned by local craftspeople, anchor every room. The en-suite bathroom is clad in pale Wicklow marble, with a deep soaking tub and walk-in rain shower, all products from our in-house botanical range.",
    sizeM2:      38,
    maxAdults:   2,
    maxChildren: 1,
    maxOccupancy: 3,
    floorMin:    1,
    floorMax:    3,
    baseRateWeekday: 380,
    baseRateWeekend: 450,
    heroImage:   "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=85",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=85",
    ],
    features:    ["King Bed", "Garden View", "Marble Bathroom", "Stone Fireplace", "Soaking Tub", "Rain Shower"],
    amenities: [
      { category: "ROOM",      name: "King Bed",            icon: "bed-double" },
      { category: "ROOM",      name: "Stone Fireplace",     icon: "flame" },
      { category: "ROOM",      name: "Writing Desk",        icon: "pen-line" },
      { category: "BATHROOM",  name: "Soaking Tub",         icon: "bath" },
      { category: "BATHROOM",  name: "Rain Shower",         icon: "shower-head" },
      { category: "BATHROOM",  name: "Wicklow Marble",      icon: "gem" },
      { category: "TECHNOLOGY",name: "65″ 4K TV",           icon: "tv" },
      { category: "TECHNOLOGY",name: "High-Speed WiFi",     icon: "wifi" },
      { category: "DINING",    name: "Nespresso Machine",   icon: "coffee" },
      { category: "SERVICE",   name: "Daily Housekeeping",  icon: "sparkles" },
      { category: "SERVICE",   name: "24h Room Service",    icon: "concierge-bell" },
    ],
    featured:    false,
    sortOrder:   1,
  },
  {
    id:          "cat-superior",
    slug:        "superior-room",
    tier:        "SUPERIOR",
    tierLabel:   "Superior Room",
    name:        "Estate Room",
    tagline:     "Where the parkland meets your window",
    shortDesc:   "Elevated position with estate parkland panoramas, king or twin beds, and a freestanding copper bath.",
    description: "Positioned on the upper floors with commanding views across our parkland, Estate Rooms offer more space, more light, and more of Markland's quiet drama. The room's palette draws from the landscape — warm stone, soft sage, aged timber — and the bathrooms feature our signature freestanding copper tub, sourced from a traditional Irish workshop. A generous lounge chair and writing desk complete the picture.",
    sizeM2:      46,
    maxAdults:   2,
    maxChildren: 1,
    maxOccupancy: 3,
    floorMin:    2,
    floorMax:    4,
    baseRateWeekday: 480,
    baseRateWeekend: 560,
    heroImage:   "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=85",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=85",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&q=85",
    ],
    features:    ["King or Twin", "Parkland View", "Copper Soaking Tub", "Lounge Chair", "Rain Shower"],
    amenities: [
      { category: "ROOM",       name: "King or Twin Bed",   icon: "bed-double" },
      { category: "ROOM",       name: "Parkland View",      icon: "trees" },
      { category: "ROOM",       name: "Lounge Chair",       icon: "armchair" },
      { category: "BATHROOM",   name: "Copper Soaking Tub", icon: "bath" },
      { category: "BATHROOM",   name: "Double Vanity",      icon: "sink" },
      { category: "BATHROOM",   name: "Rain Shower",        icon: "shower-head" },
      { category: "TECHNOLOGY", name: "65″ 4K TV",          icon: "tv" },
      { category: "TECHNOLOGY", name: "High-Speed WiFi",    icon: "wifi" },
      { category: "DINING",     name: "Nespresso Machine",  icon: "coffee" },
      { category: "DINING",     name: "Mini Bar",           icon: "wine" },
      { category: "SERVICE",    name: "Turn-Down Service",  icon: "moon" },
      { category: "SERVICE",    name: "24h Room Service",   icon: "concierge-bell" },
    ],
    featured:    false,
    sortOrder:   2,
  },
  {
    id:          "cat-junior-suite",
    slug:        "junior-suite",
    tier:        "JUNIOR_SUITE",
    tierLabel:   "Junior Suite",
    name:        "Wicklow Suite",
    tagline:     "The valley, framed",
    shortDesc:   "Separate sitting room, private terrace, rainfall shower, and panoramic valley views across 300 acres.",
    description: "The Wicklow Suites are Markland's most-requested accommodations — a generous bedroom and separate sitting room arranged to make the most of their elevated valley position. The private terrace, furnished with deep outdoor chairs, is the place guests return to again and again — morning coffee, evening cocktails, or simply watching the light change over the Wicklow Mountains. Bathrooms feature double vanities, a large walk-in shower with rainfall head, and Aesop amenities.",
    sizeM2:      55,
    maxAdults:   2,
    maxChildren: 2,
    maxOccupancy: 4,
    floorMin:    3,
    floorMax:    5,
    baseRateWeekday: 620,
    baseRateWeekend: 740,
    heroImage:   "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=85",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=85",
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=1200&q=85",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&q=85",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=85",
    ],
    features:    ["King Bed", "Private Terrace", "Separate Sitting Room", "Rain Shower", "Valley Views"],
    amenities: [
      { category: "ROOM",       name: "King Bed",            icon: "bed-double" },
      { category: "ROOM",       name: "Private Terrace",     icon: "door-open" },
      { category: "ROOM",       name: "Separate Sitting Room", icon: "sofa" },
      { category: "ROOM",       name: "Valley Views",        icon: "mountain" },
      { category: "BATHROOM",   name: "Rain Shower",         icon: "shower-head" },
      { category: "BATHROOM",   name: "Double Vanity",       icon: "sink" },
      { category: "BATHROOM",   name: "Aesop Amenities",     icon: "leaf" },
      { category: "TECHNOLOGY", name: "75″ 4K TV",           icon: "tv" },
      { category: "TECHNOLOGY", name: "Sonos Sound System",  icon: "music" },
      { category: "DINING",     name: "Nespresso & Bar",     icon: "coffee" },
      { category: "SERVICE",    name: "Butler on Request",   icon: "user-check" },
      { category: "SERVICE",    name: "Turn-Down Service",   icon: "moon" },
      { category: "WELLNESS",   name: "Spa Access Included", icon: "dumbbell" },
    ],
    featured:    true,
    sortOrder:   3,
  },
  {
    id:          "cat-suite",
    slug:        "classic-suite",
    tier:        "SUITE",
    tierLabel:   "Suite",
    name:        "Classic Suite",
    tagline:     "Space for living, not just sleeping",
    shortDesc:   "Full suite with separate bedroom and drawing room, butler pantry, and panoramic countryside views.",
    description: "Our Classic Suites occupy corner positions on the upper floors, capturing diagonal views of both the formal gardens and the wider countryside. A generous drawing room with an original fireplace leads through to the bedroom and bathroom — all decorated with antique Irish furniture and commissioned artworks. The butler pantry is stocked daily. Evening turndown includes a personalised note from your housekeeper.",
    sizeM2:      72,
    maxAdults:   2,
    maxChildren: 2,
    maxOccupancy: 4,
    floorMin:    4,
    floorMax:    6,
    baseRateWeekday: 890,
    baseRateWeekend: 1050,
    heroImage:   "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1600&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=85",
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=1200&q=85",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=85",
    ],
    features:    ["King Bed", "Drawing Room", "Corner Position", "Butler Pantry", "Panoramic Views"],
    amenities: [
      { category: "ROOM",       name: "King Bed",             icon: "bed-double" },
      { category: "ROOM",       name: "Drawing Room",         icon: "sofa" },
      { category: "ROOM",       name: "Butler Pantry",        icon: "utensils" },
      { category: "ROOM",       name: "Panoramic Views",      icon: "panorama" },
      { category: "BATHROOM",   name: "Copper Soaking Tub",   icon: "bath" },
      { category: "BATHROOM",   name: "Double Rain Shower",   icon: "shower-head" },
      { category: "BATHROOM",   name: "Heated Marble Floors", icon: "thermometer" },
      { category: "TECHNOLOGY", name: "75″ 4K TV ×2",         icon: "tv" },
      { category: "TECHNOLOGY", name: "Sonos Multi-Room",     icon: "music" },
      { category: "DINING",     name: "In-Room Dining Table", icon: "utensils" },
      { category: "SERVICE",    name: "Dedicated Butler",     icon: "user-check" },
      { category: "SERVICE",    name: "Pre-Arrival Curation", icon: "package" },
      { category: "WELLNESS",   name: "Daily Spa Access",     icon: "dumbbell" },
    ],
    featured:    false,
    sortOrder:   4,
  },
  {
    id:          "cat-grand-suite",
    slug:        "grand-suite",
    tier:        "GRAND_SUITE",
    tierLabel:   "Grand Suite",
    name:        "Markland Grand",
    tagline:     "Palatial. Quiet. Yours.",
    shortDesc:   "Hand-painted ceiling murals, copper soaking tub, private dining room, and personal butler service.",
    description: "The Markland Grand is our most storied suite — a space built around contemplation and ceremony in equal measure. Ceiling murals painted by Irish artist Ciara O'Sullivan depict the four seasons of the estate in extraordinary detail. The main bathroom centres on a copper soaking tub imported from a workshop in Westmeath, surrounded by Irish limestone and lit by a single antique chandelier. A private dining room seats eight, and your dedicated butler begins preparing for your arrival 48 hours before check-in.",
    sizeM2:      95,
    maxAdults:   4,
    maxChildren: 2,
    maxOccupancy: 6,
    floorMin:    5,
    floorMax:    7,
    baseRateWeekday: 1200,
    baseRateWeekend: 1500,
    heroImage:   "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?w=1600&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?w=1200&q=85",
      "https://images.unsplash.com/photo-1561501878-aabd62634533?w=1200&q=85",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=85",
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=1200&q=85",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=85",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=85",
    ],
    features:    ["Master Bedroom", "Private Dining", "Copper Soaking Tub", "Painted Ceilings", "Butler Service"],
    amenities: [
      { category: "ROOM",       name: "Master Bedroom",        icon: "bed-double" },
      { category: "ROOM",       name: "Private Dining Room",   icon: "utensils" },
      { category: "ROOM",       name: "Hand-Painted Ceilings", icon: "paintbrush" },
      { category: "ROOM",       name: "Antique Furnishings",   icon: "crown" },
      { category: "BATHROOM",   name: "Copper Soaking Tub",    icon: "bath" },
      { category: "BATHROOM",   name: "Limestone Wet Room",    icon: "droplets" },
      { category: "BATHROOM",   name: "Dressing Room",         icon: "shirt" },
      { category: "TECHNOLOGY", name: "Crestron Smart Room",   icon: "sliders" },
      { category: "TECHNOLOGY", name: "85″ 8K Display",        icon: "tv" },
      { category: "DINING",     name: "Private Bar",           icon: "wine" },
      { category: "DINING",     name: "Chef on Request",       icon: "chef-hat" },
      { category: "SERVICE",    name: "Personal Butler",       icon: "user-check" },
      { category: "SERVICE",    name: "Limousine Transfer",    icon: "car" },
      { category: "WELLNESS",   name: "Private Spa Sessions",  icon: "dumbbell" },
    ],
    featured:    true,
    sortOrder:   5,
  },
  {
    id:          "cat-presidential",
    slug:        "presidential-suite",
    tier:        "PRESIDENTIAL",
    tierLabel:   "Presidential Suite",
    name:        "The Penthouse",
    tagline:     "Summit of the estate",
    shortDesc:   "A full-floor residence with wraparound terrace, chef's kitchen, private spa room, and bespoke arrival ceremony.",
    description: "The Penthouse is not a hotel room. It is a private residence that happens to share an address with one of Europe's great luxury hotels. The entire top floor — 180 square metres — is yours alone. A wraparound terrace of 60 square metres encircles the floor, offering uninterrupted views of the estate, the mountains, and, on clear days, the Irish Sea. The chef's kitchen is fully equipped and staffed on request. The private spa treatment room hosts two therapists simultaneously. Your arrival ceremony begins three days before you check in.",
    sizeM2:      180,
    maxAdults:   6,
    maxChildren: 4,
    maxOccupancy: 10,
    floorMin:    8,
    floorMax:    8,
    baseRateWeekday: 3800,
    baseRateWeekend: 4500,
    heroImage:   "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=90",
    galleryImages: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=85",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=85",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=85",
      "https://images.unsplash.com/photo-1561501878-aabd62634533?w=1200&q=85",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85",
    ],
    features:    ["Full Floor", "Wraparound Terrace", "Chef's Kitchen", "Private Spa Room", "Arrival Ceremony"],
    amenities: [
      { category: "ROOM",       name: "Full-Floor Residence",   icon: "building" },
      { category: "ROOM",       name: "60m² Terrace",           icon: "door-open" },
      { category: "ROOM",       name: "Chef's Kitchen",         icon: "chef-hat" },
      { category: "ROOM",       name: "Private Cinema Room",    icon: "tv" },
      { category: "BATHROOM",   name: "Private Spa Treatment",  icon: "sparkles" },
      { category: "BATHROOM",   name: "Hammam",                 icon: "droplets" },
      { category: "BATHROOM",   name: "Chromotherapy Shower",   icon: "zap" },
      { category: "TECHNOLOGY", name: "Crestron Full Automation",icon: "sliders" },
      { category: "TECHNOLOGY", name: "98″ Display",            icon: "tv" },
      { category: "DINING",     name: "Private Sommelier",      icon: "wine" },
      { category: "DINING",     name: "In-Residence Chef",      icon: "utensils" },
      { category: "SERVICE",    name: "Estate Manager",         icon: "key" },
      { category: "SERVICE",    name: "Helicopter Transfer",    icon: "plane" },
      { category: "WELLNESS",   name: "Daily Private Yoga",     icon: "activity" },
    ],
    featured:    true,
    sortOrder:   6,
  },
];

export function getRoomBySlug(slug: string): RoomData | undefined {
  return ROOM_CATALOG.find((r) => r.slug === slug);
}

export function getFeaturedRooms(): RoomData[] {
  return ROOM_CATALOG.filter((r) => r.featured);
}

export const TIER_ORDER = ["DELUXE", "SUPERIOR", "JUNIOR_SUITE", "SUITE", "GRAND_SUITE", "PRESIDENTIAL"];

export function sortByTier(rooms: RoomData[]): RoomData[] {
  return [...rooms].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
}

// src/types/index.ts
// Markland Hotel & Spa — Shared Type Definitions

export type {
  User,
  Booking,
  BookingItem,
  BookingAddon,
  Room,
  RoomCategory,
  Amenity,
  Service,
  Review,
  Payment,
  RatePeriod,
  MaintenanceLog,
} from "@prisma/client";

export {
  UserRole,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  RoomStatus,
  RoomTier,
  AmenityCategory,
  ServiceCategory,
  NotificationType,
} from "@prisma/client";

// ─── API Response Types ───────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Room Types ───────────────────────────────────────────────────────

export interface RoomCategoryWithAmenities {
  id: string;
  slug: string;
  name: string;
  tier: string;
  description: string;
  shortDesc: string | null;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  sizeM2: number | null;
  floorMin: number | null;
  floorMax: number | null;
  baseRateWeekday: number;
  baseRateWeekend: number;
  heroImage: string | null;
  galleryImages: string[];
  featured: boolean;
  amenities: {
    amenity: {
      id: string;
      name: string;
      icon: string | null;
      category: string;
    };
    highlight: boolean;
  }[];
  _count: { rooms: number };
}

export interface RoomAvailabilityResult {
  categoryId: string;
  categoryName: string;
  tier: string;
  available: boolean;
  availableCount: number;
  ratePerNight: number;
  totalRate: number;
  nights: number;
}

// ─── Booking Types ────────────────────────────────────────────────────

export interface BookingSearchParams {
  checkIn: string;   // ISO date
  checkOut: string;  // ISO date
  adults: number;
  children?: number;
  rooms?: number;
}

export interface CreateBookingInput {
  categoryId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  arrivalTime?: string;
  addonIds?: { serviceId: string; quantity: number }[];
  userId?: string;
}

export interface BookingWithDetails {
  id: string;
  reference: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  adults: number;
  children: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string | null;
  specialRequests: string | null;
  arrivalTime: string | null;
  createdAt: Date;
  items: {
    id: string;
    ratePerNight: number;
    totalRate: number;
    category: { name: string; tier: string; heroImage: string | null };
    room: { number: string; floor: number } | null;
  }[];
  payments: {
    id: string;
    status: string;
    amount: number;
    method: string;
    capturedAt: Date | null;
  }[];
  addons: {
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
    service: { name: string; category: string };
  }[];
}

// ─── Auth Types ───────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string;
  avatar: string | null;
  loyaltyPoints: number;
  loyaltyTier: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// ─── UI / Component Types ─────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  nationality: string;
  rating: number;
  text: string;
  stayType: string;
  avatar?: string;
}

export interface AwardBadge {
  id: string;
  name: string;
  year: number;
  logoUrl?: string;
}

// ─── Admin Types ──────────────────────────────────────────────────────

export interface DashboardStats {
  totalBookings: number;
  confirmedToday: number;
  checkInsToday: number;
  checkOutsToday: number;
  occupancyRate: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  averageDailyRate: number;
  revPAR: number; // Revenue per available room
  pendingReviews: number;
}

export interface OccupancyData {
  date: string;
  occupied: number;
  available: number;
  rate: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

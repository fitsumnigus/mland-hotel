// src/lib/utils/index.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, addDays, isWeekend } from "date-fns";

// ─── Tailwind Helper ──────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency Formatters ──────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency = "EUR",
  locale = "en-IE"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyPrecise(
  amount: number,
  currency = "EUR",
  locale = "en-IE"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Date Helpers ─────────────────────────────────────────────────────

export function formatDate(date: Date | string, fmt = "d MMM yyyy"): string {
  return format(new Date(date), fmt);
}

export function formatDateRange(checkIn: Date | string, checkOut: Date | string): string {
  const inDate  = new Date(checkIn);
  const outDate = new Date(checkOut);
  const sameMonth = inDate.getMonth() === outDate.getMonth() &&
                    inDate.getFullYear() === outDate.getFullYear();

  if (sameMonth) {
    return `${format(inDate, "d")}–${format(outDate, "d MMM yyyy")}`;
  }
  return `${format(inDate, "d MMM")} – ${format(outDate, "d MMM yyyy")}`;
}

export function countNights(checkIn: Date | string, checkOut: Date | string): number {
  return differenceInDays(new Date(checkOut), new Date(checkIn));
}

export function getDateRange(startDate: Date, nights: number): Date[] {
  return Array.from({ length: nights }, (_, i) => addDays(startDate, i));
}

export function isoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseIsoDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ─── Pricing Calculations ─────────────────────────────────────────────

export function calculateNightlyRates(
  checkIn: Date,
  checkOut: Date,
  weekdayRate: number,
  weekendRate: number
): { nightly: number[]; total: number } {
  const nights = countNights(checkIn, checkOut);
  const nightly = Array.from({ length: nights }, (_, i) => {
    const night = addDays(checkIn, i);
    return isWeekend(night) ? weekendRate : weekdayRate;
  });
  return { nightly, total: nightly.reduce((a, b) => a + b, 0) };
}

export function calculateTax(subtotal: number, taxRate = 0.13): number {
  return parseFloat((subtotal * taxRate).toFixed(2));
}

export function generateBookingReference(id: string): string {
  const year  = new Date().getFullYear();
  const short = id.slice(-6).toUpperCase();
  return `MH-${year}-${short}`;
}

// ─── String Helpers ───────────────────────────────────────────────────

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? singular + "s");
}

// ─── Array / Object Helpers ───────────────────────────────────────────

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = String(item[key]);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(arr: T[], key: keyof T, dir: "asc" | "desc" = "asc"): T[] {
  return [...arr].sort((a, b) => {
    const av = a[key], bv = b[key];
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Validation Helpers ───────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-().]{7,20}$/.test(phone);
}

// ─── API Helpers ──────────────────────────────────────────────────────

export function buildSearchParams(params: Record<string, unknown>): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      sp.set(key, String(value));
    }
  }
  return sp;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

// ─── Image Helpers ────────────────────────────────────────────────────

export function getRoomImageUrl(
  imagePath: string | null,
  fallback = "/images/room-placeholder.jpg"
): string {
  if (!imagePath) return fallback;
  if (imagePath.startsWith("http")) return imagePath;
  return `/images/${imagePath}`;
}

export function shimmerDataUrl(w: number, h: number): string {
  const shimmer = `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#2e2825" offset="20%" />
          <stop stop-color="#4e4440" offset="50%" />
          <stop stop-color="#2e2825" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#2e2825" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
    </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(shimmer).toString("base64")}`;
}

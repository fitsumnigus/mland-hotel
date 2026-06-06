// src/hooks/useAvailability.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { format, differenceInDays } from "date-fns";

export interface AvailabilityResult {
  categoryId:     string;
  categoryName:   string;
  tier:           string;
  available:      boolean;
  availableCount: number;
  ratePerNight:   number;
  totalRate:      number;
  nights:         number;
}

interface UseAvailabilityParams {
  checkIn:  string | null;
  checkOut: string | null;
  adults:   number;
  children: number;
  enabled?: boolean;
}

interface UseAvailabilityReturn {
  results:     AvailabilityResult[];
  isLoading:   boolean;
  error:       string | null;
  nights:      number;
  refetch:     () => void;
}

export function useAvailability({
  checkIn,
  checkOut,
  adults,
  children,
  enabled = true,
}: UseAvailabilityParams): UseAvailabilityReturn {
  const [results,   setResults]   = useState<AvailabilityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const abortRef                  = useRef<AbortController | null>(null);
  const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nights =
    checkIn && checkOut
      ? Math.max(0, differenceInDays(new Date(checkOut + "T12:00"), new Date(checkIn + "T12:00")))
      : 0;

  const fetchAvailability = useCallback(async () => {
    if (!checkIn || !checkOut || !enabled || nights < 1) return;

    // Cancel in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        adults:   String(adults),
        children: String(children),
      });

      const res = await fetch(`/api/rooms/availability?${params}`, {
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        // Server error — set error but don't crash; UI will show fallback rates
        setError("Live availability unavailable — showing estimated rates.");
        setResults([]);
        return;
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setResults(data.data);
      } else {
        setError(data.error ?? "Availability check failed");
        setResults([]);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      // Network failure — silent; UI shows static rates as fallback
      setError("Live availability unavailable — showing estimated rates.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [checkIn, checkOut, adults, children, enabled, nights]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchAvailability, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchAvailability]);

  return { results, isLoading, error, nights, refetch: fetchAvailability };
}

// ─── Single room availability check ──────────────────────────────────

interface UseRoomAvailabilityParams {
  categoryId: string;
  checkIn:    string | null;
  checkOut:   string | null;
  enabled?:   boolean;
}

export function useRoomAvailability({
  categoryId,
  checkIn,
  checkOut,
  enabled = true,
}: UseRoomAvailabilityParams) {
  const { results, isLoading, error, nights } = useAvailability({
    checkIn,
    checkOut,
    adults:   1,
    children: 0,
    enabled,
  });

  const roomResult = results.find((r) => r.categoryId === categoryId);

  return {
    isAvailable:    roomResult?.available ?? false,
    availableCount: roomResult?.availableCount ?? 0,
    ratePerNight:   roomResult?.ratePerNight ?? 0,
    totalRate:      roomResult?.totalRate ?? 0,
    nights,
    isLoading,
    error,
  };
}

// ─── Blocked dates helper (mock + Prisma-ready) ───────────────────────

export interface BlockedDateRange {
  start: Date;
  end:   Date;
}

export function useBlockedDates(categoryId: string): {
  blockedRanges: BlockedDateRange[];
  isDateBlocked: (date: Date) => boolean;
} {
  // In production: fetch from /api/rooms/[slug]/blocked-dates
  // For now returns empty — real data comes from Prisma booking conflicts
  const blockedRanges: BlockedDateRange[] = [];

  const isDateBlocked = useCallback(
    (date: Date) =>
      blockedRanges.some((range) => date >= range.start && date <= range.end),
    [blockedRanges]
  );

  return { blockedRanges, isDateBlocked };
}

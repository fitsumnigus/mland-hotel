// src/store/booking.store.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { BookingSearchParams, CreateBookingInput, RoomAvailabilityResult } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────

type BookingStep = "search" | "select" | "details" | "review" | "payment" | "confirmation";

interface BookingState {
  // Search parameters
  searchParams: BookingSearchParams | null;

  // Current booking flow
  step: BookingStep;
  selectedCategoryId: string | null;
  availableRooms: RoomAvailabilityResult[];
  bookingInput: Partial<CreateBookingInput>;

  // Completed booking
  confirmedBookingId: string | null;
  confirmedReference: string | null;

  // UI state
  isSearching: boolean;
  isBooking: boolean;
  error: string | null;
}

interface BookingActions {
  setSearchParams: (params: BookingSearchParams) => void;
  setAvailableRooms: (rooms: RoomAvailabilityResult[]) => void;
  selectCategory: (categoryId: string) => void;
  setBookingInput: (input: Partial<CreateBookingInput>) => void;
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setConfirmed: (bookingId: string, reference: string) => void;
  setIsSearching: (v: boolean) => void;
  setIsBooking: (v: boolean) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

// ─── Step Order ───────────────────────────────────────────────────────

const STEP_ORDER: BookingStep[] = [
  "search",
  "select",
  "details",
  "review",
  "payment",
  "confirmation",
];

// ─── Initial State ────────────────────────────────────────────────────

const initialState: BookingState = {
  searchParams: null,
  step: "search",
  selectedCategoryId: null,
  availableRooms: [],
  bookingInput: {},
  confirmedBookingId: null,
  confirmedReference: null,
  isSearching: false,
  isBooking: false,
  error: null,
};

// ─── Store ────────────────────────────────────────────────────────────

export const useBookingStore = create<BookingState & BookingActions>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setSearchParams: (params) =>
          set((state) => {
            state.searchParams = params;
            state.step = "select";
          }),

        setAvailableRooms: (rooms) =>
          set((state) => {
            state.availableRooms = rooms;
          }),

        selectCategory: (categoryId) =>
          set((state) => {
            state.selectedCategoryId = categoryId;
            state.step = "details";
          }),

        setBookingInput: (input) =>
          set((state) => {
            state.bookingInput = { ...state.bookingInput, ...input };
          }),

        setStep: (step) =>
          set((state) => {
            state.step = step;
          }),

        nextStep: () =>
          set((state) => {
            const idx = STEP_ORDER.indexOf(state.step);
            if (idx < STEP_ORDER.length - 1) {
              state.step = STEP_ORDER[idx + 1];
            }
          }),

        prevStep: () =>
          set((state) => {
            const idx = STEP_ORDER.indexOf(state.step);
            if (idx > 0) {
              state.step = STEP_ORDER[idx - 1];
            }
          }),

        setConfirmed: (bookingId, reference) =>
          set((state) => {
            state.confirmedBookingId = bookingId;
            state.confirmedReference = reference;
            state.step = "confirmation";
          }),

        setIsSearching: (v) =>
          set((state) => {
            state.isSearching = v;
          }),

        setIsBooking: (v) =>
          set((state) => {
            state.isBooking = v;
          }),

        setError: (err) =>
          set((state) => {
            state.error = err;
          }),

        reset: () => set(() => ({ ...initialState })),
      })),
      {
        name: "markland-booking",
        // Only persist search params and step — not sensitive data
        partialize: (state) => ({
          searchParams: state.searchParams,
          selectedCategoryId: state.selectedCategoryId,
          step: state.step === "confirmation" ? "search" : state.step,
        }),
      }
    ),
    { name: "BookingStore" }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────

export const useSearchParams = () =>
  useBookingStore((s) => s.searchParams);

export const useBookingStep = () =>
  useBookingStore((s) => s.step);

export const useSelectedCategory = () =>
  useBookingStore((s) => s.selectedCategoryId);

export const useAvailableRooms = () =>
  useBookingStore((s) => s.availableRooms);

export const useBookingError = () =>
  useBookingStore((s) => s.error);

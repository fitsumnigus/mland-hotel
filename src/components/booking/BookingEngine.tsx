"use client";

// src/components/booking/BookingEngine.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { format, addDays } from "date-fns";
import { ROOM_CATALOG, getRoomBySlug } from "@/lib/data/rooms.data";
import { BookingStepSearch }       from "@/components/booking/BookingStepSearch";
import { BookingStepSelect }       from "@/components/booking/BookingStepSelect";
import { BookingStepGuest }        from "@/components/booking/BookingStepGuest";
import { BookingStepReview }       from "@/components/booking/BookingStepReview";
import { BookingStepConfirmation } from "@/components/booking/BookingStepConfirmation";
import { BookingProgressBar }      from "@/components/booking/BookingProgressBar";
import { BookingSummaryPanel }     from "@/components/booking/BookingSummaryPanel";
import type { RoomData } from "@/lib/data/rooms.data";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export type BookingStep = "search" | "select" | "guest" | "review" | "confirmation";

export interface BookingState {
  checkIn:    string;
  checkOut:   string;
  adults:     number;
  children:   number;
  selectedRoom: RoomData | null;
  guest: {
    firstName:      string;
    lastName:       string;
    email:          string;
    phone:          string;
    specialRequests: string;
    arrivalTime:    string;
  };
  confirmedId:        string | null;
  confirmedReference: string | null;
}

const STEPS: BookingStep[] = ["search", "select", "guest", "review", "confirmation"];

const STEP_LABELS: Record<BookingStep, string> = {
  search:       "Dates",
  select:       "Choose Room",
  guest:        "Your Details",
  review:       "Review",
  confirmation: "Confirmed",
};

interface Props {
  initialCheckIn:  string;
  initialCheckOut: string;
  initialAdults:   number;
  initialChildren: number;
  initialRoomId:   string | null;
  initialSlug:     string | null;
}

export function BookingEngine({
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
  initialRoomId,
  initialSlug,
}: Props) {
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const dayAfter  = format(addDays(new Date(), 3), "yyyy-MM-dd");

  const [step, setStep] = useState<BookingStep>("search");
  const [dir,  setDir]  = useState<1 | -1>(1);

  const preselected = initialSlug ? getRoomBySlug(initialSlug) ?? null
    : initialRoomId ? ROOM_CATALOG.find((r) => r.id === initialRoomId) ?? null
    : null;

  const [state, setState] = useState<BookingState>({
    checkIn:    initialCheckIn  || tomorrow,
    checkOut:   initialCheckOut || dayAfter,
    adults:     initialAdults,
    children:   initialChildren,
    selectedRoom: preselected,
    guest: {
      firstName:       "",
      lastName:        "",
      email:           "",
      phone:           "",
      specialRequests: "",
      arrivalTime:     "",
    },
    confirmedId:        null,
    confirmedReference: null,
  });

  // If room was pre-selected (from room detail page), skip to guest step
  useEffect(() => {
    if (preselected && initialCheckIn && initialCheckOut) {
      setStep("guest");
    } else if (preselected) {
      setStep("select");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (nextStep: BookingStep) => {
    const currentIdx = STEPS.indexOf(step);
    const nextIdx    = STEPS.indexOf(nextStep);
    setDir(nextIdx > currentIdx ? 1 : -1);
    setStep(nextStep);
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) goTo(STEPS[idx - 1]);
  };

  const update = (patch: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const isConfirmation = step === "confirmation";

  const slideVariants = {
    enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -32 : 32, transition: { duration: 0.3, ease: EASE } }),
  };

  return (
    <div className="min-h-screen bg-obsidian-950">
      {/* ── Page header ───────────────────────────────────────────── */}
      {!isConfirmation && (
        <div className="border-b border-obsidian-800/60">
          <div className="section-container py-6">
            <div className="flex items-center gap-4 mb-4">
              {step !== "search" && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-xs text-obsidian-400 hover:text-ivory-200 transition-colors group"
                >
                  <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                  Back
                </button>
              )}
              <div className="flex-1">
                <h1 className="font-display text-2xl text-ivory-100 font-light">Reserve Your Stay</h1>
              </div>
            </div>
            <BookingProgressBar currentStep={step} steps={STEPS} labels={STEP_LABELS} />
          </div>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className={cn("section-container", isConfirmation ? "py-16" : "py-10")}>
        {isConfirmation ? (
          <BookingStepConfirmation state={state} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
            {/* Left — active step */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {step === "search" && (
                    <BookingStepSearch
                      state={state}
                      update={update}
                      onNext={() => goTo("select")}
                    />
                  )}
                  {step === "select" && (
                    <BookingStepSelect
                      state={state}
                      update={update}
                      onNext={() => goTo("guest")}
                    />
                  )}
                  {step === "guest" && (
                    <BookingStepGuest
                      state={state}
                      update={update}
                      onNext={() => goTo("review")}
                    />
                  )}
                  {step === "review" && (
                    <BookingStepReview
                      state={state}
                      update={update}
                      onNext={() => goTo("confirmation")}
                      onBack={() => goTo("guest")}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — summary panel */}
            <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0">
              <div className="sticky top-24">
                <BookingSummaryPanel state={state} currentStep={step} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

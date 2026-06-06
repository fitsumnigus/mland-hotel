"use client";

// src/components/admin/AdminBookingsPageClient.tsx
import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function AdminBookingsPageClient() {
  return (
    <div className="p-5 lg:p-7 max-w-[1600px]">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-3 mb-1">
          <CalendarCheck size={18} className="text-champagne-600" />
          <h1 className="font-display text-2xl text-ivory-100 font-light">Bookings</h1>
        </div>
        <p className="font-body text-sm text-obsidian-500 ml-7">
          Manage all reservations, check-ins, and check-outs
        </p>
      </motion.div>

      <motion.div
        className="border border-obsidian-800 bg-obsidian-900/30"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
      >
        <AdminBookingsTable limit={25} showFilters />
      </motion.div>
    </div>
  );
}

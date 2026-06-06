"use client";

// src/components/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Users, BedDouble,
  CalendarCheck, DollarSign, BarChart3, Clock,
  CheckCircle2, AlertCircle, XCircle, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { AdminRevenueChart } from "@/components/admin/AdminRevenueChart";
import { AdminOccupancyChart } from "@/components/admin/AdminOccupancyChart";
import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface DashboardData {
  stats: {
    totalBookings:     number;
    pendingBookings:   number;
    confirmedToday:    number;
    checkInsToday:     number;
    checkOutsToday:    number;
    occupancyRate:     number;
    revenueThisMonth:  number;
    revenueLastMonth:  number;
    revenueGrowth:     number;
    averageDailyRate:  number;
    revPAR:            number;
    pendingReviews:    number;
    newGuestsThisMonth: number;
    totalRooms:        number;
    occupiedRooms:     number;
  };
  revenue:  { month: string; revenue: number; bookings: number }[];
  occupancy: { month: string; occupancy: number }[];
}

export function AdminDashboard() {
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
        else           setError(d.error ?? "Failed to load");
      })
      .catch(() => setError("Unable to connect to server"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <DashboardError error={error} />;

  const { stats } = data;

  const KPI_CARDS = [
    {
      label:    "Revenue This Month",
      value:    formatCurrency(stats.revenueThisMonth),
      sub:      `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}% vs last month`,
      icon:     <DollarSign size={16} />,
      trend:    stats.revenueGrowth >= 0 ? "up" : "down",
      color:    "text-emerald-400",
    },
    {
      label:    "Occupancy Rate",
      value:    `${stats.occupancyRate.toFixed(1)}%`,
      sub:      `${stats.occupiedRooms} of ${stats.totalRooms} rooms`,
      icon:     <BedDouble size={16} />,
      trend:    stats.occupancyRate >= 70 ? "up" : "neutral",
      color:    "text-champagne-400",
    },
    {
      label:    "Total Bookings",
      value:    String(stats.totalBookings),
      sub:      `${stats.pendingBookings} pending action`,
      icon:     <CalendarCheck size={16} />,
      trend:    "neutral",
      color:    "text-blue-400",
    },
    {
      label:    "Average Daily Rate",
      value:    formatCurrency(stats.averageDailyRate),
      sub:      `RevPAR: ${formatCurrency(stats.revPAR)}`,
      icon:     <BarChart3 size={16} />,
      trend:    "up",
      color:    "text-purple-400",
    },
  ];

  const TODAY_ITEMS = [
    { icon: <CheckCircle2 size={14} />, label: "Check-ins Today",     value: stats.checkInsToday,  color: "text-emerald-400" },
    { icon: <XCircle      size={14} />, label: "Check-outs Today",    value: stats.checkOutsToday, color: "text-amber-400"   },
    { icon: <Clock        size={14} />, label: "Confirmed Today",     value: stats.confirmedToday, color: "text-blue-400"    },
    { icon: <Users        size={14} />, label: "New Guests (Month)",  value: stats.newGuestsThisMonth, color: "text-champagne-400" },
    { icon: <AlertCircle  size={14} />, label: "Pending Reviews",     value: stats.pendingReviews, color: "text-red-400"     },
    { icon: <BedDouble    size={14} />, label: "Rooms Occupied",      value: stats.occupiedRooms,  color: "text-ivory-300"   },
  ];

  return (
    <div className="p-5 lg:p-7 space-y-6 max-w-[1600px]">
      {/* Page header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div>
          <h1 className="font-display text-2xl text-ivory-100 font-light">Dashboard</h1>
          <p className="font-body text-sm text-obsidian-500 mt-0.5">
            {new Date().toLocaleDateString("en-IE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/bookings" className="btn-luxury-outline text-xs py-2 px-4 flex items-center gap-1.5">
            <CalendarCheck size={12} /> Manage Bookings
          </Link>
          <Link href="/book" target="_blank" className="btn-luxury-primary text-xs py-2 px-4">
            New Booking
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            className="border border-obsidian-800 bg-obsidian-900/40 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className={cn("p-2 bg-obsidian-800/60", card.color)}>
                {card.icon}
              </span>
              {card.trend === "up" && <TrendingUp  size={14} className="text-emerald-500 mt-0.5" />}
              {card.trend === "down" && <TrendingDown size={14} className="text-red-500 mt-0.5" />}
            </div>
            <p className="font-display text-2xl xl:text-3xl text-ivory-100 leading-none mb-1">
              {card.value}
            </p>
            <p className="eyebrow text-2xs text-obsidian-500 mb-1">{card.label}</p>
            <p className="font-body text-xs text-obsidian-600">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Today at a glance */}
      <motion.div
        className="border border-obsidian-800 bg-obsidian-900/30"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
      >
        <div className="border-b border-obsidian-800 px-5 py-3 flex items-center justify-between">
          <p className="eyebrow text-xs text-champagne-600 tracking-widest">Today at a Glance</p>
          <Clock size={13} className="text-obsidian-600" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-obsidian-800/60">
          {TODAY_ITEMS.map((item) => (
            <div key={item.label} className="px-4 py-4 flex flex-col gap-2">
              <span className={cn(item.color)}>{item.icon}</span>
              <p className="font-display text-2xl text-ivory-100 leading-none">{item.value}</p>
              <p className="eyebrow text-2xs text-obsidian-600">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          className="xl:col-span-2 border border-obsidian-800 bg-obsidian-900/30"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
        >
          <div className="border-b border-obsidian-800 px-5 py-3">
            <p className="eyebrow text-xs text-champagne-600 tracking-widest">Revenue — Last 12 Months</p>
          </div>
          <div className="p-4">
            <AdminRevenueChart data={data.revenue} />
          </div>
        </motion.div>

        <motion.div
          className="border border-obsidian-800 bg-obsidian-900/30"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
        >
          <div className="border-b border-obsidian-800 px-5 py-3">
            <p className="eyebrow text-xs text-champagne-600 tracking-widest">Occupancy — 6 Months</p>
          </div>
          <div className="p-4">
            <AdminOccupancyChart data={data.occupancy} />
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        className="border border-obsidian-800 bg-obsidian-900/30"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45, ease: EASE }}
      >
        <div className="border-b border-obsidian-800 px-5 py-3 flex items-center justify-between">
          <p className="eyebrow text-xs text-champagne-600 tracking-widest">Recent Bookings</p>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1 text-xs text-obsidian-400 hover:text-champagne-400 transition-colors"
          >
            View all <ArrowRight size={11} />
          </Link>
        </div>
        <AdminBookingsTable limit={8} />
      </motion.div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-5 lg:p-7 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-obsidian-800 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-obsidian-800 p-5 h-28 bg-obsidian-900/40" />
        ))}
      </div>
      <div className="border border-obsidian-800 h-20 bg-obsidian-900/40" />
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 border border-obsidian-800 h-64 bg-obsidian-900/40" />
        <div className="border border-obsidian-800 h-64 bg-obsidian-900/40" />
      </div>
    </div>
  );
}

function DashboardError({ error }: { error: string | null }) {
  return (
    <div className="p-7 flex flex-col items-center justify-center min-h-[400px] text-center">
      <AlertCircle size={32} className="text-red-400 mb-4" />
      <p className="font-display text-xl text-ivory-300 mb-2">Failed to load dashboard</p>
      <p className="font-body text-sm text-obsidian-500 mb-5">{error ?? "Unknown error"}</p>
      <button onClick={() => window.location.reload()} className="btn-luxury-outline text-xs">
        Retry
      </button>
    </div>
  );
}

"use client";

// src/components/admin/AdminAnalyticsClient.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { AdminRevenueChart } from "@/components/admin/AdminRevenueChart";
import { AdminOccupancyChart } from "@/components/admin/AdminOccupancyChart";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface AnalyticsData {
  stats: {
    revenueThisMonth:  number;
    revenueLastMonth:  number;
    revenueGrowth:     number;
    occupancyRate:     number;
    averageDailyRate:  number;
    revPAR:            number;
    totalBookings:     number;
    newGuestsThisMonth: number;
  };
  revenue:   { month: string; revenue: number; bookings: number }[];
  occupancy: { month: string; occupancy: number }[];
}

export function AdminAnalyticsClient() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
        else setError(d.error ?? "Failed to load");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, []);

  const KPI_METRICS = data ? [
    { label: "Revenue This Month",  value: formatCurrency(data.stats.revenueThisMonth), sub: `${data.stats.revenueGrowth > 0 ? "+" : ""}${data.stats.revenueGrowth.toFixed(1)}% vs last month`, positive: data.stats.revenueGrowth >= 0 },
    { label: "Revenue Last Month",  value: formatCurrency(data.stats.revenueLastMonth), sub: "Previous period", positive: true },
    { label: "Occupancy Rate",      value: `${data.stats.occupancyRate.toFixed(1)}%`,   sub: "Current month",  positive: data.stats.occupancyRate >= 60 },
    { label: "Average Daily Rate",  value: formatCurrency(data.stats.averageDailyRate), sub: "Per occupied room", positive: true },
    { label: "RevPAR",              value: formatCurrency(data.stats.revPAR),            sub: "Revenue per available room", positive: true },
    { label: "Total Bookings",      value: String(data.stats.totalBookings),             sub: "All time",       positive: true },
    { label: "New Guests",          value: String(data.stats.newGuestsThisMonth),        sub: "This month",     positive: true },
  ] : [];

  return (
    <div className="p-5 lg:p-7 max-w-[1600px]">
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <BarChart3 size={18} className="text-champagne-600" />
        <div>
          <h1 className="font-display text-2xl text-ivory-100 font-light">Analytics</h1>
          <p className="font-body text-sm text-obsidian-500">Revenue, occupancy, and performance metrics</p>
        </div>
      </motion.div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-champagne-600" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 border border-red-700/40 bg-red-900/10 px-4 py-3 mb-6 text-sm text-red-300">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {data && !loading && (
        <div className="space-y-5">
          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {KPI_METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
                className="border border-obsidian-800 bg-obsidian-900/30 p-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
              >
                <p className="font-display text-xl lg:text-2xl text-ivory-100 leading-none mb-1">{metric.value}</p>
                <p className="eyebrow text-2xs text-obsidian-600 mb-1">{metric.label}</p>
                <p className={cn("text-2xs", metric.positive ? "text-emerald-500/70" : "text-red-500/70")}>
                  {metric.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Revenue chart */}
          <motion.div
            className="border border-obsidian-800 bg-obsidian-900/30"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
          >
            <div className="border-b border-obsidian-800 px-5 py-3 flex items-center justify-between">
              <p className="eyebrow text-xs text-champagne-600 tracking-widest">Monthly Revenue</p>
              <TrendingUp size={14} className={cn(data.stats.revenueGrowth >= 0 ? "text-emerald-500" : "text-red-500")} />
            </div>
            <div className="p-5">
              <AdminRevenueChart data={data.revenue} />
            </div>
          </motion.div>

          {/* Occupancy chart */}
          <motion.div
            className="border border-obsidian-800 bg-obsidian-900/30 max-w-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45, ease: EASE }}
          >
            <div className="border-b border-obsidian-800 px-5 py-3">
              <p className="eyebrow text-xs text-champagne-600 tracking-widest">Occupancy Rate</p>
            </div>
            <div className="p-5">
              <AdminOccupancyChart data={data.occupancy} />
            </div>
          </motion.div>

          {/* Revenue breakdown table */}
          <motion.div
            className="border border-obsidian-800 bg-obsidian-900/30"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
          >
            <div className="border-b border-obsidian-800 px-5 py-3">
              <p className="eyebrow text-xs text-champagne-600 tracking-widest">Monthly Breakdown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-obsidian-800">
                    {["Month", "Revenue", "Bookings", "Avg. Revenue/Booking"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left eyebrow text-2xs text-obsidian-600 tracking-widest font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...data.revenue].reverse().map((row, i) => (
                    <tr key={row.month} className={cn("border-b border-obsidian-800/40", i === 0 && "bg-champagne-900/5")}>
                      <td className="px-5 py-3 text-ivory-300">{row.month}</td>
                      <td className="px-5 py-3">
                        <span className="font-display text-lg text-ivory-100">{formatCurrency(row.revenue)}</span>
                      </td>
                      <td className="px-5 py-3 text-obsidian-400">{row.bookings}</td>
                      <td className="px-5 py-3 text-obsidian-400">
                        {row.bookings > 0 ? formatCurrency(Math.round(row.revenue / row.bookings)) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

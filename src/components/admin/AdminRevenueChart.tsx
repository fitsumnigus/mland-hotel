"use client";

// src/components/admin/AdminRevenueChart.tsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Line, ComposedChart, Area,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { month: string; revenue: number; bookings: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-obsidian-900 border border-obsidian-700 px-4 py-3 shadow-luxury">
      <p className="eyebrow text-2xs text-champagne-600 mb-2">{label}</p>
      <p className="font-display text-lg text-ivory-100">{formatCurrency(payload[0]?.value ?? 0)}</p>
      <p className="font-body text-xs text-obsidian-400 mt-1">{payload[1]?.value ?? 0} bookings</p>
    </div>
  );
}

export function AdminRevenueChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-52 flex items-center justify-center text-obsidian-600 text-sm font-body">
        No revenue data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d4a032" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#d4a032" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#4e4440", fontSize: 10, fontFamily: "var(--font-jost)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#4e4440", fontSize: 10, fontFamily: "var(--font-jost)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `€${Math.round(v / 1000)}k`}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,160,50,0.04)" }} />
        <Area
          type="monotone"
          dataKey="revenue"
          fill="url(#revenueGradient)"
          stroke="transparent"
        />
        <Bar
          dataKey="revenue"
          fill="rgba(212,160,50,0.25)"
          stroke="rgba(212,160,50,0.5)"
          strokeWidth={1}
          radius={[2, 2, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#d4a032"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#d4a032", stroke: "#2e2825", strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

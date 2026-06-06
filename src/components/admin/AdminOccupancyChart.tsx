"use client";

// src/components/admin/AdminOccupancyChart.tsx
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  data: { month: string; occupancy: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-obsidian-900 border border-obsidian-700 px-3 py-2 shadow-luxury">
      <p className="eyebrow text-2xs text-champagne-600 mb-1">{label}</p>
      <p className="font-display text-xl text-ivory-100">{payload[0]?.value?.toFixed(1)}%</p>
    </div>
  );
}

export function AdminOccupancyChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-52 flex items-center justify-center text-obsidian-600 text-sm font-body">
        No occupancy data
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#b8c4a0" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#b8c4a0" stopOpacity={0.02} />
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
            domain={[0, 100]}
            tick={{ fill: "#4e4440", fontSize: 10, fontFamily: "var(--font-jost)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(184,196,160,0.15)" }} />
          <Area
            type="monotone"
            dataKey="occupancy"
            stroke="#b8c4a0"
            strokeWidth={2}
            fill="url(#occupancyGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#b8c4a0", stroke: "#2e2825", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Current occupancy ring */}
      {data.length > 0 && (
        <div className="flex items-center gap-4 px-2">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="eyebrow text-2xs text-obsidian-600">Current</span>
              <span className="font-display text-lg text-ivory-100">
                {data[data.length - 1].occupancy.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-obsidian-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-champagne-700 to-champagne-500 transition-all duration-700"
                style={{ width: `${data[data.length - 1].occupancy}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

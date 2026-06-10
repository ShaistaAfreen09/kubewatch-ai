"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { time: "06:00", critical: 1, high: 2, medium: 4, resolved: 3 },
  { time: "08:00", critical: 2, high: 3, medium: 5, resolved: 5 },
  { time: "10:00", critical: 1, high: 4, medium: 4, resolved: 7 },
  { time: "12:00", critical: 3, high: 4, medium: 6, resolved: 8 },
  { time: "14:00", critical: 2, high: 3, medium: 5, resolved: 10 },
  { time: "16:00", critical: 1, high: 2, medium: 4, resolved: 12 },
];

export function IncidentTrendChart() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">Incident trend</p>
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Active incidents by severity</h3>
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">6h window</span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="critical" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="high" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="medium" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="resolved" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.18)" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 18,
                border: "1px solid rgba(148,163,184,0.2)",
                background: "rgba(15,23,42,0.95)",
                color: "#e2e8f0",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area type="monotone" dataKey="critical" stroke="#fb7185" fill="url(#critical)" strokeWidth={2} />
            <Area type="monotone" dataKey="high" stroke="#f59e0b" fill="url(#high)" strokeWidth={2} />
            <Area type="monotone" dataKey="medium" stroke="#38bdf8" fill="url(#medium)" strokeWidth={2} />
            <Area type="monotone" dataKey="resolved" stroke="#34d399" fill="url(#resolved)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

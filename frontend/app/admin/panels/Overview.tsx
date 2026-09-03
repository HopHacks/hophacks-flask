"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/analytics/StatCard";
import { AdminStats, getStats } from "@/app/util/adminApi";
import { CURRENT_EVENT } from "@/app/util/event";

const CARDS: [string, string][] = [
  ["applied", "Applied"],
  ["accepted", "Accepted"],
  ["waitlisted", "Waitlisted"],
  ["rsvped", "RSVP'd"],
  ["checked_in", "Checked in"],
  ["rejected", "Rejected"],
];

export default function OverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Failed to load stats."));
  }, []);

  const s = stats?.by_status ?? {};

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        HopHacks {CURRENT_EVENT} Overview
      </h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registrants"
          value={stats ? String(stats.total) : "—"}
        />
        {CARDS.map(([key, label]) => (
          <StatCard
            key={key}
            title={label}
            value={stats ? String(s[key] ?? 0) : "—"}
          />
        ))}
      </div>
    </div>
  );
}

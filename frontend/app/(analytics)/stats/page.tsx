"use client";

import { useEffect, useState } from "react";
import Panel from "@/components/analytics/Panel";
import StatCard from "@/components/analytics/StatCard";
import BarChart from "@/components/analytics/BarChart";
import { AdminStats, getStats } from "@/app/util/adminApi";
import { CURRENT_EVENT } from "@/app/util/event";

export default function StatsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Failed to load stats."));
  }, []);

  const distinct = (m?: Record<string, number>) =>
    m ? String(Object.keys(m).length) : "—";

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        HopHacks {CURRENT_EVENT} Demographics
      </h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registrants"
          value={stats ? String(stats.total) : "—"}
        />
        <StatCard title="Distinct Schools" value={distinct(stats?.by_school)} />
        <StatCard
          title="Distinct Countries"
          value={distinct(stats?.by_country)}
        />
        <StatCard
          title="Levels of Study"
          value={distinct(stats?.by_level_of_study)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Gender">
          <BarChart data={stats?.by_gender ?? {}} />
        </Panel>
        <Panel title="Level of Study">
          <BarChart data={stats?.by_level_of_study ?? {}} />
        </Panel>
        <Panel title="School (top schools)">
          <BarChart data={stats?.by_school ?? {}} topN={10} />
        </Panel>
        <Panel title="Country of Residence">
          <BarChart data={stats?.by_country ?? {}} topN={10} />
        </Panel>
        <Panel title="Race / Ethnicity">
          <BarChart data={stats?.by_race_ethnicity ?? {}} />
        </Panel>
      </div>
    </div>
  );
}

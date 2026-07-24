"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatCard from "@/components/analytics/StatCard";

type SubmissionMeta = {
  slug: string;
  projectTitle?: string;
  displayName?: string;
  tableNumber?: number;
  room?: string;
  tracks?: string[];
};

function formatDisplayName(slug: string) {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function JudgeTables() {
  const [tables, setTables] = useState<Record<string, number>>({});
  const [rooms, setRooms] = useState<Record<string, string[]>>({});
  const [bySlug, setBySlug] = useState<Record<string, SubmissionMeta>>({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [tablesRes, roomsRes, subsRes] = await Promise.all([
        axios.get("/api/judgetool/table-assignments"),
        axios.get("/api/judgetool/room-assignments"),
        axios.get("/api/judgetool/submissions").catch(() => ({ data: null })),
      ]);
      setTables(tablesRes.data ?? {});
      setRooms(roomsRes.data ?? {});
      const lookup: Record<string, SubmissionMeta> = {};
      for (const s of subsRes.data?.submissions ?? []) {
        if (s.slug) lookup[s.slug] = s;
      }
      setBySlug(lookup);
    } catch (err) {
      const ax = err as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Failed to load tables and rooms");
      setTables({});
      setRooms({});
      setBySlug({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const roomEntries = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return Object.entries(rooms)
      .map(([room, slugs]) => {
        const teams = (slugs ?? [])
          .map((slug) => {
            const meta = bySlug[slug];
            return {
              slug,
              tableNumber: tables[slug] ?? meta?.tableNumber ?? 0,
              displayName:
                meta?.projectTitle ||
                meta?.displayName ||
                formatDisplayName(slug),
              tracks: meta?.tracks ?? [],
            };
          })
          .sort((a, b) => a.tableNumber - b.tableNumber);

        if (!q) return { room, teams };

        const roomMatch = room.toLowerCase().includes(q);
        return {
          room,
          teams: roomMatch
            ? teams
            : teams.filter(
                (t) =>
                  t.displayName.toLowerCase().includes(q) ||
                  t.slug.toLowerCase().includes(q) ||
                  String(t.tableNumber).includes(q) ||
                  t.tracks.some((track) => track.toLowerCase().includes(q)),
              ),
        };
      })
      .filter(
        (r) => !q || r.teams.length > 0 || r.room.toLowerCase().includes(q),
      );
  }, [rooms, tables, bySlug, filter]);

  const teamCount = Object.keys(tables).length;
  const roomCount = Object.keys(rooms).length;

  const exportCsv = () => {
    const rows = [["Room", "Table Number", "Project", "Tracks", "Slug"]];
    for (const { room, teams } of roomEntries) {
      for (const team of teams) {
        rows.push([
          room,
          String(team.tableNumber),
          team.displayName,
          team.tracks.join("; "),
          team.slug,
        ]);
      }
    }
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tables-and-rooms.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Tables & Rooms
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Physical layout with every track each team applied to.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard title="Rooms" value={loading ? "—" : String(roomCount)} />
        <StatCard
          title="Tables / teams"
          value={loading ? "—" : String(teamCount)}
        />
        <StatCard
          title="Avg teams / room"
          value={
            loading || roomCount === 0
              ? "—"
              : String(Math.round((teamCount / roomCount) * 10) / 10)
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          className="w-72 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"
          placeholder="Search room, project, track, or table…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          type="button"
          disabled={loading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          onClick={load}
        >
          Refresh
        </button>
        <button
          type="button"
          disabled={roomEntries.length === 0}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          onClick={exportCsv}
        >
          Export CSV
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-medium">Room</th>
              <th className="px-4 py-3 text-left font-medium">
                Teams, tables, and tracks applied
              </th>
              <th className="px-4 py-3 text-right font-medium">Count</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {roomEntries.map(({ room, teams }) => (
              <tr key={room} className="border-b border-slate-100 align-top">
                <td className="px-4 py-3 font-medium">{room}</td>
                <td className="px-4 py-3">
                  <ul className="space-y-2">
                    {teams.map((team) => (
                      <li key={team.slug} className="space-y-1">
                        <div>
                          {team.tableNumber}. {team.displayName}
                        </div>
                        {team.tracks.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {team.tracks.map((track) => (
                              <span
                                key={track}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                              >
                                {track}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400">
                            No tracks in CSV
                          </div>
                        )}
                      </li>
                    ))}
                    {teams.length === 0 && (
                      <li className="text-slate-400">No teams</li>
                    )}
                  </ul>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                  {teams.length}
                </td>
              </tr>
            ))}
            {loading && roomEntries.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && roomEntries.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No room assignments yet. Generate them from the Upload tab.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

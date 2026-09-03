"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatCard from "@/components/analytics/StatCard";

type SubmissionRow = {
  slug: string;
  projectTitle: string;
  displayName: string;
  tableNumber: number;
  room: string;
  tracks: string[];
  prizes: string[];
  devpostUrl: string;
};

export default function JudgeSubmissions() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [tracks, setTracks] = useState<string[]>([]);
  const [trackColumn, setTrackColumn] = useState<string | null>(null);
  const [eventId, setEventId] = useState("");
  const [filter, setFilter] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/judgetool/submissions");
      setSubmissions(data.submissions ?? []);
      setTracks(data.tracks ?? []);
      setTrackColumn(data.csvMeta?.trackColumn ?? "Opt-In Prizes");
      setEventId(data.eventId ?? "");
    } catch (err) {
      const ax = err as {
        response?: { status?: number; data?: { error?: string } };
      };
      if (ax.response?.status === 400) {
        setSubmissions([]);
        setTracks([]);
        setError(ax.response.data?.error ?? "No submissions found.");
      } else {
        setError(ax.response?.data?.error ?? "Failed to load submissions");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const trackCounts = useMemo(() => {
    const counts: Record<string, number> = { all: submissions.length };
    for (const track of tracks) {
      counts[track] = submissions.filter((s) =>
        (s.tracks ?? []).includes(track),
      ).length;
    }
    counts["(no track)"] = submissions.filter(
      (s) => !(s.tracks ?? []).length,
    ).length;
    return counts;
  }, [submissions, tracks]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return submissions.filter((s) => {
      if (trackFilter === "(no track)") {
        if ((s.tracks ?? []).length > 0) return false;
      } else if (
        trackFilter !== "all" &&
        !(s.tracks ?? []).includes(trackFilter)
      ) {
        return false;
      }
      if (!q) return true;
      const hay = [
        s.projectTitle,
        s.displayName,
        s.slug,
        s.room,
        String(s.tableNumber),
        ...(s.tracks ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [submissions, filter, trackFilter]);

  const exportCsv = () => {
    const rows = [
      [
        "Table Number",
        "Project",
        "Room",
        "Opt-In Prizes / Tracks",
        "Devpost URL",
      ],
    ];
    for (const s of filtered) {
      rows.push([
        String(s.tableNumber),
        s.projectTitle || s.displayName,
        s.room,
        (s.tracks ?? []).join("; "),
        s.devpostUrl,
      ]);
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
    link.download = `submissions-${trackFilter === "all" ? "all" : trackFilter}-${eventId || "export"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const trackOptions = [
    "all",
    ...tracks,
    ...(trackCounts["(no track)"] > 0 ? ["(no track)"] : []),
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Submissions
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Filter by track (from CSV column{" "}
          <span className="font-mono text-xs">
            {trackColumn || "Opt-In Prizes"}
          </span>
          ) to find table and room.
          {eventId ? (
            <span className="ml-1 text-slate-400">Event: {eventId}</span>
          ) : null}
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Filter by Opt-In Prize / track
        </div>
        <div className="flex flex-wrap gap-2">
          {trackOptions.map((track) => {
            const active = trackFilter === track;
            const label = track === "all" ? "All tracks" : track;
            return (
              <button
                key={track}
                type="button"
                onClick={() => setTrackFilter(track)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  active
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                {label}
                <span
                  className={[
                    "ml-2 tabular-nums",
                    active ? "text-blue-100" : "text-slate-400",
                  ].join(" ")}
                >
                  {trackCounts[track] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
        {!loading && tracks.length === 0 && submissions.length > 0 && (
          <p className="mt-2 text-sm text-amber-700">
            No Opt-In Prizes found in the last upload. Re-generate from Upload
            with a Devpost CSV that includes that column.
          </p>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard
          title="Submissions"
          value={loading ? "—" : String(submissions.length)}
        />
        <StatCard
          title="Showing"
          value={loading ? "—" : String(filtered.length)}
        />
        <StatCard
          title="Tracks / prizes"
          value={loading ? "—" : String(tracks.length)}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          className="w-72 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"
          placeholder="Search project, room, or track…"
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
          disabled={filtered.length === 0}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          onClick={exportCsv}
        >
          Export CSV
        </button>
        {trackFilter !== "all" && (
          <button
            type="button"
            className="text-sm text-slate-500 hover:text-slate-800"
            onClick={() => setTrackFilter("all")}
          >
            Clear track filter
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-medium">Table</th>
              <th className="px-4 py-3 text-left font-medium">Project</th>
              <th className="px-4 py-3 text-left font-medium">Room</th>
              <th className="px-4 py-3 text-left font-medium">
                Opt-In Prizes (tracks applied)
              </th>
              <th className="px-4 py-3 text-right font-medium">Devpost</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {filtered.map((s) => (
              <tr key={s.slug} className="border-b border-slate-100">
                <td className="px-4 py-3 tabular-nums font-medium">
                  {s.tableNumber}
                </td>
                <td className="px-4 py-3">{s.projectTitle || s.displayName}</td>
                <td className="px-4 py-3">{s.room}</td>
                <td className="px-4 py-3">
                  {(s.tracks ?? []).length > 0 ? (
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400">
                        {(s.tracks ?? []).length} applied
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(s.tracks ?? []).map((track) => (
                          <button
                            key={track}
                            type="button"
                            onClick={() => setTrackFilter(track)}
                            className={[
                              "rounded-full border px-2 py-0.5 text-xs",
                              trackFilter === track
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300",
                            ].join(" ")}
                          >
                            {track}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={s.devpostUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
            {loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No submissions match this track. Try All tracks or clear
                  filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

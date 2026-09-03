"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

type EnrichedSubmission = {
  slug: string;
  tableNumber: number;
  room: string;
  displayName: string;
  devpostUrl: string;
  tracks?: string[];
  prizes?: string[];
  projectTitle?: string;
};

type EnrichedJudgeAssignment = {
  judgeName: string;
  submissions: EnrichedSubmission[];
};

export default function JudgeAssignments() {
  const [assignments, setAssignments] = useState<EnrichedJudgeAssignment[]>([]);
  const [eventId, setEventId] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/judgetool/assignments");
      setAssignments(data.assignments ?? []);
      setEventId(data.eventId ?? "");
    } catch (err) {
      const ax = err as {
        response?: { status?: number; data?: { error?: string } };
      };
      if (ax.response?.status === 400) {
        setAssignments([]);
        setError(ax.response.data?.error ?? "No assignments found.");
      } else {
        setError(ax.response?.data?.error ?? "Failed to load assignments");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = () => {
    const rows = [["Judge", "Table Number", "Project", "Room", "Devpost URL"]];
    for (const assignment of assignments) {
      for (const submission of assignment.submissions) {
        rows.push([
          assignment.judgeName,
          String(submission.tableNumber),
          submission.displayName,
          submission.room,
          submission.devpostUrl,
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
    link.download = `judge-assignments-${eventId || "export"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const q = filter.trim().toLowerCase();
  const filtered = q
    ? assignments.filter(
        (a) =>
          a.judgeName.toLowerCase().includes(q) ||
          a.submissions.some(
            (s) =>
              s.displayName.toLowerCase().includes(q) ||
              s.room.toLowerCase().includes(q) ||
              s.slug.toLowerCase().includes(q),
          ),
      )
    : assignments;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Assignments
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Judge queues with table number, room, and Devpost link.
          {eventId ? (
            <span className="ml-1 text-slate-400">Event: {eventId}</span>
          ) : null}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          className="w-72 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"
          placeholder="Search judge, project, or room…"
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
          disabled={assignments.length === 0}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          onClick={exportCsv}
        >
          Export CSV
        </button>
        <div className="ml-auto text-sm text-slate-500">
          {filtered.length} judge{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-medium">Judge</th>
              <th className="px-4 py-3 text-left font-medium">
                Assigned submissions
              </th>
              <th className="px-4 py-3 text-right font-medium">Count</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {filtered.map((assignment) => (
              <tr
                key={assignment.judgeName}
                className="border-b border-slate-100 align-top"
              >
                <td className="px-4 py-3 font-medium">
                  {assignment.judgeName}
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-1.5">
                    {assignment.submissions.map((submission) => (
                      <li
                        key={`${assignment.judgeName}-${submission.slug}`}
                        className="space-y-1"
                      >
                        <a
                          href={submission.devpostUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          {submission.tableNumber}.{" "}
                          {submission.projectTitle || submission.displayName} (
                          {submission.room})
                        </a>
                        {(submission.tracks ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 pl-1">
                            {(submission.tracks ?? []).map((track) => (
                              <span
                                key={track}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                              >
                                {track}
                              </span>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                  {assignment.submissions.length}
                </td>
              </tr>
            ))}
            {loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No assignments yet. Generate them from the Upload tab.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

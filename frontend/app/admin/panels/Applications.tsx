"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import StatCard from "@/components/analytics/StatCard";
import StatusBadge from "@/components/analytics/StatusBadge";
import {
  AdminUser,
  accept,
  waitlist,
  reject,
  checkIn,
  openResume,
  downloadCsv,
  getUsers,
  deriveStatus,
  field,
} from "@/app/util/adminApi";

const PAGE_SIZE = 25;

const STATUS_FILTERS = [
  ["all", "All statuses"],
  ["applied", "Applied"],
  ["accepted", "Accepted"],
  ["waitlisted", "Waitlisted"],
  ["rsvped", "RSVP'd"],
  ["checked_in", "Checked in"],
  ["rejected", "Rejected"],
  ["email_not_confirmed", "Email not confirmed"],
] as const;

export default function ApplicationsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      setUsers(await getUsers());
    } catch {
      setMessage("Failed to load registrants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const u of users) {
      const s = deriveStatus(u);
      c[s] = (c[s] ?? 0) + 1;
    }
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== "all" && deriveStatus(u) !== statusFilter)
        return false;
      if (!q) return true;
      const hay = `${field(u, "first_name")} ${field(u, "last_name")} ${
        u.username
      }`.toLowerCase();
      return hay.includes(q);
    });
  }, [users, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClamped = Math.min(page, pageCount - 1);
  const paged = filtered.slice(
    pageClamped * PAGE_SIZE,
    pageClamped * PAGE_SIZE + PAGE_SIZE,
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function run(label: string, fn: () => Promise<unknown>, ids: string[]) {
    setBusy((prev) => new Set([...prev, ...ids]));
    setMessage("");
    try {
      await fn();
      await load();
      setSelected(new Set());
      setMessage(label);
    } catch {
      setMessage("Action failed. Please try again.");
    } finally {
      setBusy((prev) => {
        const next = new Set(prev);
        ids.forEach((i) => next.delete(i));
        return next;
      });
    }
  }

  function bulk(action: "accept" | "waitlist" | "reject") {
    const ids = [...selected];
    if (ids.length === 0) return;
    const verb =
      action === "accept"
        ? "Accept"
        : action === "waitlist"
          ? "Waitlist"
          : "Reject";
    if (
      !window.confirm(
        `${verb} ${ids.length} applicant(s)? This emails all of them.`,
      )
    )
      return;
    if (action === "accept")
      run(`Accepted ${ids.length}.`, () => accept(ids), ids);
    else if (action === "waitlist")
      run(`Waitlisted ${ids.length}.`, () => waitlist(ids), ids);
    else
      run(`Rejected ${ids.length}.`, () => Promise.all(ids.map(reject)), ids);
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Registrants
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review, accept, waitlist, and check in HopHacks applicants.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Total" value={String(users.length)} />
        <StatCard title="Applied" value={String(counts.applied ?? 0)} />
        <StatCard title="Accepted" value={String(counts.accepted ?? 0)} />
        <StatCard title="Waitlisted" value={String(counts.waitlisted ?? 0)} />
        <StatCard title="RSVP'd" value={String(counts.rsvped ?? 0)} />
        <StatCard title="Checked in" value={String(counts.checked_in ?? 0)} />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          className="w-72 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"
          placeholder="Search name or email…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
        />
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
        >
          {STATUS_FILTERS.map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          onClick={() =>
            downloadCsv().catch(() => setMessage("Export failed."))
          }
        >
          Export CSV
        </button>
        <div className="ml-auto text-sm text-slate-500">{message}</div>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">
          <span>{selected.size} selected</span>
          <button
            className="rounded bg-green-600 px-3 py-1 hover:bg-green-500"
            onClick={() => bulk("accept")}
          >
            Accept
          </button>
          <button
            className="rounded bg-amber-500 px-3 py-1 hover:bg-amber-400"
            onClick={() => bulk("waitlist")}
          >
            Waitlist
          </button>
          <button
            className="rounded bg-red-600 px-3 py-1 hover:bg-red-500"
            onClick={() => bulk("reject")}
          >
            Reject
          </button>
          <button
            className="ml-2 text-slate-300 hover:text-white"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3" />
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">School</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {paged.map((u) => {
              const status = deriveStatus(u);
              const isBusy = busy.has(u.id);
              return (
                <tr key={u.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(u.id)}
                      onChange={() => toggle(u.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {field(u, "first_name")} {field(u, "last_name")}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{u.username}</td>
                  <td className="px-4 py-3">{field(u, "school") || "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5 text-xs">
                      <button
                        disabled={isBusy}
                        className="rounded bg-green-600 px-2 py-1 text-white hover:bg-green-500 disabled:opacity-50"
                        onClick={() =>
                          run("Accepted.", () => accept([u.id]), [u.id])
                        }
                      >
                        Accept
                      </button>
                      <button
                        disabled={isBusy}
                        className="rounded bg-amber-500 px-2 py-1 text-white hover:bg-amber-400 disabled:opacity-50"
                        onClick={() =>
                          run("Waitlisted.", () => waitlist([u.id]), [u.id])
                        }
                      >
                        Waitlist
                      </button>
                      <button
                        disabled={isBusy}
                        className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-500 disabled:opacity-50"
                        onClick={() => {
                          if (
                            window.confirm("Reject and email this applicant?")
                          )
                            run("Rejected.", () => reject(u.id), [u.id]);
                        }}
                      >
                        Reject
                      </button>
                      <button
                        disabled={isBusy}
                        className="rounded bg-indigo-600 px-2 py-1 text-white hover:bg-indigo-500 disabled:opacity-50"
                        onClick={() =>
                          run("Checked in.", () => checkIn(u.id), [u.id])
                        }
                      >
                        Check in
                      </button>
                      {u.resume ? (
                        <button
                          className="rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50"
                          onClick={() => openResume(u.id)}
                        >
                          Resume
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && paged.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No registrants match.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-500">
          <div>
            {filtered.length} registrant{filtered.length === 1 ? "" : "s"}
          </div>
          <div className="flex items-center gap-4">
            <button
              className="disabled:opacity-40"
              disabled={pageClamped === 0}
              onClick={() => setPage(pageClamped - 1)}
            >
              Previous
            </button>
            <span>
              {pageClamped + 1} / {pageCount}
            </span>
            <button
              className="disabled:opacity-40"
              disabled={pageClamped >= pageCount - 1}
              onClick={() => setPage(pageClamped + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

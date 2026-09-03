"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import StatCard from "@/components/analytics/StatCard";
import StatusBadge from "@/components/analytics/StatusBadge";
import {
  AdminUser,
  DecisionOutcome,
  accept,
  waitlist,
  reject,
  revert,
  resendAcceptance,
  checkIn,
  deleteUser,
  openResume,
  downloadCsv,
  downloadUnsubmittedCsv,
  getUsers,
  deriveStatus,
  acceptEmailFailed,
  formatAppliedAt,
  field,
} from "@/app/util/adminApi";
import { ESSAY_QUESTIONS } from "@/app/util/essays";

const PAGE_SIZE = 25;

const STATUS_FILTERS = [
  ["all", "All statuses"],
  ["applied", "Applied"],
  ["accepted", "Accepted"],
  ["waitlisted", "Waitlisted"],
  ["rsvped", "RSVP'd"],
  ["checked_in", "Checked in"],
  ["rejected", "Rejected"],
  ["not_submitted", "Not submitted"],
  ["email_not_sent", "Accepted · email not sent"],
  ["email_not_confirmed", "Email not confirmed"],
] as const;

/** One application response. Whitespace is preserved so paragraphs survive. */
function EssayBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      {text ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
          {text}
        </p>
      ) : (
        <p className="text-sm italic text-slate-400">No response on file.</p>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
      if (statusFilter === "email_not_sent") {
        if (!acceptEmailFailed(u)) return false;
      } else if (statusFilter !== "all" && deriveStatus(u) !== statusFilter) {
        return false;
      }
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

  async function runDecision(
    verb: string,
    fn: (ids: string[]) => Promise<DecisionOutcome>,
    ids: string[],
  ) {
    setBusy((prev) => new Set([...prev, ...ids]));
    setMessage("");
    try {
      const outcome = await fn(ids);
      await load();
      // Keep failed ids selected so one more click retries exactly those.
      setSelected(new Set(outcome.failed));
      const parts = [`${verb} ${outcome.num_changed}`];
      if (outcome.skipped.length > 0)
        parts.push(
          `skipped ${outcome.skipped.length} (already decided or RSVP'd/checked in)`,
        );
      if (outcome.failed.length > 0)
        parts.push(`failed ${outcome.failed.length}, kept selected for retry`);
      // Loud, because the decision still stands when this happens: those
      // people are accepted and do not know it.
      if (outcome.emailFailures > 0)
        parts.push(
          `⚠ ${outcome.emailFailures} email(s) did NOT send — filter to "Accepted · email not sent" and use Resend email`,
        );
      setMessage(`${parts.join(" · ")}.`);
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

  const DECISIONS = {
    accept: { verb: "Accepted", fn: accept, emails: true },
    waitlist: { verb: "Waitlisted", fn: waitlist, emails: true },
    reject: { verb: "Rejected", fn: reject, emails: true },
    revert: { verb: "Reverted", fn: revert, emails: false },
    resend: { verb: "Re-emailed", fn: resendAcceptance, emails: true },
  } as const;

  function bulk(action: keyof typeof DECISIONS) {
    const ids = [...selected];
    if (ids.length === 0) return;
    const { verb, fn, emails } = DECISIONS[action];
    const warning =
      action === "resend"
        ? "This re-sends the acceptance email. Nobody's status changes."
        : emails
          ? "This emails all of them."
          : "No emails are sent.";
    if (
      !window.confirm(
        `${verb.replace(/ed$/, "")} ${ids.length} applicant(s)? ${warning}`,
      )
    )
      return;
    runDecision(verb, fn, ids);
  }

  function rowDecision(action: keyof typeof DECISIONS, u: AdminUser) {
    const { verb, fn, emails } = DECISIONS[action];
    const name = `${field(u, "first_name")} ${field(u, "last_name")}`.trim();
    const prompt = emails
      ? `${verb.replace(/ed$/, "")} and email ${name} (${u.username})?`
      : `Revert ${name} (${u.username}) to Applied? No email is sent.`;
    if (!window.confirm(prompt)) return;
    runDecision(verb, fn, [u.id]);
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
        <StatCard
          title="Email not sent"
          value={String(users.filter(acceptEmailFailed).length)}
          subtitle="accepted, never notified"
        />
        <StatCard
          title="Profile only"
          value={String(
            (counts.not_submitted ?? 0) + (counts.email_not_confirmed ?? 0),
          )}
          subtitle="no application submitted"
        />
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
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          title="Name and contact for accounts that never submitted an application"
          onClick={() =>
            downloadUnsubmittedCsv().catch(() => setMessage("Export failed."))
          }
        >
          Export not submitted
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
            className="rounded border border-slate-500 px-3 py-1 hover:bg-slate-700"
            onClick={() => bulk("revert")}
          >
            Revert
          </button>
          <button
            className="rounded bg-sky-600 px-3 py-1 hover:bg-sky-500"
            onClick={() => bulk("resend")}
          >
            Resend email
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
              <th className="px-4 py-3 text-left font-medium">Applied</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {paged.map((u) => {
              const status = deriveStatus(u);
              const isBusy = busy.has(u.id);
              const isExpanded = expanded.has(u.id);
              return (
                <Fragment key={u.id}>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(u.id)}
                        onChange={() => toggle(u.id)}
                        disabled={!u.submitted}
                        title={
                          u.submitted
                            ? undefined
                            : "No application submitted yet"
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-left hover:underline"
                        aria-expanded={isExpanded}
                        onClick={() => toggleExpanded(u.id)}
                        title="Show application responses"
                      >
                        <span className="mr-1.5 inline-block text-slate-400">
                          {isExpanded ? "▾" : "▸"}
                        </span>
                        {field(u, "first_name")} {field(u, "last_name")}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.username}</td>
                    <td className="px-4 py-3">{field(u, "school") || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={status} />
                      {acceptEmailFailed(u) && (
                        <span
                          className="ml-1.5 inline-flex whitespace-nowrap rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
                          title="Accepted, but the acceptance email did not send. They do not know yet."
                        >
                          email not sent
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {formatAppliedAt(u) || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5 text-xs">
                        {/* There is no application to decide on until one is
                            submitted; the API would just skip these. */}
                        {u.submitted && (
                          <>
                            <button
                              disabled={isBusy}
                              className="rounded bg-green-600 px-2 py-1 text-white hover:bg-green-500 disabled:opacity-50"
                              onClick={() => rowDecision("accept", u)}
                            >
                              Accept
                            </button>
                            <button
                              disabled={isBusy}
                              className="rounded bg-amber-500 px-2 py-1 text-white hover:bg-amber-400 disabled:opacity-50"
                              onClick={() => rowDecision("waitlist", u)}
                            >
                              Waitlist
                            </button>
                            <button
                              disabled={isBusy}
                              className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-500 disabled:opacity-50"
                              onClick={() => rowDecision("reject", u)}
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
                            <button
                              disabled={isBusy}
                              className="rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                              onClick={() => rowDecision("revert", u)}
                            >
                              Revert
                            </button>
                          </>
                        )}
                        {u.resume ? (
                          <button
                            className="rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50"
                            onClick={() => openResume(u.id)}
                          >
                            Resume
                          </button>
                        ) : null}
                        <button
                          disabled={isBusy}
                          className="rounded border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Permanently delete ${u.username}? This removes the account and resume; it cannot be undone.`,
                              )
                            )
                              run("Deleted.", () => deleteUser(u.username), [
                                u.id,
                              ]);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td />
                      <td colSpan={6} className="px-4 pb-5 pt-1">
                        <div className="max-w-3xl space-y-4">
                          {!u.submitted && (
                            <p className="text-xs font-medium uppercase tracking-wide text-orange-700">
                              Draft — not submitted
                            </p>
                          )}
                          {ESSAY_QUESTIONS.map((q) => (
                            <EssayBlock
                              key={q.key}
                              label={q.shortLabel}
                              text={field(u, q.key)}
                            />
                          ))}
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                            <span>
                              Level: {field(u, "level_of_study") || "—"}
                            </span>
                            <span>Major: {field(u, "major") || "—"}</span>
                            <span>Country: {field(u, "country") || "—"}</span>
                            {field(u, "linkedin_url") ? (
                              <a
                                href={field(u, "linkedin_url")}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                LinkedIn
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!loading && paged.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No registrants match.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={7}
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

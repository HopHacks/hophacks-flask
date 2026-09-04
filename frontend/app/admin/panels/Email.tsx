"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminUser,
  BROADCAST_STAGES,
  BroadcastOutcome,
  BroadcastRecord,
  BroadcastStage,
  deriveStatus,
  getBroadcastHistory,
  getUsers,
  newBroadcastId,
  retryBroadcast,
  sendBroadcast,
  sendBroadcastTest,
} from "@/app/util/adminApi";

/** Gmail's relay stops well short of a full accepted list, so warn before a
    send that cannot finish today rather than after it half-finished. */
const GMAIL_DAILY_CAP_WARNING = 400;

type Notice = { ok: boolean; msg: string; warnings: string[] };

function stageLabel(stage: string): string {
  return BROADCAST_STAGES.find(([key]) => key === stage)?.[1] ?? stage;
}

/**
 * The lines that must not be missed. A send that failed looks exactly like a
 * send that worked from this page: nobody bounces back to say they got
 * nothing, so the count alone would read as success.
 */
function loudLines(outcome: BroadcastOutcome): string[] {
  const lines: string[] = [];
  if (outcome.failedIds.length > 0)
    lines.push(
      `⚠ ${outcome.failedIds.length} email(s) did NOT send — use "Retry failed" on the row below. If this was the Gmail daily cap, retry tomorrow.`,
    );
  if (outcome.unattempted.length > 0)
    lines.push(
      `⚠ ${outcome.unattempted.length} recipient(s) could not be attempted (request failed) and are NOT in the retry list.`,
    );
  return lines;
}

export default function Email() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<BroadcastStage>("accepted");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<BroadcastRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Promise chains rather than awaited helpers so the mount effect itself
  // never calls setState synchronously (the React Compiler flags that).
  const loadUsers = () =>
    getUsers()
      .then(setUsers)
      .catch(() =>
        setNotice({
          ok: false,
          msg: "Failed to load recipients.",
          warnings: [],
        }),
      )
      .finally(() => setLoading(false));

  const loadHistory = () =>
    getBroadcastHistory()
      .then(setHistory)
      .catch(() =>
        setNotice({
          ok: false,
          msg: "Failed to load recent sends.",
          warnings: [],
        }),
      );

  useEffect(() => {
    loadUsers();
    loadHistory();
  }, []);

  const recipients = useMemo(
    () => users.filter((u) => deriveStatus(u) === stage),
    [users, stage],
  );

  const count = recipients.length;
  const ready = subject.trim().length > 0 && message.trim().length > 0;

  async function onSend() {
    if (!ready || count === 0) return;
    let prompt = `Send "${subject}" to ${count} ${stageLabel(stage)} applicant(s)? Email cannot be unsent.`;
    if (count > GMAIL_DAILY_CAP_WARNING)
      prompt += `\n\nGmail allows roughly 500 sends per day. Recipients beyond the cap will fail and be kept for retry, so plan to finish this send tomorrow.`;
    if (!window.confirm(prompt)) return;
    setBusy(true);
    setNotice(null);
    try {
      const outcome = await sendBroadcast({
        ids: recipients.map((u) => u.id),
        subject,
        message,
        stage,
        broadcastId: newBroadcastId(),
      });
      await loadHistory();
      const parts = [`Sent ${outcome.num_sent}`];
      if (outcome.failedIds.length > 0)
        parts.push(`failed ${outcome.failedIds.length}`);
      const warnings = loudLines(outcome);
      setNotice({
        ok: warnings.length === 0,
        msg: `${parts.join(" · ")}.`,
        warnings,
      });
      // Subject and message stay put: the same text usually goes out to a
      // second stage right after (accepted, then waitlisted).
    } catch {
      setNotice({
        ok: false,
        msg: "Action failed. Please try again.",
        warnings: [],
      });
    } finally {
      setBusy(false);
    }
  }

  async function onRetry(record: BroadcastRecord) {
    if (
      !window.confirm(
        `Re-send "${record.subject}" to ${record.num_failed} recipient(s) whose email failed? Only they will be emailed.`,
      )
    )
      return;
    setBusy(true);
    setNotice(null);
    try {
      const outcome = await retryBroadcast(
        record.broadcast_id,
        record.failed_ids,
      );
      await loadHistory();
      const warnings = loudLines(outcome);
      setNotice({
        ok: warnings.length === 0,
        msg: `Retried: sent ${outcome.num_sent} · failed ${outcome.failedIds.length}.`,
        warnings,
      });
    } catch {
      setNotice({
        ok: false,
        msg: "Action failed. Please try again.",
        warnings: [],
      });
    } finally {
      setBusy(false);
    }
  }

  async function onTest() {
    if (!ready) return;
    setBusy(true);
    setNotice(null);
    try {
      const sent = await sendBroadcastTest(subject, message);
      setNotice(
        sent
          ? { ok: true, msg: "Test email sent to you.", warnings: [] }
          : {
              ok: false,
              msg: "Test email did NOT send. Check the mail configuration before sending to applicants.",
              warnings: [],
            },
      );
    } catch {
      setNotice({
        ok: false,
        msg: "Action failed. Please try again.",
        warnings: [],
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Email
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Send a plain-text email to everyone currently in one stage. Use it for
        RSVP deadlines and logistics.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="broadcast-stage"
            className="block text-sm font-medium text-slate-700"
          >
            Stage
          </label>
          <div className="mt-1 flex items-center gap-3">
            <select
              id="broadcast-stage"
              value={stage}
              // The select can only hold BROADCAST_STAGES keys.
              onChange={(e) => setStage(e.target.value as BroadcastStage)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {BROADCAST_STAGES.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <span className="text-sm text-slate-600">
              {loading
                ? "Counting recipients…"
                : `${count} recipient${count === 1 ? "" : "s"}`}
            </span>
            {/* Acceptances happen in the other tab, so the count here goes
                stale mid-session. */}
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadUsers();
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="broadcast-subject"
            className="block text-sm font-medium text-slate-700"
          >
            Subject
          </label>
          <input
            id="broadcast-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="RSVP deadline is this Friday"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900"
          />
          <p className="mt-1 text-xs text-slate-500">
            {'" - HopHacks" is appended automatically.'}
          </p>
        </div>

        <div>
          <label
            htmlFor="broadcast-message"
            className="block text-sm font-medium text-slate-700"
          >
            Message
          </label>
          <textarea
            id="broadcast-message"
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900"
          />
          <p className="mt-1 text-xs text-slate-500">
            {
              'Plain text only. Leave a blank line between paragraphs. Each email opens with "Hi <first name>," and uses the standard HopHacks header and footer.'
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTest}
            disabled={busy || !ready}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm disabled:opacity-50"
          >
            Send test to me
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={busy || !ready || count === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm disabled:opacity-50"
          >
            {busy
              ? "Sending…"
              : `Send to ${count} ${count === 1 ? "person" : "people"}`}
          </button>
        </div>
      </div>

      {notice && (
        <div className="mt-3 space-y-1">
          <p
            className={`text-sm ${notice.ok ? "text-green-700" : "text-red-600"}`}
          >
            {notice.msg}
          </p>
          {notice.warnings.map((w) => (
            <p key={w} className="text-sm font-medium text-red-600">
              {w}
            </p>
          ))}
        </div>
      )}

      <h2 className="mt-8 border-b border-slate-300 pb-2 text-sm font-semibold text-slate-800">
        Recent sends
      </h2>
      <table className="mt-3 w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-3 font-medium">Subject</th>
            <th className="py-2 pr-3 font-medium">Stage</th>
            <th className="py-2 pr-3 font-medium">Sent</th>
            <th className="py-2 pr-3 font-medium">Failed</th>
            <th className="py-2 pr-3 font-medium">When</th>
            <th className="py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {history.map((b) => (
            <tr
              key={b.broadcast_id}
              className="border-t border-slate-200 align-top"
            >
              {/* Hovering the subject is enough of a preview to tell two
                  similar sends apart. */}
              <td className="py-2 pr-3 text-slate-800" title={b.message}>
                {b.subject}
              </td>
              <td className="py-2 pr-3 text-slate-600">
                {b.stage ? stageLabel(b.stage) : ""}
              </td>
              <td className="py-2 pr-3 text-slate-600">
                {b.num_sent} / {b.num_recipients}
              </td>
              <td
                className={`py-2 pr-3 ${b.num_failed > 0 ? "text-red-600" : "text-slate-600"}`}
              >
                {b.num_failed}
              </td>
              <td className="py-2 pr-3 text-slate-600">
                {new Date(b.sent_at).toLocaleString()}
              </td>
              <td className="py-2">
                {b.num_failed > 0 && (
                  <button
                    type="button"
                    onClick={() => onRetry(b)}
                    disabled={busy}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm disabled:opacity-50"
                  >
                    {`Retry failed (${b.num_failed})`}
                  </button>
                )}
              </td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr className="border-t border-slate-200">
              <td colSpan={6} className="py-3 text-slate-500">
                No emails sent yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

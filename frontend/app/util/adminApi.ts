import axios from "axios";
import { CURRENT_EVENT } from "./event";

export type Registration = {
  event: string;
  status?: string;
  accept?: boolean;
  rsvp?: boolean;
  checkin?: boolean;
  /** False when the acceptance email failed to send. Undefined on rows
      decided before we started recording it. */
  accept_email_sent?: boolean;
};

export type AdminUser = {
  id: string;
  username: string;
  profile: Record<string, unknown>;
  email_confirmed: boolean;
  registrations: Registration[];
  resume?: string | null;
  /** When the application was submitted; null for profile-only accounts. */
  apply_at?: string | null;
  /** Whether an application was submitted at all (vs. just a profile). */
  submitted?: boolean;
};

export type AdminStats = {
  total: number;
  by_status: Record<string, number>;
  by_school: Record<string, number>;
  by_level_of_study: Record<string, number>;
  by_country: Record<string, number>;
  by_gender: Record<string, number>;
  by_race_ethnicity: Record<string, number>;
};

export async function getIsAdmin(): Promise<boolean> {
  try {
    const r = await axios.get("/api/admin/");
    return Boolean(r.data.is_admin);
  } catch {
    return false;
  }
}

export async function getUsers(query = ""): Promise<AdminUser[]> {
  const r = await axios.get("/api/admin/users", {
    params: query ? { query } : {},
  });
  return r.data.users ?? [];
}

export type DecisionOutcome = {
  num_changed: number;
  skipped: string[];
  failed: string[];
  /** Users whose status changed but whose email did not send. Surfacing this
      matters: it used to be returned by the API and silently dropped here,
      so a batch could accept everyone and email no one with no warning. */
  emailFailures: number;
};

/* One request must stay well under API Gateway's 29s cap since the backend
   sends decision emails synchronously; 20 ids per chunk is a wide margin. */
const DECISION_CHUNK = 20;

async function postDecision(
  path: string,
  ids: string[],
): Promise<DecisionOutcome> {
  const outcome: DecisionOutcome = {
    num_changed: 0,
    skipped: [],
    failed: [],
    emailFailures: 0,
  };
  for (let i = 0; i < ids.length; i += DECISION_CHUNK) {
    const chunk = ids.slice(i, i + DECISION_CHUNK);
    try {
      const r = await axios.post(path, { users: chunk, event: CURRENT_EVENT });
      outcome.num_changed += r.data.num_changed ?? 0;
      outcome.skipped.push(...(r.data.skipped ?? []));
      outcome.emailFailures += r.data.email_failures ?? 0;
    } catch {
      outcome.failed.push(...chunk);
    }
  }
  return outcome;
}

export const accept = (ids: string[]) =>
  postDecision("/api/registrations/accept", ids);
export const waitlist = (ids: string[]) =>
  postDecision("/api/registrations/waitlist", ids);
export const reject = (ids: string[]) =>
  postDecision("/api/registrations/reject", ids);
/** Reset registrations to "applied" without emailing (misclick recovery). */
export const revert = (ids: string[]) =>
  postDecision("/api/registrations/revert", ids);
/** Re-send the acceptance email to already-accepted users; no status change. */
export const resendAcceptance = (ids: string[]) =>
  postDecision("/api/registrations/resend_acceptance", ids);
export const checkIn = (id: string) =>
  axios.post("/api/registrations/check_in", { user: id, event: CURRENT_EVENT });

export async function openResume(id: string): Promise<void> {
  const r = await axios.get("/api/admin/resume", { params: { id } });
  if (r.data.url) window.open(r.data.url, "_blank");
}

export async function getStats(): Promise<AdminStats> {
  const r = await axios.get("/api/admin/stats");
  return r.data;
}

/** Permanently delete a non-admin account (test/junk registrations). */
export const deleteUser = (username: string) =>
  axios.delete("/api/admin/users", { data: { username } });

export async function getAdmins(): Promise<string[]> {
  const r = await axios.get("/api/admin/admins");
  return r.data.admins ?? [];
}

/** Promote an existing account to admin. Resolves to the server message. */
export async function promoteAdmin(username: string): Promise<string> {
  const r = await axios.post("/api/admin/admins", { username });
  return r.data.msg ?? "promoted";
}

async function downloadBlob(path: string, filename: string): Promise<void> {
  // Through axios so the Authorization header rides along; a plain <a href>
  // to the API would arrive without it.
  const r = await axios.get(path, { responseType: "blob" });
  const url = URL.createObjectURL(r.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** All current-event submissions (the review/catering export). */
export const downloadCsv = () =>
  downloadBlob("/api/admin/export", "hophacks_registrants.csv");

/** This cycle's profile-only accounts: the "nudge before the deadline" list. */
export const downloadUnsubmittedCsv = () =>
  downloadBlob("/api/admin/export_unsubmitted", "hophacks_not_submitted.csv");

/* The six real registration statuses. deriveStatus() can also return the
   pseudo-stages "email_not_confirmed" and "not_submitted"; both are
   deliberately absent here because neither is a group we email. */
export const BROADCAST_STAGES = [
  ["applied", "Applied"],
  ["accepted", "Accepted"],
  ["waitlisted", "Waitlisted"],
  ["rsvped", "RSVP'd"],
  ["checked_in", "Checked in"],
  ["rejected", "Rejected"],
] as const;

export type BroadcastStage = (typeof BROADCAST_STAGES)[number][0];

export type BroadcastRecord = {
  broadcast_id: string;
  subject: string;
  message: string;
  stage: string | null;
  sent_by: string;
  sent_at: string;
  num_recipients: number;
  num_sent: number;
  num_failed: number;
  failed_ids: string[];
};

export type BroadcastOutcome = {
  num_sent: number;
  /** Ids the server tried and could not email (Gmail cap, bad address).
      Retryable from the history row. */
  failedIds: string[];
  /** Ids whose request never got a 200 even after one re-attempt; not in the
      server's retry list. */
  unattempted: string[];
};

async function postBroadcastChunks(
  path: string,
  ids: string[],
  body: Record<string, string>,
): Promise<BroadcastOutcome> {
  const outcome: BroadcastOutcome = {
    num_sent: 0,
    failedIds: [],
    unattempted: [],
  };
  const post = async (chunk: string[]) => {
    const r = await axios.post(path, { ...body, users: chunk });
    outcome.num_sent += r.data.num_sent ?? 0;
    outcome.failedIds.push(...(r.data.failed_ids ?? []));
  };
  for (let i = 0; i < ids.length; i += DECISION_CHUNK) {
    const chunk = ids.slice(i, i + DECISION_CHUNK);
    try {
      await post(chunk);
    } catch {
      /* A thrown request does not mean nothing was emailed: API Gateway's 29s
         cap can cut a chunk that already finished sending. The server records
         sent ids against this broadcast_id and skips them, so a second attempt
         cannot double-send, and it does recover a chunk that never arrived. */
      try {
        await post(chunk);
      } catch {
        outcome.unattempted.push(...chunk);
      }
    }
  }
  return outcome;
}

/** Email everyone in one stage. All chunks share one broadcast_id so the
    server can dedupe re-attempts and keep a single audit row. */
export const sendBroadcast = (args: {
  ids: string[];
  subject: string;
  message: string;
  stage: BroadcastStage;
  broadcastId: string;
}) =>
  postBroadcastChunks("/api/admin/broadcast", args.ids, {
    subject: args.subject,
    message: args.message,
    stage: args.stage,
    broadcast_id: args.broadcastId,
  });

/** Re-send one past broadcast to the ids it failed on. */
export const retryBroadcast = (broadcastId: string, ids: string[]) =>
  postBroadcastChunks("/api/admin/broadcast/retry", ids, {
    broadcast_id: broadcastId,
  });

/** Send the draft to the calling admin only. A failed send still comes back
    200, so the caller must surface `false` as an error, not a success. */
export async function sendBroadcastTest(
  subject: string,
  message: string,
): Promise<boolean> {
  const r = await axios.post("/api/admin/broadcast/test", { subject, message });
  return r.data.num_sent === 1 && r.data.email_failures === 0;
}

export async function getBroadcastHistory(): Promise<BroadcastRecord[]> {
  const r = await axios.get("/api/admin/broadcast/history");
  return r.data.broadcasts ?? [];
}

/** Id shared by every chunk of one logical send. randomUUID exists only in
    secure contexts, and the console is served over plain http in dev. */
export function newBroadcastId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
    return crypto.randomUUID();
  return `bc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Current-event status for an applicant.
 *
 * The ladder is deliberate: an unconfirmed email outranks everything, then a
 * confirmed account with no registration is a profile whose application was
 * never submitted, and only after that does the registration's own status
 * apply.
 */
export function deriveStatus(user: AdminUser): string {
  if (!user.email_confirmed) return "email_not_confirmed";
  const reg = user.registrations?.find((r) => r.event === CURRENT_EVENT);
  if (!reg) return "not_submitted";
  return reg.status ?? "unknown";
}

/** Submission date, formatted for the table. Empty for profile-only accounts. */
export function formatAppliedAt(user: AdminUser): string {
  if (!user.apply_at) return "";
  const date = new Date(user.apply_at);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** True when we know the acceptance email did not reach this applicant. */
export function acceptEmailFailed(user: AdminUser): boolean {
  const reg = user.registrations?.find((r) => r.event === CURRENT_EVENT);
  return reg?.status === "accepted" && reg?.accept_email_sent === false;
}

/** Safe string accessor for loosely-typed profile fields. */
export function field(user: AdminUser, key: string): string {
  const v = user.profile?.[key];
  return v == null ? "" : String(v);
}

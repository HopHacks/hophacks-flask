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

export async function downloadCsv(): Promise<void> {
  const r = await axios.get("/api/admin/export", { responseType: "blob" });
  const url = URL.createObjectURL(r.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hophacks_registrants.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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

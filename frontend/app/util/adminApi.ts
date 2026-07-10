import axios from "axios";
import { CURRENT_EVENT } from "./event";

export type Registration = {
  event: string;
  status?: string;
  accept?: boolean;
  rsvp?: boolean;
  checkin?: boolean;
};

export type AdminUser = {
  id: string;
  username: string;
  profile: Record<string, unknown>;
  email_confirmed: boolean;
  registrations: Registration[];
  resume?: string | null;
  apply_at?: string | null;
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

export const accept = (ids: string[]) =>
  axios.post("/api/registrations/accept", { users: ids, event: CURRENT_EVENT });
export const waitlist = (ids: string[]) =>
  axios.post("/api/registrations/waitlist", {
    users: ids,
    event: CURRENT_EVENT,
  });
export const reject = (id: string) =>
  axios.post("/api/registrations/reject", { user: id, event: CURRENT_EVENT });
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

/** Current-event status for an applicant, with email-confirmation short-circuit. */
export function deriveStatus(user: AdminUser): string {
  if (!user.email_confirmed) return "email_not_confirmed";
  const reg = user.registrations?.find((r) => r.event === CURRENT_EVENT);
  return reg?.status ?? "unknown";
}

/** Safe string accessor for loosely-typed profile fields. */
export function field(user: AdminUser, key: string): string {
  const v = user.profile?.[key];
  return v == null ? "" : String(v);
}

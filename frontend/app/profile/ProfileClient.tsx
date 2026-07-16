"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/util/auth";
import { CURRENT_EVENT } from "@/app/util/event";

const BTN_PRIMARY =
  "px-5 py-3 text-lg font-bold rounded-2xl bg-[#ffb51f] text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] transition-shadow duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const BTN_SECONDARY =
  "btn-sketch px-5 py-3 text-lg font-bold rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

type Registration = {
  event: string;
  status: string;
  accept?: boolean;
  rsvp?: boolean;
  checkin?: boolean;
};

type Profile = {
  first_name?: string;
  last_name?: string;
  school?: string;
  level_of_study?: string;
  country?: string;
  [key: string]: unknown;
};

const TONES: Record<string, string> = {
  green: "bg-green-500/20 text-green-100 border-green-400/40",
  blue: "bg-sky-500/20 text-sky-100 border-sky-400/40",
  amber: "bg-amber-500/20 text-amber-100 border-amber-400/40",
  red: "bg-red-500/20 text-red-100 border-red-400/40",
  slate: "bg-white/10 text-white border-white/30",
};

type View = {
  badge: string;
  tone: keyof typeof TONES;
  body: string;
  action?: "confirm" | "rsvp" | "cancel";
};

function statusView(emailConfirmed: boolean, reg: Registration | null): View {
  if (!emailConfirmed) {
    return {
      badge: "Email not confirmed",
      tone: "amber",
      body: "Confirm your email to complete your application. Check your inbox, or resend the confirmation below.",
      action: "confirm",
    };
  }
  if (!reg) {
    return {
      badge: "Pending",
      tone: "slate",
      body: "We're reviewing your application.",
    };
  }
  switch (reg.status) {
    case "applied":
      return {
        badge: "Applied",
        tone: "blue",
        body: "Your application is in! We'll email you once decisions go out.",
      };
    case "waitlisted":
      return {
        badge: "Waitlisted",
        tone: "amber",
        body: "You're on the waitlist. We'll reach out if a spot opens up.",
      };
    case "accepted":
      return {
        badge: "Accepted",
        tone: "green",
        body: "Congratulations — you've been accepted! Please RSVP to confirm your spot.",
        action: "rsvp",
      };
    case "rsvped":
      return {
        badge: "RSVP'd",
        tone: "green",
        body: "You're all set — we can't wait to see you at HopHacks!",
        action: "cancel",
      };
    case "checked_in":
      return {
        badge: "Checked in",
        tone: "green",
        body: "You're checked in. Enjoy the hackathon!",
      };
    case "rejected":
      return {
        badge: "Not accepted",
        tone: "red",
        body: "Thanks for applying. Unfortunately we couldn't offer you a spot this time.",
      };
    default:
      return { badge: reg.status, tone: "slate", body: "" };
  }
}

export default function ProfileClient() {
  const { logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, ec, regs, rn] = await Promise.all([
        axios.get("/api/accounts/profile/get"),
        axios.get("/api/accounts/profile/email_confirmed"),
        axios.get("/api/registrations/get"),
        axios.get("/api/resumes/filename"),
      ]);
      setProfile(p.data.profile ?? null);
      setEmailConfirmed(Boolean(ec.data.email_confirmed));
      const list: Registration[] = regs.data.registrations ?? [];
      setRegistration(list.find((r) => r.event === CURRENT_EVENT) ?? null);
      setResumeName(rn.data.filename ?? "");
    } catch {
      setMessage("Could not load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(fn: () => Promise<void>, note: string) {
    setBusy(true);
    setMessage("");
    try {
      await fn();
      setMessage(note);
      await load();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const rsvp = () =>
    act(
      () =>
        axios
          .post("/api/registrations/rsvp/rsvp", { event: CURRENT_EVENT })
          .then(() => undefined),
      "You're RSVP'd — see you there!",
    );

  const cancelRsvp = () =>
    act(
      () =>
        axios
          .post("/api/registrations/rsvp/cancel", { event: CURRENT_EVENT })
          .then(() => undefined),
      "Your RSVP has been cancelled.",
    );

  const resendConfirm = () =>
    act(
      () =>
        axios
          .post("/api/accounts/confirm_email/request", {
            confirm_url: `${window.location.protocol}//${window.location.host}/confirm_email`,
          })
          .then(() => undefined),
      "Confirmation email sent — check your inbox.",
    );

  const uploadResume = (file: File) =>
    act(async () => {
      const data = new FormData();
      data.append("file", file);
      await axios.post("/api/resumes/", data);
    }, "Resume uploaded.");

  const view = statusView(emailConfirmed, registration);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-5">
      <div className="w-full min-w-[300px] max-w-[640px] rounded-2xl border border-white/25 bg-white/10 p-8 backdrop-blur-sm motion-safe:animate-rise sm:p-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl text-white text-shadow-hero-title sm:text-4xl">
            {profile?.first_name
              ? `Hi, ${profile.first_name}!`
              : "Your Profile"}
          </h1>
          <button
            type="button"
            className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
            onClick={async () => {
              await logout();
              router.push("/register/login");
            }}
          >
            Log out
          </button>
        </div>

        {loading ? (
          <p className="text-white/80">Loading…</p>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Application status */}
            <section className="rounded-xl border border-white/15 bg-white/5 p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-sm font-semibold text-white/70">
                  HopHacks {CURRENT_EVENT}
                </span>
                <span
                  className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-semibold ${TONES[view.tone]}`}
                >
                  {view.badge}
                </span>
              </div>
              <p className="text-white/90">{view.body}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                {view.action === "confirm" && (
                  <button
                    type="button"
                    className={BTN_SECONDARY}
                    onClick={resendConfirm}
                    disabled={busy}
                  >
                    Resend confirmation email
                  </button>
                )}
                {view.action === "rsvp" && (
                  <button
                    type="button"
                    className={BTN_PRIMARY}
                    onClick={rsvp}
                    disabled={busy}
                  >
                    RSVP now
                  </button>
                )}
                {view.action === "cancel" && (
                  <button
                    type="button"
                    className={BTN_SECONDARY}
                    onClick={cancelRsvp}
                    disabled={busy}
                  >
                    Cancel RSVP
                  </button>
                )}
              </div>
            </section>

            {/* Resume */}
            <section className="rounded-xl border border-white/15 bg-white/5 p-5">
              <h2 className="mb-2 font-semibold text-white">Resume</h2>
              <p className="mb-3 text-sm text-white/80">
                {resumeName
                  ? `Current: ${resumeName}`
                  : "No resume uploaded yet."}
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadResume(f);
                  }}
                />
                <span className="inline-block rounded bg-white px-4 py-2 font-semibold text-[#061A40] transition-colors hover:bg-gray-100">
                  {resumeName ? "Replace resume" : "Upload resume"}
                </span>
              </label>
            </section>

            {/* Info summary */}
            {profile && (
              <section className="rounded-xl border border-white/15 bg-white/5 p-5 text-sm text-white/80">
                <h2 className="mb-2 font-semibold text-white">Your info</h2>
                <p>
                  {profile.first_name} {profile.last_name}
                </p>
                {profile.school ? <p>{profile.school}</p> : null}
                {profile.level_of_study ? (
                  <p>{profile.level_of_study}</p>
                ) : null}
                {profile.country ? <p>{profile.country}</p> : null}
              </section>
            )}

            {message && <p className="text-center text-white/90">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

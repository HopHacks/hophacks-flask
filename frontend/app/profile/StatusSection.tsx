"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CURRENT_EVENT } from "@/app/util/event";
import { BTN_PRIMARY, BTN_SECONDARY, SectionTitle, ErrorNote } from "./ui";

type Registration = {
  event: string;
  status: string;
};

const TONES = {
  green: "bg-green-500/20 text-green-100 border-green-400/40",
  blue: "bg-sky-500/20 text-sky-100 border-sky-400/40",
  amber: "bg-amber-500/20 text-amber-100 border-amber-400/40",
  red: "bg-red-500/20 text-red-100 border-red-400/40",
  slate: "bg-white/10 text-white border-white/30",
} as const;

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
        body: "Congratulations, you've been accepted! Please RSVP to confirm your spot.",
        action: "rsvp",
      };
    case "rsvped":
      return {
        badge: "RSVP'd",
        tone: "green",
        body: "You're all set. We can't wait to see you at HopHacks!",
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

export function StatusSection() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const [ec, regs] = await Promise.all([
        axios.get("/api/accounts/profile/email_confirmed"),
        axios.get("/api/registrations/get"),
      ]);
      setEmailConfirmed(Boolean(ec.data?.email_confirmed));
      const list: Registration[] = regs.data?.registrations ?? [];
      setRegistration(list.find((r) => r.event === CURRENT_EVENT) ?? null);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(fn: () => Promise<unknown>, note: string) {
    setBusy(true);
    setMessage("");
    setIsError(false);
    try {
      await fn();
      setMessage(note);
      await load();
    } catch {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const resendConfirm = () =>
    act(
      () =>
        axios.post("/api/accounts/confirm_email/request", {
          confirm_url: `${window.location.protocol}//${window.location.host}/confirm_email`,
        }),
      "Confirmation email sent. Check your inbox.",
    );

  const rsvp = () =>
    act(
      () =>
        axios.post("/api/registrations/rsvp/rsvp", { event: CURRENT_EVENT }),
      "You're RSVP'd. See you there!",
    );

  const cancelRsvp = () =>
    act(
      () =>
        axios.post("/api/registrations/rsvp/cancel", { event: CURRENT_EVENT }),
      "Your RSVP has been cancelled.",
    );

  if (loading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle>Application Status</SectionTitle>
        <p className="text-white/80">Loading status…</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="flex flex-col gap-4">
        <SectionTitle>Application Status</SectionTitle>
        <ErrorNote msg="Could not load your application status." />
        <div>
          <button type="button" className={BTN_SECONDARY} onClick={load}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  const view = statusView(emailConfirmed, registration);

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>Application Status</SectionTitle>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-white/80">
          HopHacks {CURRENT_EVENT}
        </span>
        <span
          className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-semibold ${TONES[view.tone]}`}
        >
          {view.badge}
        </span>
      </div>

      {view.body && <p className="text-white/90">{view.body}</p>}

      {view.action && (
        <div className="flex flex-wrap gap-3">
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
      )}

      {isError && <ErrorNote msg={message} />}
      {message && !isError && (
        <p className="text-sm text-green-300">{message}</p>
      )}
    </section>
  );
}

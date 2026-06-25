"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLS = "input-sketch w-full rounded px-4 py-2.5 text-base";
const BTN_PRIMARY =
  "rounded-2xl bg-recap-gold px-5 py-3 text-lg font-bold text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 disabled:cursor-not-allowed disabled:opacity-50";

const MLH_CONSENT =
  "I authorize MLH + DEV to send me occasional emails about relevant events, career opportunities, and community announcements.";

type Status = "idle" | "submitting" | "success" | "error";

export default function InterestForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mlhEmails, setMlhEmails] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);

  function clearError() {
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!compact && (!firstName.trim() || !lastName.trim())) {
      setStatus("error");
      setMessage("Please enter your first and last name.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    // This is a public endpoint with no auth/cookies. Sending it without
    // credentials keeps it a simple CORS request, so a cross-origin backend
    // doesn't have to allow credentialed origins for pre-registration.
    const noCreds = { withCredentials: false };

    try {
      await axios.post(
        "/api/interest/",
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: cleanEmail,
          mlh_emails: mlhEmails,
          source: compact ? "hero" : "interest_page",
        },
        noCreds,
      );
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      return;
    }

    try {
      const res = await axios.get("/api/interest/count", noCreds);
      setCount(typeof res.data?.count === "number" ? res.data.count : null);
    } catch {
      // count is a nice-to-have; a failure here shouldn't block the success state
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex w-full max-w-lg flex-col items-center gap-3 text-center font-sans motion-safe:animate-pop"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-recap-gold text-3xl text-white shadow-[0_0_30px_rgba(255,181,31,0.45)]">
          ✓
        </div>
        <p className="text-xl font-bold text-white">{"You're on the list!"}</p>
        <p className="text-sm text-white/85">
          {count
            ? `You're hacker #${count} waiting for HopHacks 2026 — we'll email you the moment applications open.`
            : "We'll email you the moment applications open for HopHacks 2026."}
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  if (compact) {
    return (
      <div className="relative z-50 flex w-full max-w-lg flex-col items-center gap-3 font-sans">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
        >
          <label htmlFor="hero-first" className="sr-only">
            First name
          </label>
          <input
            id="hero-first"
            type="text"
            name="given-name"
            autoComplete="given-name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              clearError();
            }}
            className="input-sketch min-w-0 flex-1 rounded px-4 py-2.5 text-base sm:max-w-[10rem]"
          />
          <label htmlFor="hero-email" className="sr-only">
            Email address
          </label>
          <input
            id="hero-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
            className="input-sketch min-w-0 flex-1 rounded px-4 py-2.5 text-base sm:max-w-xs"
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-sketch shrink-0 rounded px-6 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 disabled:opacity-50"
          >
            {submitting ? "Joining…" : "Get Notified"}
          </button>
        </form>

        {message ? (
          <p
            role="status"
            className={`text-sm ${status === "error" ? "text-red-100" : "text-white/90"}`}
          >
            {message}
          </p>
        ) : null}

        <Link
          href="/register/interest"
          className="text-sm text-white/80 underline underline-offset-4 hover:text-white"
        >
          Pre-register with your full details →
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 font-sans"
    >
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 motion-safe:animate-rise"
        style={{ animationDelay: "0.05s" }}
      >
        <div>
          <label htmlFor="if-first" className="sr-only">
            First name
          </label>
          <input
            id="if-first"
            type="text"
            name="given-name"
            autoComplete="given-name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              clearError();
            }}
            className={INPUT_CLS}
            required
          />
        </div>
        <div>
          <label htmlFor="if-last" className="sr-only">
            Last name
          </label>
          <input
            id="if-last"
            type="text"
            name="family-name"
            autoComplete="family-name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              clearError();
            }}
            className={INPUT_CLS}
            required
          />
        </div>
      </div>

      <div
        className="motion-safe:animate-rise"
        style={{ animationDelay: "0.12s" }}
      >
        <label htmlFor="if-email" className="sr-only">
          Email address
        </label>
        <input
          id="if-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
          className={INPUT_CLS}
          required
        />
      </div>

      <label
        className="flex cursor-pointer items-start gap-2 text-sm text-white/85 motion-safe:animate-rise"
        style={{ animationDelay: "0.19s" }}
      >
        <input
          type="checkbox"
          checked={mlhEmails}
          onChange={(e) => setMlhEmails(e.target.checked)}
          className="mt-1 shrink-0"
        />
        <span>(Optional) {MLH_CONSENT}</span>
      </label>

      {message ? (
        <p role="status" className="text-sm text-red-300">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={`${BTN_PRIMARY} w-full motion-safe:animate-rise`}
        style={{ animationDelay: "0.26s" }}
      >
        {submitting ? "Joining the list…" : "Notify Me When Apps Open"}
      </button>
    </form>
  );
}

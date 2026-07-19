"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

// Shared styles copied from the signup page's homepage design language (see
// the top of `app/register/signup/page.tsx`). If those change, mirror them
// here.

const INPUT_CLS = "input-sketch w-full rounded-lg px-4 py-2.5 text-base";
const BTN_PRIMARY =
  "rounded-2xl bg-recap-gold px-6 py-3 text-lg font-bold text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
const CARD_CLS =
  "w-full rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-sm sm:p-8 motion-safe:animate-rise";

function ErrorNote({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p className="rounded-lg border border-red-300/40 bg-red-500/25 px-4 py-2 text-sm text-white">
      {msg}
    </p>
  );
}

function SuccessNote({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm text-white">
      {msg}
    </p>
  );
}

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setErrorMsg("");
    try {
      await axios.post("/api/accounts/reset_password/request", {
        username: email,
        reset_url: `${window.location.protocol}//${window.location.host}/reset_password`,
      });
      setMessage("An email has been sent (if the account exists)!");
    } catch {
      setErrorMsg("Error requesting password reset. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-4 pb-10 pt-28 sm:py-14">
      <h1 className="text-center font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-white text-shadow-hero-title">
        Reset Password
      </h1>
      <p className="mb-8 mt-1 text-center text-white/90">
        Fall 2026 · Johns Hopkins University
      </p>

      <div className="w-full max-w-md">
        <div className={CARD_CLS}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-white">
                Email address
              </span>
              <input
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className={INPUT_CLS}
                required
              />
            </label>
            <SuccessNote msg={message} />
            <ErrorNote msg={errorMsg} />
            <div className="mt-1 flex justify-end">
              <button
                type="submit"
                className={BTN_PRIMARY}
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-white/85">
          <Link
            href="/register/login"
            className="underline underline-offset-4 hover:text-white"
          >
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import HomeLink from "@/app/components/HomeLink";
import { PASSWORD_RE } from "@/app/register/signup/data/options";
import { EVENT_TAGLINE } from "@/app/util/event";

// ---- Shared styles (homepage design language, copied from
// app/register/signup/page.tsx; mirror any changes) ----

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

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenFailed, setTokenFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!PASSWORD_RE.test(password)) {
      setError(
        "New password must be between 8 and 25 characters, using letters, numbers, and the special characters !@#$%^&*)(+=._- with at least one number and one special character.",
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/api/accounts/reset_password", {
        reset_token: token,
        password,
      });
      setError("");
      setSuccess(true);
    } catch {
      setTokenFailed(true);
      setError(
        "Unable to reset password. The link may be invalid, expired, or already used.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-4 pb-10 pt-28 sm:py-14">
      <HomeLink />
      <h1 className="text-center font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-white text-shadow-hero-title">
        Reset Password
      </h1>
      <p className="mb-8 mt-1 text-center text-white/90">{EVENT_TAGLINE}</p>

      <div className="w-full max-w-md">
        <div className={CARD_CLS}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-white">
                New Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={INPUT_CLS}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-white">
                Confirm Password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={INPUT_CLS}
              />
            </label>

            <ErrorNote msg={error} />
            {success && (
              <p className="text-center text-sm text-green-300">
                Password reset successfully! You can now sign in with your new
                password.
              </p>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className={BTN_PRIMARY}
                disabled={submitting || success}
              >
                {submitting ? "Resetting…" : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 flex items-center justify-center gap-6 text-center text-sm text-white/85">
          <Link
            href="/register/login"
            className="underline underline-offset-4 hover:text-white"
          >
            Back to Sign In
          </Link>
          {tokenFailed && (
            <Link
              href="/register/resetpassword"
              className="underline underline-offset-4 hover:text-white"
            >
              Request a new reset link
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}

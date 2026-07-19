"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";

// ---- Shared styles (homepage design language, copied from
// app/register/signup/page.tsx; mirror any changes) ----

const BTN_PRIMARY =
  "rounded-2xl bg-recap-gold px-6 py-3 text-lg font-bold text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
const CARD_CLS =
  "w-full rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-sm sm:p-8 motion-safe:animate-rise";

type ConfirmState = "pending" | "confirmed" | "already" | "failed";

/** The backend reports an already-confirmed email in the response `msg`. */
function isAlreadyConfirmed(data: unknown): boolean {
  const msg = (data as { msg?: unknown } | null | undefined)?.msg;
  return typeof msg === "string" && msg.toLowerCase().includes("already");
}

export default function ConfirmEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<ConfirmState>("pending");
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    axios
      .post("/api/accounts/confirm_email", { confirm_token: token })
      .then((res) => {
        setState(isAlreadyConfirmed(res.data) ? "already" : "confirmed");
      })
      .catch((err: AxiosError) => {
        setState(isAlreadyConfirmed(err.response?.data) ? "already" : "failed");
      });
  }, [token]);

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-4 pb-10 pt-28 sm:py-14">
      <h1 className="text-center font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-white text-shadow-hero-title">
        Email Confirmation
      </h1>
      <p className="mb-8 mt-1 text-center text-white/90">
        Fall 2026 · Johns Hopkins University
      </p>

      <div className="w-full max-w-2xl">
        <div className={CARD_CLS}>
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            {state === "pending" && (
              <p className="text-xl font-bold text-white">
                Confirming your email…
              </p>
            )}

            {state === "confirmed" && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-recap-gold text-4xl text-white shadow-[0_0_30px_rgba(255,181,31,0.45)]">
                  ✓
                </div>
                <p className="text-xl font-bold text-white">
                  Email confirmed! Your application is in.
                </p>
                <p className="text-white/90">
                  We'll email you once decisions go out. Sign in any time to
                  update your profile or resume.
                </p>
              </>
            )}

            {state === "already" && (
              <>
                <p className="text-xl font-bold text-white">
                  This email is already confirmed.
                </p>
                <p className="text-white/90">
                  Your application is all set. Sign in to view your status.
                </p>
              </>
            )}

            {state === "failed" && (
              <>
                <p className="text-xl font-bold text-white">
                  This confirmation link is invalid or expired.
                </p>
                <p className="text-white/90">
                  Sign in and resend the confirmation email from your profile
                  page to get a fresh link.
                </p>
              </>
            )}

            <Link href="/register/login" className={BTN_PRIMARY}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

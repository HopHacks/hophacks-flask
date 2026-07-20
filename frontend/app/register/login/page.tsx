"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/app/util/auth";
import HomeLink from "@/app/components/HomeLink";
import { EVENT_TAGLINE } from "@/app/util/event";

// Shared styles copied from the signup page's homepage design language (see
// the top of `app/register/signup/page.tsx`). If those change, mirror them
// here.

const INPUT_CLS = "input-sketch w-full rounded-lg px-4 py-2.5 text-base";
const BTN_PRIMARY =
  "rounded-2xl bg-recap-gold px-6 py-3 text-lg font-bold text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
const CARD_CLS =
  "w-full rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-sm sm:p-8 motion-safe:animate-rise";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-white">{label}</span>
      {children}
    </label>
  );
}

function ErrorNote({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p className="rounded-lg border border-red-300/40 bg-red-500/25 px-4 py-2 text-sm text-white">
      {msg}
    </p>
  );
}

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.push("/profile");
  }, [isLoggedIn, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      await login(email, password);
      router.push("/profile");
    } catch (error) {
      // Only a 401 means bad credentials; anything else (network failure,
      // 5xx) is on us, so don't send users into password-reset loops.
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMsg("Incorrect email or password.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-4 pb-10 pt-28 sm:py-14">
      <HomeLink />
      <h1 className="text-center font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-white text-shadow-hero-title">
        Sign In
      </h1>
      <p className="mb-8 mt-1 text-center text-white/90">{EVENT_TAGLINE}</p>

      <div className="w-full max-w-md">
        <div className={CARD_CLS}>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Field label="Email address">
              <input
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className={INPUT_CLS}
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_CLS}
                required
              />
            </Field>
            <ErrorNote msg={errorMsg} />
            <div className="mt-1 flex items-center justify-between gap-4">
              <Link
                href="/register/resetpassword"
                className="text-sm text-white/85 underline underline-offset-4 hover:text-white"
              >
                Forgot password?
              </Link>
              <button
                type="submit"
                className={BTN_PRIMARY}
                disabled={submitting}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 flex items-center justify-center gap-6 text-center text-sm text-white/85">
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-white"
          >
            ← Back to home
          </Link>
          <Link
            href="/register/signup"
            className="underline underline-offset-4 hover:text-white"
          >
            New here? Apply to HopHacks
          </Link>
        </p>
      </div>
    </div>
  );
}

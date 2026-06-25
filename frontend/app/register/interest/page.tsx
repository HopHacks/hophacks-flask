import type { Metadata } from "next";
import Link from "next/link";
import InterestForm from "@/app/components/interest/InterestForm";

export const metadata: Metadata = {
  title: "Pre-Register | HopHacks 2026",
  description:
    "Be first in line — get notified the moment HopHacks 2026 applications open.",
};

export default function InterestPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover bg-center p-5">
      <div
        className="w-full min-w-[300px] max-w-[640px] rounded-2xl p-8 motion-safe:animate-rise sm:p-10"
        style={{ backgroundColor: "rgba(0, 29, 76, 0.9)" }}
      >
        <h1
          className="mb-2 text-center font-display text-4xl text-white sm:text-5xl"
          style={{ fontVariant: "small-caps" }}
        >
          Be First in Line
        </h1>
        <p className="mb-7 text-center text-sm text-white/85 sm:text-base">
          Applications for HopHacks 2026 aren&apos;t open yet. Drop your name
          and we&apos;ll email you the moment they are.
        </p>

        <InterestForm />

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white/75 underline underline-offset-4 hover:text-white"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

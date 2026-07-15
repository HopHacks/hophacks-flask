"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/app/util/RequireAuth";
import { useAuth } from "@/app/util/auth";
import { ProfileForm } from "./ProfileForm";
import { ResumeSection } from "./ResumeSection";
import { CARD_CLS } from "./ui";

function ProfileContent() {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/register/login");
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-4 py-10 sm:py-14">
      <h1 className="text-center font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-white text-shadow-hero-title">
        Your Profile
      </h1>
      <p className="mb-8 mt-1 text-center text-white/90">
        Fall 2026 · Johns Hopkins University
      </p>

      <div className="w-full max-w-2xl">
        <div className={CARD_CLS}>
          <ProfileForm />

          <hr className="my-8 border-rock-light/30" />

          <ResumeSection />
        </div>

        <p className="mt-5 flex items-center justify-center gap-6 text-center text-sm text-white/85">
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-white"
          >
            ← Back to home
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer underline underline-offset-4 hover:text-white"
          >
            Log out
          </button>
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

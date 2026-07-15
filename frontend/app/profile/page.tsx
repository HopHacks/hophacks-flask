"use client";

import { useRouter } from "next/navigation";
import { RequireAuth } from "@/app/util/RequireAuth";
import { useAuth } from "@/app/util/auth";
import { ProfileForm } from "./ProfileForm";
import { ResumeSection } from "./ResumeSection";

function ProfileCard() {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/register/login");
  }

  return (
    <div
      className="min-w-[300px] max-w-[900px] w-[90%] flex flex-col rounded-2xl p-10 m-5"
      style={{ backgroundColor: "rgba(0, 29, 76, 0.9)" }}
    >
      <div className="flex items-start justify-between mb-6">
        <h2
          className="text-5xl font-bold text-white"
          style={{ fontVariant: "small-caps" }}
        >
          Your Profile
        </h2>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-sketch px-4 py-2 rounded-2xl cursor-pointer"
        >
          Log out
        </button>
      </div>

      <ProfileForm />

      <hr className="my-8 border-white/20" />

      <ResumeSection />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh py-10">
        <ProfileCard />
      </div>
    </RequireAuth>
  );
}

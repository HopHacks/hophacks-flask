"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) router.push("/register/login");
  }, [isLoggedIn, router]);

  if (isLoggedIn === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-white/80">Checking login...</p>
      </div>
    );
  }
  if (isLoggedIn === false) return null;

  return <>{children}</>;
}

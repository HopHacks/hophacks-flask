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

  if (isLoggedIn === null) return <p>Checking login...</p>;
  if (isLoggedIn === false) return null;

  return <>{children}</>;
}

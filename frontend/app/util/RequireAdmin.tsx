"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/util/auth";
import { getIsAdmin } from "@/app/util/adminApi";

/**
 * Gate a subtree to admins only. Composes with the login gate: waits for the
 * auth token to be set, then verifies admin via the backend. Never renders the
 * protected children (which contain applicant PII) until confirmed admin.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<"checking" | "admin" | "denied">(
    "checking",
  );

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/register/login");
      return;
    }
    if (isLoggedIn !== true) return; // still resolving session / no token yet

    let cancelled = false;
    getIsAdmin().then((ok) => {
      if (cancelled) return;
      if (ok) {
        setState("admin");
      } else {
        setState("denied");
        router.push("/register/login");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, router]);

  if (state !== "admin") {
    return <div className="p-8 text-sm text-slate-500">Checking access…</div>;
  }
  return <>{children}</>;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth";
import axios from "axios";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        if (isLoggedIn === false) {
            router.push("/register/login");
            return;
        }

        if (isLoggedIn === true) {
            axios
                .get("/api/admin/verify")
                .then(() => setIsAdmin(true))
                .catch(() => {
                    setIsAdmin(false);
                    router.push("/");
                });
        }
    }, [isLoggedIn, router]);

    if (isLoggedIn === null || isAdmin === null) return <p>Checking access...</p>;
    if (!isAdmin) return null;

    return <>{children}</>;
}

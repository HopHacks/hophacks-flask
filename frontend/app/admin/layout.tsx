"use client";

import { RequireAdmin } from "../util/RequireAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <RequireAdmin>{children}</RequireAdmin>;
}

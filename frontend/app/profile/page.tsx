"use client";

import { RequireAuth } from "@/app/util/RequireAuth";
import ProfileClient from "./ProfileClient";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileClient />
    </RequireAuth>
  );
}

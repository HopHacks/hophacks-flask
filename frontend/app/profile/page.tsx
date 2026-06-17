"use client";

import { RequireAuth } from "@/app/util/RequireAuth";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-semibold">Your Profile</h1>

        {/* Profile fields go here */}

        {/* Resume upload/download goes here */}
      </div>
    </RequireAuth>
  );
}

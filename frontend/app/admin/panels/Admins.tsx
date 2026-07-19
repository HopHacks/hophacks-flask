"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { getAdmins, promoteAdmin } from "@/app/util/adminApi";

export default function Admins() {
  const [admins, setAdmins] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );

  const load = () =>
    getAdmins()
      .then(setAdmins)
      .catch(() => setNotice({ ok: false, msg: "Failed to load admins." }));

  useEffect(() => {
    load();
  }, []);

  async function onPromote(e: React.FormEvent) {
    e.preventDefault();
    const target = email.trim().toLowerCase();
    if (!target) return;
    setBusy(true);
    setNotice(null);
    try {
      const msg = await promoteAdmin(target);
      setNotice({ ok: true, msg });
      setEmail("");
      await load();
    } catch (err) {
      const ax = err as AxiosError<{ msg?: string }>;
      setNotice({
        ok: false,
        msg:
          ax.response?.data?.msg ??
          "Could not promote that email. Does the account exist?",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Admins
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Grant the admin console to another organizer. The account must already
        be registered.
      </p>

      <form onSubmit={onPromote} className="mt-6 flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="organizer@email.com"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm disabled:opacity-50"
        >
          {busy ? "Promoting…" : "Make admin"}
        </button>
      </form>

      {notice && (
        <p
          className={`mt-3 text-sm ${notice.ok ? "text-green-700" : "text-red-600"}`}
        >
          {notice.msg}
        </p>
      )}

      <h2 className="mt-8 border-b border-slate-300 pb-2 text-sm font-semibold text-slate-800">
        Current admins
      </h2>
      <ul className="mt-3 space-y-1">
        {admins.map((a) => (
          <li key={a} className="text-sm text-slate-700">
            {a}
          </li>
        ))}
        {admins.length === 0 && (
          <li className="text-sm text-slate-500">No admins found.</li>
        )}
      </ul>
    </div>
  );
}

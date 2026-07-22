"use client";

import { useState } from "react";
import Overview from "./panels/Overview";
import Applications from "./panels/Applications";
import Stats from "./panels/Stats";
import Admins from "./panels/Admins";
import JudgeTool from "./panels/JudgeTool";

const TABS = [
  { key: "overview", label: "Overview", panel: <Overview /> },
  { key: "applications", label: "Applications", panel: <Applications /> },
  { key: "stats", label: "Stats", panel: <Stats /> },
  { key: "judgetool", label: "Judge Tool", panel: <JudgeTool /> },
  { key: "admins", label: "Admins", panel: <Admins /> },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminPage() {
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div>
      <header className="border-b border-slate-300 bg-slate-200/80 px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-800">
              HOPHACKS
            </div>
            <div className="text-xs text-slate-600">Admin Console</div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={[
                  "rounded-lg px-4 py-2 text-sm transition",
                  tab === t.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-300/70",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main>{TABS.find((t) => t.key === tab)?.panel}</main>
    </div>
  );
}

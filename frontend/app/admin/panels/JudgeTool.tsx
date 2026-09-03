"use client";

import { useState } from "react";
import JudgeUpload from "./judgetool/Upload";
import JudgeAssignments from "./judgetool/Assignments";
import JudgeTables from "./judgetool/Tables";
import JudgeSubmissions from "./judgetool/Submissions";

const SUBTABS = [
  { key: "upload", label: "Upload" },
  { key: "assignments", label: "Assignments" },
  { key: "tables", label: "Tables" },
  { key: "submissions", label: "Submissions" },
] as const;

type SubTab = (typeof SUBTABS)[number]["key"];

export default function JudgeTool() {
  const [tab, setTab] = useState<SubTab>("upload");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {SUBTABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={[
              "rounded-lg px-4 py-2 text-sm transition",
              tab === t.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-200/70",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <JudgeUpload
          onGenerated={() => {
            setRefreshKey((k) => k + 1);
            setTab("assignments");
          }}
        />
      )}
      {tab === "assignments" && <JudgeAssignments key={`a-${refreshKey}`} />}
      {tab === "tables" && <JudgeTables key={`t-${refreshKey}`} />}
      {tab === "submissions" && <JudgeSubmissions key={`s-${refreshKey}`} />}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Panel from "@/components/analytics/Panel";
import { BROADCAST_STAGES, downloadSponsorInfoCsv } from "@/app/util/adminApi";

export const SPONSOR_INFO_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone number" },
  { key: "grad_year", label: "Graduation year" },
  { key: "linkedin_url", label: "LinkedIn profile URL" },
  {
    key: "github_url",
    label: "GitHub profile URL",
    hint: "Scraped from the resume when it is not on the account",
  },
  { key: "school", label: "School" },
  { key: "major", label: "Major" },
  { key: "first_name", label: "First name" },
  { key: "last_name", label: "Last name" },
] as const;

export type SponsorInfoFieldKey = (typeof SPONSOR_INFO_FIELDS)[number]["key"];

const DEFAULT_FIELDS: SponsorInfoFieldKey[] = [
  "name",
  "email",
  "phone",
  "grad_year",
  "linkedin_url",
  "github_url",
];

const STATUS_OPTIONS = [["all", "All statuses"], ...BROADCAST_STAGES] as const;

const FIELD_BY_KEY = Object.fromEntries(
  SPONSOR_INFO_FIELDS.map((f) => [f.key, f]),
) as Record<SponsorInfoFieldKey, (typeof SPONSOR_INFO_FIELDS)[number]>;

export default function SponsorInfoExtractor() {
  const [fields, setFields] = useState<SponsorInfoFieldKey[]>(DEFAULT_FIELDS);
  const [status, setStatus] = useState("all");
  const [toAdd, setToAdd] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const unused = useMemo(
    () => SPONSOR_INFO_FIELDS.filter((f) => !fields.includes(f.key)),
    [fields],
  );

  function addField() {
    const key = toAdd as SponsorInfoFieldKey;
    if (!key || fields.includes(key)) return;
    setFields((prev) => [...prev, key]);
    setToAdd("");
  }

  function removeField(key: SponsorInfoFieldKey) {
    setFields((prev) => prev.filter((k) => k !== key));
  }

  function moveField(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= fields.length) return;
    setFields((prev) => {
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }

  async function onDownload() {
    if (fields.length === 0) {
      setError("Add at least one field.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await downloadSponsorInfoCsv(fields, status);
      setMessage("CSV downloaded.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Export failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Sponsor Info Extractor
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Build a CSV of current-event applicants for sponsors. Filter by
        application status, then pick the account fields you want. GitHub is not
        collected at signup, so it is read from the resume when possible and
        filled with N/A otherwise. Narrow the status filter if GitHub export
        times out — resume downloads stop early rather than failing the whole
        file.
      </p>

      <div className="mt-6">
        <Panel title="Columns">
          <ol className="space-y-2">
            {fields.map((key, index) => {
              const field = FIELD_BY_KEY[key];
              return (
                <li
                  key={key}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <span className="flex-1 text-sm text-slate-800">
                    {field.label}
                    {"hint" in field && field.hint ? (
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {field.hint}
                      </span>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30"
                    disabled={index === 0}
                    onClick={() => moveField(index, -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30"
                    disabled={index === fields.length - 1}
                    onClick={() => moveField(index, 1)}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:text-red-800"
                    onClick={() => removeField(key)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
            {fields.length === 0 && (
              <li className="text-sm text-slate-400">No fields yet.</li>
            )}
          </ol>

          <div className="mt-4 flex gap-2">
            <select
              aria-label="Add a field"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={toAdd}
              onChange={(e) => setToAdd(e.target.value)}
              disabled={unused.length === 0}
            >
              <option value="">
                {unused.length === 0 ? "All fields added" : "Add a field…"}
              </option>
              {unused.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 disabled:opacity-50"
              disabled={!toAdd}
              onClick={addField}
            >
              Add
            </button>
          </div>
        </Panel>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          aria-label="Application status"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={busy || fields.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          onClick={onDownload}
        >
          {busy ? "Working…" : "Download CSV"}
        </button>
        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

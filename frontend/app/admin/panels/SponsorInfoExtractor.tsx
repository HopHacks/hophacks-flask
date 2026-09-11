"use client";

import { useMemo, useState } from "react";
import Panel from "@/components/analytics/Panel";
import {
  BROADCAST_STAGES,
  downloadSponsorInfoCsv,
  downloadSponsorResumesZip,
} from "@/app/util/adminApi";

export const SPONSOR_INFO_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone number" },
  { key: "grad_year", label: "Graduation year" },
  { key: "linkedin_url", label: "LinkedIn profile URL" },
  {
    key: "github_url",
    label: "GitHub profile URL",
    hint: "Optional. Read from the resume when it is not on the account",
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
];

const STATUS_OPTIONS = [["all", "All statuses"], ...BROADCAST_STAGES] as const;

function StatusFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label={label}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {STATUS_OPTIONS.map(([option, optionLabel]) => (
        <option key={option} value={option}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
}

const FIELD_BY_KEY = Object.fromEntries(
  SPONSOR_INFO_FIELDS.map((f) => [f.key, f]),
) as Record<SponsorInfoFieldKey, (typeof SPONSOR_INFO_FIELDS)[number]>;

export default function SponsorInfoExtractor() {
  const [fields, setFields] = useState<SponsorInfoFieldKey[]>(DEFAULT_FIELDS);
  const [csvStatus, setCsvStatus] = useState("all");
  const [resumeStatus, setResumeStatus] = useState("all");
  const [toAdd, setToAdd] = useState("");
  const [csvBusy, setCsvBusy] = useState(false);
  const [resumeBusy, setResumeBusy] = useState(false);
  const [csvError, setCsvError] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [csvMessage, setCsvMessage] = useState("");
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeProgress, setResumeProgress] = useState("");

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

  async function onDownloadCsv() {
    if (fields.length === 0) {
      setCsvError("Add at least one field.");
      return;
    }
    setCsvBusy(true);
    setCsvError("");
    setCsvMessage("");
    try {
      await downloadSponsorInfoCsv(fields, csvStatus);
      setCsvMessage("CSV downloaded.");
    } catch (err) {
      setCsvError(
        err instanceof Error ? err.message : "Export failed. Please try again.",
      );
    } finally {
      setCsvBusy(false);
    }
  }

  async function onDownloadResumes() {
    setResumeBusy(true);
    setResumeError("");
    setResumeMessage("");
    setResumeProgress("");
    try {
      const result = await downloadSponsorResumesZip(
        resumeStatus,
        (done, total) => {
          setResumeProgress(`Downloading ${done} / ${total}`);
        },
      );
      const extra = result.skipped
        ? ` (${result.skipped} could not be read)`
        : "";
      setResumeMessage(`Zip downloaded: ${result.downloaded} resumes${extra}.`);
    } catch (err) {
      setResumeError(
        err instanceof Error ? err.message : "Export failed. Please try again.",
      );
    } finally {
      setResumeBusy(false);
      setResumeProgress("");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Sponsor Info Extractor
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Download a CSV of account fields and/or a zip of resumes. Each section
        has its own application-status filter. GitHub is not collected at signup
        — add it to the CSV only if you need it; it reads resumes and used to
        crash the whole export.
      </p>

      <div className="mt-6">
        <Panel title="Info extractor">
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

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StatusFilter
              label="CSV application status"
              value={csvStatus}
              onChange={setCsvStatus}
            />
            <button
              type="button"
              disabled={csvBusy || fields.length === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              onClick={onDownloadCsv}
            >
              {csvBusy ? "Working…" : "Download CSV"}
            </button>
            {csvMessage && (
              <p className="text-sm text-green-700">{csvMessage}</p>
            )}
            {csvError && <p className="text-sm text-red-600">{csvError}</p>}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Resume extractor">
          <p className="text-sm text-slate-500">
            Download a zip of resumes for the status chosen below. Applicants
            without a file are skipped. Files are named{" "}
            <span className="font-medium text-slate-700">
              Last_First_email.pdf
            </span>
            .
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StatusFilter
              label="Resume application status"
              value={resumeStatus}
              onChange={setResumeStatus}
            />
            <button
              type="button"
              disabled={resumeBusy}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              onClick={onDownloadResumes}
            >
              {resumeBusy ? "Working…" : "Download resumes"}
            </button>
            {resumeProgress && (
              <p className="text-sm text-slate-600">{resumeProgress}</p>
            )}
            {resumeMessage && (
              <p className="text-sm text-green-700">{resumeMessage}</p>
            )}
            {resumeError && (
              <p className="text-sm text-red-600">{resumeError}</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

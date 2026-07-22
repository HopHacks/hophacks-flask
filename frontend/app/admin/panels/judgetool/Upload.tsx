"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import Panel from "@/components/analytics/Panel";
import StatCard from "@/components/analytics/StatCard";

type Counts = {
  validSubmissions: number;
  judges: number;
  rooms: number;
  judgesPerTeam: number;
  tracks?: number;
};

type CsvMeta = {
  trackColumn?: string | null;
  prizeColumn?: string | null;
  tracksFound?: string[];
  columns?: string[];
};

function fileLabel(file: File | null, empty: string) {
  return file ? file.name : empty;
}

type Props = {
  onGenerated?: () => void;
};

export default function JudgeUpload({ onGenerated }: Props) {
  const [submissionsFile, setSubmissionsFile] = useState<File | null>(null);
  const [judgesFile, setJudgesFile] = useState<File | null>(null);
  const [roomsFile, setRoomsFile] = useState<File | null>(null);
  const [judgesPerTeam, setJudgesPerTeam] = useState("2");
  const [counts, setCounts] = useState<Counts | null>(null);
  const [csvMeta, setCsvMeta] = useState<CsvMeta | null>(null);
  const [eventId, setEventId] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!submissionsFile || !judgesFile || !roomsFile) {
      setError("Upload submissions CSV, judges TXT, and rooms CSV.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("sfile", submissionsFile);
    formData.append("jfile", judgesFile);
    formData.append("room_file", roomsFile);
    formData.append("ifile", judgesPerTeam);

    try {
      const { data } = await axios.post("/api/judgetool/assignments", formData);
      setCounts(data.counts ?? null);
      setCsvMeta(data.csvMeta ?? null);
      setWarnings(data.warnings ?? []);
      setEventId(data.eventId ?? "");
      const trackCount = data.csvMeta?.tracksFound?.length ?? 0;
      setMessage(
        trackCount > 0
          ? `Assignments generated. Pulled ${trackCount} track(s) from CSV column "${data.csvMeta.trackColumn}".`
          : "Assignments generated. No tracks found in the submissions CSV.",
      );
      onGenerated?.();
    } catch (err) {
      const ax = err as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error ?? "Failed to generate assignments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Upload
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload a Devpost submissions CSV (tracks are read from that file),
          judges TXT, and rooms CSV.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard
          title="Submissions"
          value={counts ? String(counts.validSubmissions) : "—"}
        />
        <StatCard title="Judges" value={counts ? String(counts.judges) : "—"} />
        <StatCard title="Rooms" value={counts ? String(counts.rooms) : "—"} />
        <StatCard
          title="Judges / team"
          value={counts ? String(counts.judgesPerTeam) : "—"}
        />
        <StatCard
          title="Tracks from CSV"
          value={
            counts?.tracks != null
              ? String(counts.tracks)
              : csvMeta?.tracksFound
                ? String(csvMeta.tracksFound.length)
                : "—"
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Inputs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Submissions CSV</span>
              <input
                type="file"
                accept=".csv"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:text-slate-700"
                onChange={(e) =>
                  setSubmissionsFile(e.target.files?.[0] ?? null)
                }
              />
              <span className="mt-1 block text-xs text-slate-400">
                {fileLabel(
                  submissionsFile,
                  'Devpost export — tracks come from "Opt-In Prizes"',
                )}
              </span>
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Judges TXT</span>
              <input
                type="file"
                accept=".txt"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:text-slate-700"
                onChange={(e) => setJudgesFile(e.target.files?.[0] ?? null)}
              />
              <span className="mt-1 block text-xs text-slate-400">
                {fileLabel(judgesFile, "One judge name per line")}
              </span>
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Rooms CSV</span>
              <input
                type="file"
                accept=".csv"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:text-slate-700"
                onChange={(e) => setRoomsFile(e.target.files?.[0] ?? null)}
              />
              <span className="mt-1 block text-xs text-slate-400">
                {fileLabel(roomsFile, "Columns: Room, Capacity")}
              </span>
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-1 block font-medium">Judges per team</span>
              <input
                type="number"
                min={1}
                value={judgesPerTeam}
                onChange={(e) => setJudgesPerTeam(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
              <span className="mt-1 block text-xs text-slate-400">
                Must be ≤ total number of judges.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Working…" : "Generate assignments"}
            </button>
          </form>
        </Panel>

        <Panel title="Status">
          {eventId && (
            <p className="text-sm text-slate-600">
              Event: <span className="font-mono text-xs">{eventId}</span>
            </p>
          )}
          {csvMeta?.trackColumn && (
            <p className="mt-2 text-sm text-slate-600">
              Track column from CSV:{" "}
              <span className="font-medium">{csvMeta.trackColumn}</span>
            </p>
          )}
          {csvMeta?.tracksFound && csvMeta.tracksFound.length > 0 && (
            <p className="mt-1 text-sm text-slate-600">
              Tracks: {csvMeta.tracksFound.join(", ")}
            </p>
          )}
          {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {warnings.length > 0 && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <div className="mb-1 font-medium">Warnings</div>
              <ul className="list-disc space-y-1 pl-5">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          {!message && !error && warnings.length === 0 && (
            <p className="text-sm text-slate-400">
              Tracks are read from the submissions CSV column{" "}
              <span className="font-mono text-xs">Opt-In Prizes</span>. After
              generating, use the Submissions tab to filter by track.
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}

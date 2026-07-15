"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];

const BTN_PRIMARY =
  "px-5 py-2.5 text-lg font-bold rounded-2xl bg-[#ffb51f] text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] transition-shadow duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const BTN_SECONDARY =
  "btn-sketch px-5 py-2.5 text-lg font-bold rounded-2xl cursor-pointer disabled:opacity-50";

/**
 * resumes.py sometimes returns `jsonify(body, code)` — which serializes as a
 * `[body, code]` JSON array with HTTP status 200 — instead of
 * `jsonify(body), code`. Unwrap both shapes so success/failure is detected
 * from the body, not the HTTP status alone.
 */
function unwrapResumeResponse(data: unknown): {
  body: Record<string, unknown>;
  code: number;
} {
  if (Array.isArray(data)) {
    return {
      body: (data[0] ?? {}) as Record<string, unknown>,
      code: typeof data[1] === "number" ? data[1] : 200,
    };
  }
  return { body: (data ?? {}) as Record<string, unknown>, code: 200 };
}

export function ResumeSection() {
  const [savedFilename, setSavedFilename] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  const showError = (text: string) => {
    setMessage(text);
    setIsError(true);
  };
  const showSuccess = (text: string) => {
    setMessage(text);
    setIsError(false);
  };

  const loadFilename = useCallback(async () => {
    try {
      const res = await axios.get("/api/resumes/filename");
      setSavedFilename((res.data?.filename as string) ?? "");
    } catch {
      setSavedFilename("");
    }
  }, []);

  useEffect(() => {
    loadFilename();
  }, [loadFilename]);

  async function handleUpload() {
    if (!file) {
      showError("Please choose a file first.");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      showError("Acceptable formats: .pdf, .doc, .docx");
      return;
    }

    setBusy(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await axios.post("/api/resumes/", data);
      const { body, code } = unwrapResumeResponse(res.data);
      if (code !== 200) {
        showError(String(body.msg ?? "Upload failed — please try again."));
      } else {
        showSuccess("Resume uploaded!");
        setFile(null);
        await loadFilename();
      }
    } catch {
      showError("Upload failed — please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    try {
      const res = await axios.get("/api/resumes/");
      const { body } = unwrapResumeResponse(res.data);
      if (typeof body.url === "string" && body.url) {
        window.open(body.url, "_blank", "noopener");
      } else {
        showError("No resume on file.");
      }
    } catch {
      showError("Could not fetch your resume.");
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h3
        className="text-2xl font-bold text-white text-center"
        style={{ fontVariant: "small-caps" }}
      >
        Resume
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-white">
        {savedFilename ? (
          <>
            <span>
              On file: <span className="font-semibold">{savedFilename}</span>
            </span>
            <button
              type="button"
              className={BTN_SECONDARY}
              onClick={handleDownload}
            >
              Download
            </button>
          </>
        ) : (
          <span>No resume uploaded yet.</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setMessage("");
            }}
          />
          <span className="inline-block px-4 py-2 bg-white text-[#061A40] font-semibold rounded cursor-pointer hover:bg-gray-100 transition-colors">
            {savedFilename ? "Replace Resume" : "Choose Resume"}
          </span>
        </label>
        {file && <span className="text-white">{file.name}</span>}
        <button
          type="button"
          className={BTN_PRIMARY}
          onClick={handleUpload}
          disabled={busy || !file}
          style={{ fontVariant: "small-caps" }}
        >
          {busy ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="h-5 text-center">
        {message && (
          <p className={isError ? "text-red-400" : "text-green-400"}>
            {message}
          </p>
        )}
      </div>
      <p className="text-center text-sm text-gray-300">
        Acceptable formats: .pdf, .doc, .docx
      </p>
    </section>
  );
}

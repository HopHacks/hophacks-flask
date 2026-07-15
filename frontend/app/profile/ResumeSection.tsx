"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { BTN_PRIMARY, BTN_SECONDARY, SectionTitle, ErrorNote } from "./ui";

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];

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
    <section className="flex flex-col gap-5">
      <SectionTitle>Resume</SectionTitle>

      <div className="flex flex-col items-center justify-center gap-3 text-white sm:flex-row">
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

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          <span className="btn-sketch inline-block cursor-pointer rounded-2xl px-6 py-3 text-lg font-bold">
            {savedFilename ? "Replace Resume" : "Choose Resume"}
          </span>
        </label>
        {file && <span className="text-white">{file.name}</span>}
        <button
          type="button"
          className={BTN_PRIMARY}
          onClick={handleUpload}
          disabled={busy || !file}
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>

      {isError && <ErrorNote msg={message} />}
      <div className="h-5 text-center">
        {message && !isError && (
          <p className="text-sm text-green-300">{message}</p>
        )}
      </div>
      <p className="-mt-4 text-center text-sm text-white/75">
        Acceptable formats: .pdf, .doc, .docx
      </p>
    </section>
  );
}

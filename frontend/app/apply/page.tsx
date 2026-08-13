"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { RequireAuth } from "@/app/util/RequireAuth";
import HomeLink from "@/app/components/HomeLink";
import { CURRENT_EVENT } from "@/app/util/event";
import {
  ESSAY_QUESTIONS,
  ESSAY_WORD_LIMIT,
  EssayKey,
  wordCount,
} from "@/app/util/essays";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD_CLS,
  ErrorNote,
  Field,
  INPUT_CLS,
  SectionTitle,
} from "@/app/profile/ui";

type Registration = {
  event: string;
  status?: string;
  apply_at?: string;
};

type Answers = Record<EssayKey, string>;

const EMPTY: Answers = { essay_project: "", essay_team: "" };

const SUBMIT_WARNING =
  "Submit your application?\n\nYour responses are final — you won't be able to " +
  "edit them afterwards. Everything else on your profile stays editable.";

function formatSubmittedAt(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** The submitted, read-only view of an application. */
function SubmittedView({
  answers,
  reg,
}: {
  answers: Answers;
  reg: Registration;
}) {
  const submittedAt = formatSubmittedAt(reg.apply_at);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex rounded-full border border-green-400/40 bg-green-500/20 px-3 py-0.5 text-xs font-semibold text-green-100">
          Submitted
        </span>
        {submittedAt && (
          <span className="text-sm text-white/80">on {submittedAt}</span>
        )}
      </div>

      <p className="text-white/90">
        Your application is in. We&apos;ll email you once decisions go out.
      </p>

      {ESSAY_QUESTIONS.map((q) => (
        <div key={q.key} className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-white">{q.prompt}</span>
          <p className="whitespace-pre-wrap rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/90">
            {answers[q.key]}
          </p>
        </div>
      ))}
    </div>
  );
}

function ApplyContent() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const [ec, regs, prof] = await Promise.all([
        axios.get("/api/accounts/profile/email_confirmed"),
        axios.get("/api/registrations/get"),
        axios.get("/api/accounts/profile/get"),
      ]);
      setEmailConfirmed(Boolean(ec.data?.email_confirmed));
      const list: Registration[] = regs.data?.registrations ?? [];
      setRegistration(list.find((r) => r.event === CURRENT_EVENT) ?? null);

      const profile: Record<string, unknown> = prof.data?.profile ?? {};
      setAnswers({
        essay_project: String(profile.essay_project ?? ""),
        essay_team: String(profile.essay_team ?? ""),
      });
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function setAnswer(key: EssayKey, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setNotice("");
    setErrorMsg("");
  }

  const resendConfirm = async () => {
    setBusy(true);
    setErrorMsg("");
    try {
      await axios.post("/api/accounts/confirm_email/request", {
        confirm_url: `${window.location.protocol}//${window.location.host}/confirm_email`,
      });
      setNotice("Confirmation email sent. Check your inbox.");
    } catch {
      setErrorMsg("Could not send the email. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  /**
   * Drafts write only the two answers, by dot path, so saving one can never
   * disturb the rest of the profile.
   */
  const saveDraft = async () => {
    setBusy(true);
    setErrorMsg("");
    setNotice("");
    try {
      await axios.post("/api/registrations/apply/draft", answers);
      setNotice("Draft saved. You can come back and finish later.");
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        // Submitted in another tab; show them the real state.
        await load();
      } else {
        setErrorMsg("Could not save your draft. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    for (const q of ESSAY_QUESTIONS) {
      if (!answers[q.key].trim()) {
        setErrorMsg(q.requiredMsg);
        return;
      }
      if (wordCount(answers[q.key]) > ESSAY_WORD_LIMIT) {
        setErrorMsg(
          `* Responses must be ${ESSAY_WORD_LIMIT} words or fewer (currently ${wordCount(answers[q.key])}).`,
        );
        return;
      }
    }

    if (!window.confirm(SUBMIT_WARNING)) return;

    setBusy(true);
    setErrorMsg("");
    setNotice("");
    try {
      const res = await axios.post("/api/registrations/apply", answers);
      await load();
      setNotice(
        res.data?.email_sent === false
          ? "Application submitted. We couldn't send your confirmation email, but your application is in."
          : "Application submitted.",
      );
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        // Already submitted (double click, second tab): that is the desired
        // end state, so reload into the read-only view rather than erroring.
        await load();
      } else {
        setErrorMsg("Could not submit your application. Please try again.");
      }
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  let body: React.ReactNode;

  if (loading) {
    body = <p className="text-white/80">Loading your application…</p>;
  } else if (loadError) {
    body = (
      <div className="flex flex-col gap-4">
        <ErrorNote msg="Could not load your application." />
        <div>
          <button type="button" className={BTN_SECONDARY} onClick={load}>
            Retry
          </button>
        </div>
      </div>
    );
  } else if (!emailConfirmed) {
    body = (
      <div className="flex flex-col gap-4">
        <span className="inline-flex w-fit rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-100">
          Email not confirmed
        </span>
        <p className="text-white/90">
          Confirm your email before submitting your application. Check your
          inbox, or resend the confirmation below.
        </p>
        <div>
          <button
            type="button"
            className={BTN_SECONDARY}
            onClick={resendConfirm}
            disabled={busy}
          >
            Resend confirmation email
          </button>
        </div>
      </div>
    );
  } else if (registration) {
    body = <SubmittedView answers={answers} reg={registration} />;
  } else {
    body = (
      <div className="flex flex-col gap-6">
        <p className="text-white/90">
          Two questions, {ESSAY_WORD_LIMIT} words each. Save a draft as many
          times as you like — once you submit, your responses are final.
        </p>

        {ESSAY_QUESTIONS.map((q) => {
          const count = wordCount(answers[q.key]);
          const over = count > ESSAY_WORD_LIMIT;
          return (
            <Field key={q.key} label={q.prompt}>
              <textarea
                value={answers[q.key]}
                onChange={(e) => setAnswer(q.key, e.target.value)}
                className={INPUT_CLS + " min-h-[140px] resize-y"}
                placeholder="Your answer…"
                rows={6}
              />
              <span
                className={`text-xs ${over ? "text-red-300" : "text-white/65"}`}
              >
                {count} / {ESSAY_WORD_LIMIT} words
              </span>
            </Field>
          );
        })}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={BTN_PRIMARY}
            onClick={submit}
            disabled={busy}
          >
            Submit application
          </button>
          <button
            type="button"
            className={BTN_SECONDARY}
            onClick={saveDraft}
            disabled={busy}
          >
            Save draft
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-4 pb-10 pt-28 sm:py-14">
      <HomeLink />
      <h1 className="text-center font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-white text-shadow-hero-title">
        Your Application
      </h1>
      <p className="mb-8 mt-1 text-center text-white/90">
        HopHacks {CURRENT_EVENT}
      </p>

      <div className="w-full max-w-2xl">
        <div className={CARD_CLS}>
          <SectionTitle>Application questions</SectionTitle>
          <div className="mt-6">{body}</div>

          {errorMsg && (
            <div className="mt-5">
              <ErrorNote msg={errorMsg} />
            </div>
          )}
          {notice && !errorMsg && (
            <p className="mt-5 text-sm text-green-300">{notice}</p>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-white/85">
          <Link
            href="/profile"
            className="underline underline-offset-4 hover:text-white"
          >
            ← Back to your profile
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <RequireAuth>
      <ApplyContent />
    </RequireAuth>
  );
}

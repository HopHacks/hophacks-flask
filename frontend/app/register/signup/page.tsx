"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/app/util/auth";
import Combobox from "@/app/components/form/Combobox";
import {
  isJhuSchool,
  validateLinkedIn,
  validatePhone,
} from "@/app/profile/schema";
import COUNTRIES from "./data/countries";
import {
  AGES,
  EMAIL_RE,
  PASSWORD_RE,
  LEVELS_OF_STUDY,
  MAJORS,
  PRONOUNS,
  DIETARY,
  TSHIRT_SIZES,
  UNDERREPRESENTED,
} from "./data/options";

// Large MLH schools list is code-split and loaded on first focus of the field.
const loadSchools = () =>
  import("./data/schools.json").then((m) => m.default as string[]);
const OTHER_SCHOOL = "Other (not listed)";

// ---- Shared styles (homepage design language) ----

const INPUT_CLS = "input-sketch w-full rounded-lg px-4 py-2.5 text-base";
const BTN_PRIMARY =
  "rounded-2xl bg-recap-gold px-6 py-3 text-lg font-bold text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
const BTN_SECONDARY =
  "btn-sketch rounded-2xl px-6 py-3 text-lg font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
const CARD_CLS =
  "w-full rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-sm sm:p-8 motion-safe:animate-rise";

// ---- Small layout helpers ----

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  // The control is nested inside the <label> so the two are implicitly
  // associated (screen readers announce the label; clicking it focuses).
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-white">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-white/65">(optional)</span>
        )}
      </span>
      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-white/20 pb-2 text-lg font-bold text-white">
      {children}
    </h3>
  );
}

function ErrorNote({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p className="rounded-lg border border-red-300/40 bg-red-500/25 px-4 py-2 text-sm text-white">
      {msg}
    </p>
  );
}

const ESSAY_WORD_LIMIT = 300;
function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

const STEP_LABELS = ["Account", "Basic Info", "Application", "Avatar"];

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      <p className="text-sm text-white/90">
        Step {current + 1} of {STEP_LABELS.length} · {STEP_LABELS[current]}
      </p>
      <div className="flex gap-2">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`h-1.5 w-12 rounded-full transition-colors ${
              i <= current ? "bg-recap-gold" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={INPUT_CLS}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

// ---- Step 1: Account ----

type StepAccountProps = {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  passwordConfirm: string;
  setPasswordConfirm: (v: string) => void;
  confirmMsg: string;
  checking: boolean;
  onNext: () => void;
};

function StepAccount({
  username,
  setUsername,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  confirmMsg,
  checking,
  onNext,
}: StepAccountProps) {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <Field label="Email address">
        <input
          type="email"
          placeholder="you@school.edu"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          className={INPUT_CLS}
          required
        />
      </Field>
      <Field label="Password">
        <input
          type="password"
          placeholder="8–25 characters, one number and one special character"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={INPUT_CLS}
          required
        />
      </Field>
      <Field label="Confirm password">
        <input
          type="password"
          placeholder="Re-enter your password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className={INPUT_CLS}
          required
        />
      </Field>
      <ErrorNote msg={confirmMsg} />
      <div className="mt-1 flex items-center justify-between">
        <Link href="/register/login" className={BTN_SECONDARY}>
          Back
        </Link>
        <button type="submit" className={BTN_PRIMARY} disabled={checking}>
          {checking ? "Checking…" : "Next"}
        </button>
      </div>
    </form>
  );
}

// ---- Step 2: Basic info (MLH-required core) ----

const GENDERS = [
  "Man",
  "Woman",
  "Non-Binary",
  "Prefer to self-describe",
  "Prefer not to answer",
];
const ETHNICITIES = [
  "American Indian or Alaskan Native",
  "Asian / Pacific Islander",
  "Black or African American",
  "Hispanic",
  "White / Caucasian",
  "Multiple ethnicity / Other",
  "Prefer not to answer",
];
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const YEARS = ["2026", "2027", "2028", "2029", "2030", "2031"];

type StepProfileProps = {
  first_name: string;
  setFirst_name: (v: string) => void;
  last_name: string;
  setLast_name: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  ethnicity: string;
  setEthnicity: (v: string) => void;
  phone_number: string;
  setPhone_number: (v: string) => void;
  school: string;
  setSchool: (v: string) => void;
  otherSchool: string;
  setOtherSchool: (v: string) => void;
  major: string;
  setMajor: (v: string) => void;
  grad: string;
  setGrad: (v: string) => void;
  grad_month: string;
  setGrad_month: (v: string) => void;
  grad_year: string;
  setGrad_year: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  errorMsg: string;
  onNext: () => void;
  onBack: () => void;
};

function StepProfile({
  first_name,
  setFirst_name,
  last_name,
  setLast_name,
  age,
  setAge,
  gender,
  setGender,
  ethnicity,
  setEthnicity,
  phone_number,
  setPhone_number,
  school,
  setSchool,
  otherSchool,
  setOtherSchool,
  major,
  setMajor,
  grad,
  setGrad,
  grad_month,
  setGrad_month,
  grad_year,
  setGrad_year,
  country,
  setCountry,
  errorMsg,
  onNext,
  onBack,
}: StepProfileProps) {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="First name">
          <input
            type="text"
            placeholder="First name"
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
            className={INPUT_CLS}
          />
        </Field>
        <Field label="Last name">
          <input
            type="text"
            placeholder="Last name"
            value={last_name}
            onChange={(e) => setLast_name(e.target.value)}
            className={INPUT_CLS}
          />
        </Field>
      </div>

      <Field label="Age">
        <Select value={age} onChange={setAge} options={AGES} />
      </Field>

      <Field label="Phone number">
        <input
          type="tel"
          placeholder="+1 555 000 0000"
          value={phone_number}
          onChange={(e) => setPhone_number(e.target.value)}
          className={INPUT_CLS}
        />
      </Field>

      <Field label="School">
        <Combobox
          value={school}
          onChange={setSchool}
          loadOptions={loadSchools}
          placeholder="Start typing your school…"
        />
      </Field>
      {school === OTHER_SCHOOL && (
        <Field label="School name">
          <input
            type="text"
            placeholder="Enter your school"
            value={otherSchool}
            onChange={(e) => setOtherSchool(e.target.value)}
            className={INPUT_CLS}
          />
        </Field>
      )}

      <Field label="Level of study">
        <Select value={grad} onChange={setGrad} options={LEVELS_OF_STUDY} />
      </Field>

      <div className="grid grid-cols-2 gap-5">
        <Field label="Graduation month">
          <Select
            value={grad_month}
            onChange={setGrad_month}
            options={MONTHS}
          />
        </Field>
        <Field label="Graduation year">
          <Select value={grad_year} onChange={setGrad_year} options={YEARS} />
        </Field>
      </div>

      <Field label="Country of residence">
        <Combobox
          value={country}
          onChange={setCountry}
          options={COUNTRIES}
          placeholder="Start typing your country…"
        />
      </Field>

      <Field label="Field of study">
        <Select value={major} onChange={setMajor} options={MAJORS} />
      </Field>

      <Field label="Gender">
        <Select value={gender} onChange={setGender} options={GENDERS} />
      </Field>

      <Field label="Race / ethnicity">
        <Select
          value={ethnicity}
          onChange={setEthnicity}
          options={ETHNICITIES}
        />
      </Field>

      <ErrorNote msg={errorMsg} />
      <div className="mt-1 flex items-center justify-between">
        <button type="button" className={BTN_SECONDARY} onClick={onBack}>
          Back
        </button>
        <button type="submit" className={BTN_PRIMARY}>
          Next
        </button>
      </div>
    </form>
  );
}

// ---- Step 3: Additional info + agreements ----

const openLink = (url: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  window.open(url, "_blank");
};

const S3_IMG = (path: string) =>
  `https://hophacks-website.s3.amazonaws.com/images/${path}`;

const HOW_OPTIONS = [
  "Instagram",
  "Facebook",
  "Linkedin",
  "Google",
  "Major League Hacking",
  "Email Listerv",
  "Friend",
  "On Campus Flyers",
  "In Class Promotion",
  "Other",
];

const YES_NO = ["Yes", "No"];

type StepChecksProps = {
  first_hackathon: string;
  setFirst_hackathon: (v: string) => void;
  first_hophacks: string;
  setFirst_hophacks: (v: string) => void;
  learn_about_us: string;
  setLearn_about_us: (v: string) => void;
  pronouns: string;
  setPronouns: (v: string) => void;
  dietary: string;
  setDietary: (v: string) => void;
  dietaryOther: string;
  setDietaryOther: (v: string) => void;
  tshirt: string;
  setTshirt: (v: string) => void;
  underrepresented: string;
  setUnderrepresented: (v: string) => void;
  linkedIn: string;
  setLinkedIn: (v: string) => void;
  essayProject: string;
  setEssayProject: (v: string) => void;
  essayTeam: string;
  setEssayTeam: (v: string) => void;
  resumeFile: File | null;
  setResumeFile: (f: File | null) => void;
  resumeChecked: boolean;
  setResumeChecked: (v: boolean) => void;
  conductCodeChecked: boolean;
  setConductCodeChecked: (v: boolean) => void;
  eventLogisticsChecked: boolean;
  setEventLogisticsChecked: (v: boolean) => void;
  communicationChecked: boolean;
  setCommunicationChecked: (v: boolean) => void;
  errorMsg: string;
  onNext: () => void;
  onBack: () => void;
};

function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/20 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[#ffb51f]"
      />
      <span className="text-sm leading-relaxed text-white">{children}</span>
    </label>
  );
}

function StepChecks({
  first_hackathon,
  setFirst_hackathon,
  first_hophacks,
  setFirst_hophacks,
  learn_about_us,
  setLearn_about_us,
  pronouns,
  setPronouns,
  dietary,
  setDietary,
  dietaryOther,
  setDietaryOther,
  tshirt,
  setTshirt,
  underrepresented,
  setUnderrepresented,
  linkedIn,
  setLinkedIn,
  essayProject,
  setEssayProject,
  essayTeam,
  setEssayTeam,
  resumeFile,
  setResumeFile,
  resumeChecked,
  setResumeChecked,
  conductCodeChecked,
  setConductCodeChecked,
  eventLogisticsChecked,
  setEventLogisticsChecked,
  communicationChecked,
  setCommunicationChecked,
  errorMsg,
  onNext,
  onBack,
}: StepChecksProps) {
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="flex flex-col gap-5">
        <SectionTitle>About you</SectionTitle>
        <Field label="Is this your first hackathon?">
          <Select
            value={first_hackathon}
            onChange={setFirst_hackathon}
            options={YES_NO}
          />
        </Field>
        <Field label="Is this your first time at HopHacks?">
          <Select
            value={first_hophacks}
            onChange={setFirst_hophacks}
            options={YES_NO}
          />
        </Field>
        <Field label="How did you hear about us?">
          <Select
            value={learn_about_us}
            onChange={setLearn_about_us}
            options={HOW_OPTIONS}
          />
        </Field>
        <Field label="LinkedIn profile URL">
          <input
            type="url"
            placeholder="https://linkedin.com/in/you"
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.target.value)}
            className={INPUT_CLS}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-5">
        <SectionTitle>Application questions</SectionTitle>
        <p className="-mt-2 text-sm text-white/75">
          Both questions are required. Responses are capped at{" "}
          {ESSAY_WORD_LIMIT} words each.
        </p>
        <Field label="Share a project, technical or not, that you're genuinely proud of. What was the hardest decision you made, and why did you make it that way?">
          <>
            <textarea
              value={essayProject}
              onChange={(e) => setEssayProject(e.target.value)}
              className={INPUT_CLS + " min-h-[140px] resize-y"}
              placeholder="Your answer…"
              rows={6}
            />
            <span
              className={`text-xs ${wordCount(essayProject) > ESSAY_WORD_LIMIT ? "text-red-300" : "text-white/60"}`}
            >
              {wordCount(essayProject)} / {ESSAY_WORD_LIMIT} words
            </span>
          </>
        </Field>
        <Field label="Tell us about a time you worked in a team. What role did you play, and what were your strengths and weaknesses?">
          <>
            <textarea
              value={essayTeam}
              onChange={(e) => setEssayTeam(e.target.value)}
              className={INPUT_CLS + " min-h-[140px] resize-y"}
              placeholder="Your answer…"
              rows={6}
            />
            <span
              className={`text-xs ${wordCount(essayTeam) > ESSAY_WORD_LIMIT ? "text-red-300" : "text-white/60"}`}
            >
              {wordCount(essayTeam)} / {ESSAY_WORD_LIMIT} words
            </span>
          </>
        </Field>
      </div>

      <div className="flex flex-col gap-5">
        <SectionTitle>Logistics</SectionTitle>
        <Field label="Dietary restrictions">
          <Select
            value={dietary}
            onChange={(v) => {
              setDietary(v);
              if (v !== "Other") setDietaryOther("");
            }}
            options={DIETARY}
          />
        </Field>
        {dietary === "Other" && (
          <Field label="Please describe your dietary restriction">
            <input
              type="text"
              placeholder="E.g. gluten-free, nut allergy…"
              value={dietaryOther}
              onChange={(e) => setDietaryOther(e.target.value)}
              className={INPUT_CLS}
            />
          </Field>
        )}
        <Field label="T-shirt size">
          <Select value={tshirt} onChange={setTshirt} options={TSHIRT_SIZES} />
        </Field>
      </div>

      <div className="flex flex-col gap-5">
        <SectionTitle>A little more about you</SectionTitle>
        <p className="-mt-2 text-sm text-white/75">
          These are optional — answer only what you&apos;re comfortable with.
        </p>
        <Field label="Pronouns" optional>
          <Select value={pronouns} onChange={setPronouns} options={PRONOUNS} />
        </Field>
        <Field
          label="Do you identify as part of an underrepresented group in tech?"
          optional
        >
          <Select
            value={underrepresented}
            onChange={setUnderrepresented}
            options={UNDERREPRESENTED}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <SectionTitle>Resume</SectionTitle>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
          />
          <span className="inline-block rounded-lg bg-white px-4 py-2 font-semibold text-[#2a4785] transition-colors hover:bg-gray-100">
            Upload resume (PDF/DOC)
          </span>
          {resumeFile && (
            <span className="ml-3 text-sm text-white">{resumeFile.name}</span>
          )}
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle>Agreements</SectionTitle>
        <Check checked={resumeChecked} onChange={setResumeChecked}>
          I authorize HopHacks to send my resume to our event sponsors for
          recruiting purposes. I also consent to this{" "}
          <a
            href={S3_IMG("JHU_Photo-and-Video-Release_20192.pdf")}
            onClick={openLink(S3_IMG("JHU_Photo-and-Video-Release_20192.pdf"))}
            className="underline hover:text-white/80"
          >
            photo release form
          </a>
          .
        </Check>
        <Check checked={conductCodeChecked} onChange={setConductCodeChecked}>
          I have read and agree to the{" "}
          <a
            href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
            onClick={openLink(
              "https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md",
            )}
            className="underline hover:text-white/80"
          >
            MLH Code of Conduct
          </a>
          .
        </Check>
        <Check
          checked={eventLogisticsChecked}
          onChange={setEventLogisticsChecked}
        >
          I authorize you to share my application/registration information with
          Major League Hacking for event administration, ranking, and MLH
          administration in line with the{" "}
          <a
            href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
            onClick={openLink(
              "https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md",
            )}
            className="underline hover:text-white/80"
          >
            MLH Privacy Policy
          </a>
          . I further agree to the terms of both the{" "}
          <a
            href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
            onClick={openLink(
              "https://github.com/MLH/mlh-policies/blob/main/contest-terms.md",
            )}
            className="underline hover:text-white/80"
          >
            MLH Contest Terms and Conditions
          </a>{" "}
          and the MLH Privacy Policy.
        </Check>
        <Check
          checked={communicationChecked}
          onChange={setCommunicationChecked}
        >
          (Optional) I authorize MLH to send me occasional emails about relevant
          events, career opportunities, and community announcements.
        </Check>
      </div>

      <ErrorNote msg={errorMsg} />
      <div className="mt-1 flex items-center justify-between">
        <button type="button" className={BTN_SECONDARY} onClick={onBack}>
          Back
        </button>
        <button type="submit" className={BTN_PRIMARY}>
          Next
        </button>
      </div>
    </form>
  );
}

// ---- Step 4: Avatar builder ----

const AVATAR_CATEGORIES = {
  stage: { range: [0, 2] as [number, number] },
  accessory: { range: [0, 8] as [number, number] },
  object: { range: [0, 6] as [number, number] },
} as const;

const COLOR_CATEGORIES = {
  Body: {
    colors: ["#313079", "#2a4785", "#417b9f", "#6a9bd6", "#8db8ef"],
    range: [1, 5] as [number, number],
  },
  Accent: {
    colors: ["#c44c82", "#644e7a", "#a9bf79", "#dfc186", "#d9784c", "#dd505a"],
    range: [1, 6] as [number, number],
  },
} as const;

type ColorCategory = keyof typeof COLOR_CATEGORIES;
type AvatarCategory = keyof typeof AVATAR_CATEGORIES;

function ColorPicker({
  onSelect,
  colors,
  category,
}: {
  onSelect: (i: number) => void;
  colors: readonly string[];
  category: ColorCategory;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {colors.map((color, index) => (
        <div
          key={color}
          className="h-7 w-7 cursor-pointer rounded-full border-2 border-white/30 transition-colors hover:border-white"
          style={{ backgroundColor: color }}
          onClick={() => onSelect(index + 1)}
        />
      ))}
      {category === "Accent" && (
        <div
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white/30 text-xs text-white hover:border-white"
          onClick={() => onSelect(0)}
        >
          ×
        </div>
      )}
    </div>
  );
}

function ScrollSelect({
  selected,
  setSelected,
  category,
}: {
  selected: number;
  setSelected: (v: number) => void;
  category: AvatarCategory;
}) {
  const { range } = AVATAR_CATEGORIES[category];

  const handleIncrement = () =>
    setSelected(selected >= range[1] ? range[0] : selected + 1);
  const handleDecrement = () =>
    setSelected(selected <= range[0] ? range[1] : selected - 1);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <p className="pb-3 font-bold capitalize text-white">{category}</p>
      <div className="flex flex-col items-center">
        <button type="button" onClick={handleIncrement} className="w-8 pb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/select-arrow.svg"
            className="h-auto max-h-full w-full object-contain"
            alt="increment"
          />
        </button>
        <button type="button" onClick={handleDecrement} className="w-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/select-arrow.svg"
            className="h-auto max-h-full w-full rotate-180 object-contain"
            alt="decrement"
          />
        </button>
      </div>
    </div>
  );
}

type StepImageProps = {
  stage: number;
  setStage: (v: number) => void;
  body: number;
  setBody: (v: number) => void;
  accent: number;
  setAccent: (v: number) => void;
  accessory: number;
  setAccessory: (v: number) => void;
  object: number;
  setObject: (v: number) => void;
  errorMsg: string;
  submitting: boolean;
  onNext: () => void;
  onBack: () => void;
};

function StepImage({
  stage,
  setStage,
  body,
  setBody,
  accent,
  setAccent,
  accessory,
  setAccessory,
  object,
  setObject,
  errorMsg,
  submitting,
  onNext,
  onBack,
}: StepImageProps) {
  const [colorSelector, setColorSelector] = useState<ColorCategory>("Body");

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <p className="text-center text-lg font-bold text-white">
        Customize your blue jay!
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-full w-full object-contain"
            src={`https://hophacks-website.s3.us-east-1.amazonaws.com/pfps/${stage}_${body}_1_${accent}_${accessory}_${object}.png`}
            alt="Profile avatar"
          />
        </div>
        <div className="flex flex-col justify-center gap-5">
          <div className="flex justify-center gap-2">
            {(["Body", "Accent"] as ColorCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`flex-1 rounded-lg py-2 font-semibold text-white transition ${
                  colorSelector === cat
                    ? "bg-recap-gold"
                    : "bg-white/20 hover:bg-white/30"
                }`}
                onClick={() => setColorSelector(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <ColorPicker
            onSelect={colorSelector === "Body" ? setBody : setAccent}
            colors={COLOR_CATEGORIES[colorSelector].colors}
            category={colorSelector}
          />
          <div className="grid grid-cols-3 gap-4">
            <ScrollSelect
              selected={stage}
              setSelected={setStage}
              category="stage"
            />
            <ScrollSelect
              selected={accessory}
              setSelected={setAccessory}
              category="accessory"
            />
            <ScrollSelect
              selected={object}
              setSelected={setObject}
              category="object"
            />
          </div>
        </div>
      </div>
      <ErrorNote msg={errorMsg} />
      <div className="mt-1 flex items-center justify-between">
        <button
          type="button"
          className={BTN_SECONDARY}
          onClick={onBack}
          disabled={submitting}
        >
          Back
        </button>
        <button type="submit" className={BTN_PRIMARY} disabled={submitting}>
          {submitting ? "Creating account…" : "Finish"}
        </button>
      </div>
    </form>
  );
}

// ---- Step 5: Confirmation ----

function StepConfirmation({ resumeFailed }: { resumeFailed: boolean }) {
  return (
    <div
      role="status"
      className="flex w-full flex-col items-center justify-center gap-6 py-4 text-center motion-safe:animate-pop"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-recap-gold text-4xl text-white shadow-[0_0_30px_rgba(255,181,31,0.45)]">
        ✓
      </div>
      <p className="text-xl font-bold text-white">
        Application submitted! Check your email to confirm your address and
        complete the process.
      </p>
      {resumeFailed && (
        <p className="rounded-lg border border-red-300/40 bg-red-500/25 px-4 py-2 text-sm text-white">
          Your resume didn't upload — please re-add it from your profile.
        </p>
      )}
      <Link href="/profile" className={BTN_PRIMARY}>
        Go to My Profile
      </Link>
    </div>
  );
}

// ---- Main page ----

const ACCOUNT = 0;
const PROFILE = 1;
const CHECKS = 2;
const IMAGE = 3;
const CONFIRMATION = 4;

export default function SignUpPage() {
  const { login, isLoggedIn } = useAuth();

  const [activePage, setActivePage] = useState(ACCOUNT);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFailed, setResumeFailed] = useState(false);

  // Account
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");

  // Profile
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [school, setSchool] = useState("");
  const [otherSchool, setOtherSchool] = useState("");
  const [major, setMajor] = useState("");
  const [grad, setGrad] = useState("");
  const [grad_month, setGrad_month] = useState("");
  const [grad_year, setGrad_year] = useState("");
  const [country, setCountry] = useState("");

  // Checks
  const [first_hackathon, setFirst_hackathon] = useState("");
  const [first_hophacks, setFirst_hophacks] = useState("");
  const [learn_about_us, setLearn_about_us] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [dietary, setDietary] = useState("");
  const [dietaryOther, setDietaryOther] = useState("");
  const [tshirt, setTshirt] = useState("");
  const [underrepresented, setUnderrepresented] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [essayProject, setEssayProject] = useState("");
  const [essayTeam, setEssayTeam] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeChecked, setResumeChecked] = useState(false);
  const [conductCodeChecked, setConductCodeChecked] = useState(false);
  const [eventLogisticsChecked, setEventLogisticsChecked] = useState(false);
  const [communicationChecked, setCommunicationChecked] = useState(false);

  // Image (avatar)
  const [stage, setStage] = useState(0);
  const [body, setBody] = useState(1);
  const [accent, setAccent] = useState(0);
  const [accessory, setAccessory] = useState(0);
  const [avatarObject, setAvatarObject] = useState(0);

  // Shared error message
  const [errorMsg, setErrorMsg] = useState("");

  // ---- Step handlers ----

  async function handleAccountNext() {
    // Trim before validating: pasted emails (mobile autocomplete) often
    // carry a trailing space, and the backend trims on its side too.
    const email = username.trim();
    if (email !== username) setUsername(email);
    if (!email || !password || !passwordConfirm) {
      setConfirmMsg("* Required field cannot be empty");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setConfirmMsg("Please enter a valid email address.");
      return;
    }
    if (!PASSWORD_RE.test(password)) {
      setConfirmMsg(
        "Please enter a password between 8 and 25 characters, using letters, numbers, and the special characters !@#$%^&*)(+=._- with at least one number and one special character.",
      );
      return;
    }
    if (password !== passwordConfirm) {
      setConfirmMsg("Confirm password must match with the password.");
      return;
    }
    setChecking(true);
    try {
      const response = await axios.get(
        `/api/accounts/check/${encodeURIComponent(email)}`,
      );
      if (response.data.exist) {
        setConfirmMsg("Email is already in use.");
        return;
      }
    } catch {
      // If the check fails, allow proceeding; the create endpoint will catch duplicates.
    } finally {
      setChecking(false);
    }
    setConfirmMsg("");
    setErrorMsg("");
    setActivePage(PROFILE);
  }

  function handleProfileNext() {
    if (!first_name) {
      setErrorMsg("* Please enter a valid first name.");
      return;
    }
    if (!last_name) {
      setErrorMsg("* Please enter a valid last name.");
      return;
    }
    if (!age) {
      setErrorMsg("* Please select your age.");
      return;
    }
    if (!gender) {
      setErrorMsg("* Please select a gender.");
      return;
    }
    if (!major) {
      setErrorMsg("* Please select your field of study.");
      return;
    }
    if (!country) {
      setErrorMsg("* Please enter your country.");
      return;
    }
    if (!school) {
      setErrorMsg("* Please enter your school.");
      return;
    }
    if (school === OTHER_SCHOOL && !otherSchool) {
      setErrorMsg("* Please enter your school name.");
      return;
    }
    if (!ethnicity) {
      setErrorMsg("* Please select a race / ethnicity.");
      return;
    }
    const phoneErr = phone_number
      ? validatePhone(phone_number)
      : "* Please enter a valid phone number.";
    if (phoneErr) {
      setErrorMsg(phoneErr);
      return;
    }
    if (!grad) {
      setErrorMsg("* Please select your level of study.");
      return;
    }
    if (!grad_month) {
      setErrorMsg("* Please select a valid graduation month.");
      return;
    }
    if (!grad_year) {
      setErrorMsg("* Please select a valid graduation year.");
      return;
    }
    setErrorMsg("");
    setActivePage(CHECKS);
  }

  function handleChecksNext() {
    if (!first_hackathon) {
      setErrorMsg("* Please select if this is your first hackathon.");
      return;
    }
    if (!first_hophacks) {
      setErrorMsg("* Please select if this is your first time at HopHacks.");
      return;
    }
    if (!learn_about_us) {
      setErrorMsg("* Please select how you heard about us.");
      return;
    }
    const linkedInErr = linkedIn
      ? validateLinkedIn(linkedIn)
      : "* Please enter your LinkedIn profile url.";
    if (linkedInErr) {
      setErrorMsg(linkedInErr);
      return;
    }
    if (!essayProject.trim()) {
      setErrorMsg("* Please answer the first application question.");
      return;
    }
    if (wordCount(essayProject) > ESSAY_WORD_LIMIT) {
      setErrorMsg(`* First answer must be ${ESSAY_WORD_LIMIT} words or fewer.`);
      return;
    }
    if (!essayTeam.trim()) {
      setErrorMsg("* Please answer the second application question.");
      return;
    }
    if (wordCount(essayTeam) > ESSAY_WORD_LIMIT) {
      setErrorMsg(
        `* Second answer must be ${ESSAY_WORD_LIMIT} words or fewer.`,
      );
      return;
    }
    if (!dietary) {
      setErrorMsg("* Please select your dietary restrictions.");
      return;
    }
    if (dietary === "Other" && !dietaryOther.trim()) {
      setErrorMsg("* Please describe your dietary restriction.");
      return;
    }
    if (!tshirt) {
      setErrorMsg("* Please select your t-shirt size.");
      return;
    }
    if (!resumeChecked || !resumeFile) {
      setErrorMsg("* Please upload your resume and agree to the terms.");
      return;
    }
    if (!conductCodeChecked) {
      setErrorMsg("* Please read the MLH Code of Conduct.");
      return;
    }
    if (!eventLogisticsChecked) {
      setErrorMsg(
        "* Please read the MLH Terms and Conditions and Privacy Policy.",
      );
      return;
    }
    setErrorMsg("");
    setActivePage(IMAGE);
  }

  async function handleImageNext() {
    const profile = {
      first_name,
      last_name,
      age,
      phone_number,
      school,
      otherSchool: school === OTHER_SCHOOL ? otherSchool : "",
      level_of_study: grad,
      country,
      gender,
      race_ethnicity: ethnicity,
      major,
      grad_month,
      grad_year,
      is_jhu: isJhuSchool(school),
      pronouns,
      dietary_restrictions: dietary,
      dietary_restrictions_other: dietary === "Other" ? dietaryOther : "",
      tshirt_size: tshirt,
      underrepresented_group: underrepresented,
      first_hackathon,
      first_hophacks,
      learn_about_us,
      linkedin_url: linkedIn,
      essay_project: essayProject,
      essay_team: essayTeam,
      pfp: `${stage}_${body}_1_${accent}_${accessory}_${avatarObject}`,
      mlh_code_of_conduct: conductCodeChecked,
      mlh_data_sharing: eventLogisticsChecked,
      mlh_marketing_emails: communicationChecked,
      resume_photo_release: resumeChecked,
    };

    try {
      setSubmitting(true);
      await axios.post("/api/accounts/create", {
        username,
        password,
        confirm_url: `${window.location.protocol}//${window.location.host}/confirm_email`,
        profile,
      });

      try {
        await login(username, password);
        if (resumeFile) {
          const resumeData = new FormData();
          resumeData.append("file", resumeFile);
          await axios.post("/api/resumes/", resumeData);
        }
      } catch {
        // The account exists either way, so don't block signup — but the
        // resume never reached the server; tell the user to re-add it.
        if (resumeFile) setResumeFailed(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // Retrying can never succeed here: the account already exists, or a
        // lost response means an earlier attempt did go through. Point the
        // user at the Sign in link under the card instead.
        setErrorMsg(
          "This email is already registered. Use the Sign in link below to log in instead.",
        );
      } else if (
        axios.isAxiosError(error) &&
        typeof error.response?.data === "string" &&
        error.response.data
      ) {
        setErrorMsg(error.response.data);
      } else {
        setErrorMsg("Error creating account. Please try again.");
      }
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setErrorMsg("");
    setActivePage(CONFIRMATION);
  }

  const isConfirmation = activePage === CONFIRMATION;

  // A logged-in user already has an account — hide the wizard so accounts
  // can't be double-registered. The confirmation step stays reachable
  // because signup logs the user in right before showing it.
  if (isLoggedIn && !isConfirmation) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center px-4 pb-10 pt-28 sm:py-14">
        <h1 className="text-center font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-white text-shadow-hero-title">
          You&apos;ve already applied
        </h1>
        <p className="mb-8 mt-1 text-center text-white/90">
          Fall 2026 · Johns Hopkins University
        </p>
        <Link href="/profile" className={BTN_PRIMARY}>
          My Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center px-4 pb-10 pt-28 sm:py-14">
      <h1 className="text-center font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-white text-shadow-hero-title">
        {isConfirmation ? "Welcome to HopHacks!" : "Apply to HopHacks"}
      </h1>
      <p className="mb-8 mt-1 text-center text-white/90">
        Fall 2026 · Johns Hopkins University
      </p>

      {!isConfirmation && <StepProgress current={activePage} />}

      <div className="w-full max-w-2xl">
        <div className={CARD_CLS}>
          {activePage === ACCOUNT && (
            <StepAccount
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              passwordConfirm={passwordConfirm}
              setPasswordConfirm={setPasswordConfirm}
              confirmMsg={confirmMsg}
              checking={checking}
              onNext={handleAccountNext}
            />
          )}
          {activePage === PROFILE && (
            <StepProfile
              first_name={first_name}
              setFirst_name={setFirst_name}
              last_name={last_name}
              setLast_name={setLast_name}
              age={age}
              setAge={setAge}
              gender={gender}
              setGender={setGender}
              ethnicity={ethnicity}
              setEthnicity={setEthnicity}
              phone_number={phone_number}
              setPhone_number={setPhone_number}
              school={school}
              setSchool={setSchool}
              otherSchool={otherSchool}
              setOtherSchool={setOtherSchool}
              major={major}
              setMajor={setMajor}
              grad={grad}
              setGrad={setGrad}
              grad_month={grad_month}
              setGrad_month={setGrad_month}
              grad_year={grad_year}
              setGrad_year={setGrad_year}
              country={country}
              setCountry={setCountry}
              errorMsg={errorMsg}
              onNext={handleProfileNext}
              onBack={() => {
                setErrorMsg("");
                setActivePage(ACCOUNT);
              }}
            />
          )}
          {activePage === CHECKS && (
            <StepChecks
              first_hackathon={first_hackathon}
              setFirst_hackathon={setFirst_hackathon}
              first_hophacks={first_hophacks}
              setFirst_hophacks={setFirst_hophacks}
              learn_about_us={learn_about_us}
              setLearn_about_us={setLearn_about_us}
              pronouns={pronouns}
              setPronouns={setPronouns}
              dietary={dietary}
              setDietary={setDietary}
              dietaryOther={dietaryOther}
              setDietaryOther={setDietaryOther}
              tshirt={tshirt}
              setTshirt={setTshirt}
              underrepresented={underrepresented}
              setUnderrepresented={setUnderrepresented}
              linkedIn={linkedIn}
              setLinkedIn={setLinkedIn}
              essayProject={essayProject}
              setEssayProject={setEssayProject}
              essayTeam={essayTeam}
              setEssayTeam={setEssayTeam}
              resumeFile={resumeFile}
              setResumeFile={setResumeFile}
              resumeChecked={resumeChecked}
              setResumeChecked={setResumeChecked}
              conductCodeChecked={conductCodeChecked}
              setConductCodeChecked={setConductCodeChecked}
              eventLogisticsChecked={eventLogisticsChecked}
              setEventLogisticsChecked={setEventLogisticsChecked}
              communicationChecked={communicationChecked}
              setCommunicationChecked={setCommunicationChecked}
              errorMsg={errorMsg}
              onNext={handleChecksNext}
              onBack={() => {
                setErrorMsg("");
                setActivePage(PROFILE);
              }}
            />
          )}
          {activePage === IMAGE && (
            <StepImage
              stage={stage}
              setStage={setStage}
              body={body}
              setBody={setBody}
              accent={accent}
              setAccent={setAccent}
              accessory={accessory}
              setAccessory={setAccessory}
              object={avatarObject}
              setObject={setAvatarObject}
              errorMsg={errorMsg}
              submitting={submitting}
              onNext={handleImageNext}
              onBack={() => {
                setErrorMsg("");
                setActivePage(CHECKS);
              }}
            />
          )}
          {activePage === CONFIRMATION && (
            <StepConfirmation resumeFailed={resumeFailed} />
          )}
        </div>

        {!isConfirmation && (
          <p className="mt-5 text-center text-sm text-white/85">
            Already have an account?{" "}
            <Link
              href="/register/login"
              className="underline underline-offset-4 hover:text-white"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

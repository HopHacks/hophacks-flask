"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/app/util/auth";

// ---- Shared button/input styles ----

const INPUT_CLS =
  "input-sketch rounded px-3 py-2 w-full";
const BTN_PRIMARY =
  "px-5 py-3 text-xl font-bold rounded-2xl bg-[#ffb51f] text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] transition-shadow duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const BTN_SECONDARY =
  "btn-sketch px-5 py-3 text-xl font-bold rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

// ---- Step 1: Account ----

type StepAccountProps = {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  passwordConfirm: string;
  setPasswordConfirm: (v: string) => void;
  confirmMsg: string;
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
  onNext,
}: StepAccountProps) {
  return (
    <div className="flex flex-col gap-4">
      <p
        className="font-bold text-white text-xl text-center mb-2"
        style={{ fontVariant: "small-caps" }}
      >
        1. Enter Credentials
      </p>
      <input
        type="email"
        placeholder="Email Address"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase())}
        className={INPUT_CLS}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={INPUT_CLS}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        className={INPUT_CLS}
        required
      />
      {confirmMsg && <p className="text-red-400 text-sm">{confirmMsg}</p>}
      <div className="flex justify-between mt-2">
        <Link href="/register/login" className={BTN_SECONDARY}>
          Back
        </Link>
        <button type="button" className={BTN_PRIMARY} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}

// ---- Step 2: Profile ----

const GENDERS = [
  "Male",
  "Female",
  "Non-Binary",
  "Transgender",
  "Intersex",
  "Not listed",
  "Prefer not to disclose",
];
const ETHNICITIES = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic, Latino or Spanish Origin",
  "Middle Eastern or North African",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Multiethnic",
  "Prefer not to disclose",
];
const GRAD_LEVELS = [
  "Undergraduate University (2 year - community college or similar)",
  "Undergraduate University (3+ year)",
  "Graduate University (Masters, Professional, Doctoral, etc)",
  "Code School / Bootcamp",
  "Other Vocational / Trade Program or Apprenticeship",
  "Post Doctorate",
  "Other",
];
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const YEARS = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

type StepProfileProps = {
  setFirst_name: (v: string) => void;
  setLast_name: (v: string) => void;
  setAge: (v: string) => void;
  setGender: (v: string) => void;
  setEthnicity: (v: string) => void;
  setPhone_number: (v: string) => void;
  school: string;
  setSchool: (v: string) => void;
  major: string;
  setMajor: (v: string) => void;
  setGrad: (v: string) => void;
  setGrad_month: (v: string) => void;
  setGrad_year: (v: string) => void;
  setCountry: (v: string) => void;
  errorMsg: string;
  onNext: () => void;
  onBack: () => void;
};

function StepProfile({
  setFirst_name,
  setLast_name,
  setAge,
  setGender,
  setEthnicity,
  setPhone_number,
  school,
  setSchool,
  major,
  setMajor,
  setGrad,
  setGrad_month,
  setGrad_year,
  setCountry,
  errorMsg,
  onNext,
  onBack,
}: StepProfileProps) {
  return (
    <div className="flex flex-col gap-3">
      <p
        className="font-bold text-white text-xl text-center mb-2"
        style={{ fontVariant: "small-caps" }}
      >
        2. Basic Info
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => setFirst_name(e.target.value)}
          className={INPUT_CLS}
        />
        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => setLast_name(e.target.value)}
          className={INPUT_CLS}
        />
        <input
          type="number"
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
          className={INPUT_CLS}
          min={0}
          max={120}
        />
        <select
          defaultValue=""
          onChange={(e) => setGender(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="" disabled>
            Gender
          </option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          defaultValue=""
          onChange={(e) => setEthnicity(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="" disabled>
            Ethnicity
          </option>
          {ETHNICITIES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <input
          type="tel"
          placeholder="Phone Number (e.g. +1 555 000 0000)"
          onChange={(e) => setPhone_number(e.target.value)}
          className={INPUT_CLS}
        />
        <input
          type="text"
          placeholder="School"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className={INPUT_CLS}
        />
        <input
          type="text"
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className={INPUT_CLS}
        />
        <input
          type="text"
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
          className={INPUT_CLS}
        />
        <select
          defaultValue=""
          onChange={(e) => setGrad(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="" disabled>
            Level of Study
          </option>
          {GRAD_LEVELS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          defaultValue=""
          onChange={(e) => setGrad_month(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="" disabled>
            Grad Month
          </option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          defaultValue=""
          onChange={(e) => setGrad_year(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="" disabled>
            Grad Year
          </option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {errorMsg && <p className="text-red-400 text-sm mt-1">{errorMsg}</p>}
      <div className="flex justify-between mt-2">
        <button type="button" className={BTN_SECONDARY} onClick={onBack}>
          Back
        </button>
        <button type="button" className={BTN_PRIMARY} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}

// ---- Step 3: Checks ----

type StepChecksProps = {
  setFirst_hackathon: (v: string) => void;
  setFirst_hophacks: (v: string) => void;
  setLearn_about_us: (v: string) => void;
  setLinkedIn: (v: string) => void;
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

function StepChecks({
  setFirst_hackathon,
  setFirst_hophacks,
  setLearn_about_us,
  setLinkedIn,
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
    <div className="flex flex-col gap-4">
      <p
        className="font-bold text-white text-xl text-center mb-2"
        style={{ fontVariant: "small-caps" }}
      >
        3. Additional Info
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          defaultValue=""
          onChange={(e) => setFirst_hackathon(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="" disabled>
            First hackathon?
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <select
          defaultValue=""
          onChange={(e) => setFirst_hophacks(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="" disabled>
            First HopHacks?
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <select
          defaultValue=""
          onChange={(e) => setLearn_about_us(e.target.value)}
          className={INPUT_CLS}
        >
          <option value="" disabled>
            How did you hear about us?
          </option>
          {HOW_OPTIONS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      <input
        type="url"
        placeholder="LinkedIn Profile URL"
        onChange={(e) => setLinkedIn(e.target.value)}
        className={INPUT_CLS}
      />

      <div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
          />
          <span className="inline-block px-4 py-2 bg-white text-[#061A40] font-semibold rounded cursor-pointer hover:bg-gray-100 transition-colors">
            Upload Resume*
          </span>
          {resumeFile && (
            <span className="ml-3 text-white">{resumeFile.name}</span>
          )}
        </label>
      </div>

      <div className="flex flex-col gap-3 text-white text-sm">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={resumeChecked}
            onChange={(e) => setResumeChecked(e.target.checked)}
            className="mt-1 shrink-0"
          />
          <span>
            * I authorize HopHacks to send my resume to our event sponsors for
            recruiting purposes. I also consent to this{" "}
            <a
              href={S3_IMG("JHU_Photo-and-Video-Release_20192.pdf")}
              onClick={openLink(S3_IMG("JHU_Photo-and-Video-Release_20192.pdf"))}
              className="underline hover:text-blue-300"
            >
              photo release form
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={conductCodeChecked}
            onChange={(e) => setConductCodeChecked(e.target.checked)}
            className="mt-1 shrink-0"
          />
          <span>
            * I have read and understand the{" "}
            <a
              href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
              onClick={openLink(
                "https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md",
              )}
              className="underline hover:text-blue-300"
            >
              MLH Code of Conduct
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={eventLogisticsChecked}
            onChange={(e) => setEventLogisticsChecked(e.target.checked)}
            className="mt-1 shrink-0"
          />
          <span>
            * I authorize you to share my application with MLH for
            administration in line with the{" "}
            <a
              href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
              onClick={openLink(
                "https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md",
              )}
              className="underline hover:text-blue-300"
            >
              MLH Privacy Policy
            </a>
            . I further agree to the{" "}
            <a
              href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
              onClick={openLink(
                "https://github.com/MLH/mlh-policies/blob/main/contest-terms.md",
              )}
              className="underline hover:text-blue-300"
            >
              MLH Terms
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
              onClick={openLink(
                "https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md",
              )}
              className="underline hover:text-blue-300"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={communicationChecked}
            onChange={(e) => setCommunicationChecked(e.target.checked)}
            className="mt-1 shrink-0"
          />
          <span>
            (Optional) I authorize MLH to send me occasional emails about
            relevant events and opportunities.
          </span>
        </label>
      </div>

      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
      <div className="flex justify-between mt-2">
        <button type="button" className={BTN_SECONDARY} onClick={onBack}>
          Back
        </button>
        <button type="button" className={BTN_PRIMARY} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}

// ---- Step 4: Avatar builder (ported from SignUpImage.jsx) ----

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
          className="w-7 h-7 rounded-full cursor-pointer border-2 border-white/30 hover:border-white transition-colors"
          style={{ backgroundColor: color }}
          onClick={() => onSelect(index + 1)}
        />
      ))}
      {category === "Accent" && (
        <div
          className="w-7 h-7 rounded-full cursor-pointer border-2 border-white/30 hover:border-white flex items-center justify-center text-white text-xs"
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
    <div className="flex flex-col items-center justify-center w-full">
      <p className="text-white font-bold pb-3">{category}</p>
      <div className="flex flex-col items-center">
        <button type="button" onClick={handleIncrement} className="w-8 pb-3">
          <img
            src="/images/select-arrow.svg"
            className="w-full h-auto max-h-full object-contain"
            alt="increment"
          />
        </button>
        <button type="button" onClick={handleDecrement} className="w-8">
          <img
            src="/images/select-arrow.svg"
            className="w-full h-auto max-h-full object-contain rotate-180"
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
    <div className="flex flex-col gap-6">
      <div className="w-full bg-[#5997CC] rounded-[40px] p-6 md:p-8 grid grid-rows-[auto_1fr] gap-6 md:gap-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white aspect-square rounded-[24px] flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-contain"
              src={`https://hophacks-website.s3.us-east-1.amazonaws.com/pfps/${stage}_${body}_1_${accent}_${accessory}_${object}.png`}
              alt="Profile avatar"
            />
          </div>
          <div className="flex flex-col justify-between space-y-4 py-2">
            <div className="bg-[rgba(225,233,242,.32)] rounded-lg text-white text-center font-bold text-lg md:text-xl p-3">
              Customize your blue jay!
            </div>
            <div className="flex justify-center gap-2">
              {(["Body", "Accent"] as ColorCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`flex-1 rounded-md text-white font-semibold py-2 transition ${
                    colorSelector === cat
                      ? "bg-[#2885D4]"
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
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ScrollSelect selected={stage} setSelected={setStage} category="stage" />
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
      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
      <div className="flex justify-between">
        <button
          type="button"
          className={BTN_SECONDARY}
          onClick={onBack}
          disabled={submitting}
        >
          Back
        </button>
        <button
          type="button"
          className={BTN_PRIMARY}
          onClick={onNext}
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Next"}
        </button>
      </div>
    </div>
  );
}

// ---- Step 5: Confirmation ----

function StepConfirmation() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-8">
      <p
        className="font-bold text-white text-2xl text-center"
        style={{ fontVariant: "small-caps" }}
      >
        We are excited to have you joining our event! Please go to your profile
        to finish registering and watch your email for confirmation.
      </p>
      <Link
        href="/register/login"
        className={BTN_PRIMARY}
        style={{ fontVariant: "small-caps" }}
      >
        Sign In
      </Link>
    </div>
  );
}

// ---- Validation helpers ----

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE =
  /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;
const AGE_RE = /^[0-9]+$/;

// ---- Main page ----

const ACCOUNT = 0;
const PROFILE = 1;
const CHECKS = 2;
const IMAGE = 3;
const CONFIRMATION = 4;

export default function SignUpPage() {
  const { login } = useAuth();

  const [activePage, setActivePage] = useState(ACCOUNT);
  const [submitting, setSubmitting] = useState(false);

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
  const [major, setMajor] = useState("");
  const [grad, setGrad] = useState("");
  const [grad_month, setGrad_month] = useState("");
  const [grad_year, setGrad_year] = useState("");
  const [country, setCountry] = useState("");

  // Checks
  const [first_hackathon, setFirst_hackathon] = useState("");
  const [first_hophacks, setFirst_hophacks] = useState("");
  const [learn_about_us, setLearn_about_us] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
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
    if (!username || !password || !passwordConfirm) {
      setConfirmMsg("* Required field cannot be empty");
      return;
    }
    if (!EMAIL_RE.test(username)) {
      setConfirmMsg("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.get(`/api/accounts/check/${username}`);
      if (response.data.exist) {
        setConfirmMsg("Email is already in use.");
        return;
      }
    } catch {
      // If the check fails, allow proceeding — the create endpoint will catch duplicates
    }
    if (!PASSWORD_RE.test(password)) {
      setConfirmMsg(
        "Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.",
      );
      return;
    }
    if (password !== passwordConfirm) {
      setConfirmMsg("Confirm password must match with the password.");
      return;
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
    if (!gender) {
      setErrorMsg("* Please select a gender.");
      return;
    }
    if (!major) {
      setErrorMsg("* Please enter your major.");
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
    if (!ethnicity) {
      setErrorMsg("* Please select an ethnicity.");
      return;
    }
    if (!phone_number) {
      setErrorMsg("* Please enter a valid phone number.");
      return;
    }
    if (!grad) {
      setErrorMsg("* Please select a valid graduation program.");
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
    if (!linkedIn) {
      setErrorMsg("* Please enter your LinkedIn profile url.");
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
    if (!AGE_RE.test(age)) {
      setErrorMsg("* Age must be an integer value.");
      return;
    }
    setErrorMsg("");
    setActivePage(IMAGE);
  }

  async function handleImageNext() {
    if (!resumeFile) return;

    const data = new FormData();
    data.append("file", resumeFile);
    data.append(
      "json_file",
      JSON.stringify({
        username,
        password,
        confirm_url: `${window.location.protocol}//${window.location.host}/confirm_email`,
        profile: {
          first_name,
          last_name,
          gender,
          age,
          major,
          phone_number,
          school,
          otherSchool: "",
          ethnicity,
          grad,
          is_jhu: school === "Johns Hopkins University",
          grad_month,
          grad_year,
          mlh_emails: communicationChecked,
          first_hackathon,
          first_hophacks,
          learn_about_us,
          country,
          linkedIn,
          pfp: `${stage}_${body}_1_${accent}_${accessory}_${avatarObject}`,
        },
      }),
    );

    try {
      setSubmitting(true);
      await axios.post("/api/accounts/create", data);

      try {
        await login(username, password);
        const resumeData = new FormData();
        resumeData.append("file", resumeFile);
        await axios.post("/api/resumes/", resumeData);
      } catch {
        // login or resume upload failed — still show confirmation
      }
    } catch {
      setErrorMsg("Error creating account. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setErrorMsg("");
    setActivePage(CONFIRMATION);
  }

  const isConfirmation = activePage === CONFIRMATION;

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10 m-5"
        style={{ backgroundColor: "rgba(0, 29, 76, 0.9)" }}
      >
        <h2
          className="font-bold text-white text-5xl text-center mb-3"
          style={{ fontVariant: "small-caps" }}
        >
          {isConfirmation ? "Profile Created" : "Create Your Profile"}
        </h2>

        {activePage === ACCOUNT && (
          <StepAccount
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
            confirmMsg={confirmMsg}
            onNext={handleAccountNext}
          />
        )}
        {activePage === PROFILE && (
          <StepProfile
            setFirst_name={setFirst_name}
            setLast_name={setLast_name}
            setAge={setAge}
            setGender={setGender}
            setEthnicity={setEthnicity}
            setPhone_number={setPhone_number}
            school={school}
            setSchool={setSchool}
            major={major}
            setMajor={setMajor}
            setGrad={setGrad}
            setGrad_month={setGrad_month}
            setGrad_year={setGrad_year}
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
            setFirst_hackathon={setFirst_hackathon}
            setFirst_hophacks={setFirst_hophacks}
            setLearn_about_us={setLearn_about_us}
            setLinkedIn={setLinkedIn}
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
        {activePage === CONFIRMATION && <StepConfirmation />}
      </div>
    </div>
  );
}

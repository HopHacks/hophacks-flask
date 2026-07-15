/**
 * Single source of truth for the profile form: field definitions, option
 * lists, validation, and (de)serialization to the API's profile object.
 *
 * The profile document shape follows the 2026 registration flow — see the
 * payload built in `app/register/signup/page.tsx` (`handleImageNext`) and
 * `profile_keys` in `api/src/accounts.py`. The backend requires
 * `first_name, last_name, age, phone_number, school, level_of_study,
 * country`; everything else is stored verbatim when present. Option lists
 * are imported from the signup flow's shared data files so both forms stay
 * in sync.
 */

import {
  AGES,
  LEVELS_OF_STUDY,
  RACES,
  MAJORS,
  GENDERS,
  PRONOUNS,
  DIETARY,
  UNDERREPRESENTED,
  TSHIRT_SIZES,
} from "@/app/register/signup/data/options";
import COUNTRIES from "@/app/register/signup/data/countries";
import SCHOOLS from "@/app/register/signup/data/schools.json";

export const JHU_SCHOOL_NAME = "Johns Hopkins University";

/** Sentinel the signup flow stores in `school` when the school isn't listed
 * (the real name then lives in `otherSchool`). Must match signup's value. */
export const OTHER_SCHOOL = "Other (not listed)";

/**
 * Trimmed, case-insensitive so hand-typed variants ("johns hopkins
 * university") still count; picking from the autocomplete stores the
 * canonical `JHU_SCHOOL_NAME` string.
 */
export function isJhuSchool(school: string): boolean {
  return school.trim().toLowerCase() === JHU_SCHOOL_NAME.toLowerCase();
}

// ---- Option lists not shared via signup's data files (signup defines these
// inline; values must match what signup stores) ----

const GRAD_MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);

const GRAD_YEARS = ["2026", "2027", "2028", "2029", "2030", "2031"];

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

// ---- Field-level validators ----

function validatePhone(value: string): string | null {
  // Lenient E.164-ish check (7-15 digits, optional +/spacing/punctuation).
  // The legacy frontend used react-phone-number-input's isValidPhoneNumber;
  // swap that in here if stricter validation is wanted.
  const digits = value.replace(/\D/g, "");
  const wellFormed = /^\+?[\d\s().-]+$/.test(value.trim());
  if (!wellFormed || digits.length < 7 || digits.length > 15) {
    return "* Please enter a valid phone number.";
  }
  return null;
}

function validateLinkedIn(value: string): string | null {
  const v = value.trim();
  if (/\s/.test(v) || !v.includes(".")) {
    return "* Please enter a valid LinkedIn URL.";
  }
  return null;
}

// ---- Field definitions ----

export type ProfileFieldType =
  | "text"
  | "tel"
  | "url"
  | "select"
  | "autocomplete";

export interface ProfileFieldDef {
  /** Key in the Mongo profile object (and in form state). */
  key: string;
  label: string;
  type: ProfileFieldType;
  options?: readonly string[];
  /** Error shown when the field is empty. Omit to make the field optional. */
  requiredMsg?: string;
  validate?: (value: string) => string | null;
  /** Span both columns of the form grid. */
  fullWidth?: boolean;
  /** Render (and validate) only when this returns true. */
  showIf?: (values: Record<string, string>) => boolean;
}

export const PROFILE_FIELDS = [
  {
    key: "first_name",
    label: "First Name",
    type: "text",
    requiredMsg: "* Please enter a valid first name.",
  },
  {
    key: "last_name",
    label: "Last Name",
    type: "text",
    requiredMsg: "* Please enter a valid last name.",
  },
  {
    key: "age",
    label: "Age",
    type: "select",
    options: AGES,
    requiredMsg: "* Please select your age.",
  },
  {
    key: "phone_number",
    label: "Phone Number",
    type: "tel",
    requiredMsg: "* Please enter a valid phone number.",
    validate: validatePhone,
  },
  {
    key: "school",
    label: "School",
    type: "autocomplete",
    options: SCHOOLS,
    requiredMsg: "* Please enter your school.",
  },
  {
    key: "otherSchool",
    label: "School Name (if not listed)",
    type: "text",
    requiredMsg: "* Please enter your school name.",
    showIf: (values) => values.school === OTHER_SCHOOL,
  },
  {
    key: "level_of_study",
    label: "Level of Study",
    type: "select",
    options: LEVELS_OF_STUDY,
    requiredMsg: "* Please select your level of study.",
    fullWidth: true,
  },
  {
    key: "grad_month",
    label: "Graduation Month",
    type: "select",
    options: GRAD_MONTHS,
    requiredMsg: "* Please select a valid graduation month.",
  },
  {
    key: "grad_year",
    label: "Graduation Year",
    type: "select",
    options: GRAD_YEARS,
    requiredMsg: "* Please select a valid graduation year.",
  },
  {
    key: "country",
    label: "Country of Residence",
    type: "autocomplete",
    options: COUNTRIES,
    requiredMsg: "* Please enter your country.",
  },
  {
    key: "major",
    label: "Field of Study",
    type: "select",
    options: MAJORS,
    requiredMsg: "* Please select your field of study.",
  },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: GENDERS,
    requiredMsg: "* Please select a gender.",
  },
  {
    key: "race_ethnicity",
    label: "Race / Ethnicity",
    type: "select",
    options: RACES,
    requiredMsg: "* Please select a race / ethnicity.",
  },
  {
    key: "first_hackathon",
    label: "First hackathon?",
    type: "select",
    options: YES_NO,
    requiredMsg: "* Please select if this is your first hackathon.",
  },
  {
    key: "first_hophacks",
    label: "First HopHacks?",
    type: "select",
    options: YES_NO,
    requiredMsg: "* Please select if this is your first time at HopHacks.",
  },
  {
    key: "learn_about_us",
    label: "How did you hear about us?",
    type: "select",
    options: HOW_OPTIONS,
    requiredMsg: "* Please select how you heard about us.",
  },
  {
    key: "linkedin_url",
    label: "LinkedIn Profile URL",
    type: "url",
    requiredMsg: "* Please enter your LinkedIn profile url.",
    validate: validateLinkedIn,
    fullWidth: true,
  },
  // Optional demographics — signup collects these under "answer only what
  // you're comfortable with"; empty values are allowed here too.
  {
    key: "pronouns",
    label: "Pronouns",
    type: "select",
    options: PRONOUNS,
  },
  {
    key: "underrepresented_group",
    label: "Underrepresented group in tech?",
    type: "select",
    options: UNDERREPRESENTED,
  },
  {
    key: "dietary_restrictions",
    label: "Dietary Restrictions",
    type: "select",
    options: DIETARY,
  },
  {
    key: "tshirt_size",
    label: "T-Shirt Size",
    type: "select",
    options: TSHIRT_SIZES,
  },
] as const satisfies readonly ProfileFieldDef[];

export type ProfileFieldKey = (typeof PROFILE_FIELDS)[number]["key"];
export type ProfileFormValues = Record<ProfileFieldKey, string>;
export type ProfileFormErrors = Partial<Record<ProfileFieldKey, string>>;

/** Fields that should currently render, given the form's values. */
export function visibleFields(
  values: ProfileFormValues,
): readonly ProfileFieldDef[] {
  return (PROFILE_FIELDS as readonly ProfileFieldDef[]).filter(
    (def) => !def.showIf || def.showIf(values),
  );
}

// ---- (De)serialization ----

/**
 * Map whatever `GET /api/accounts/profile/get` returned into form state.
 * Missing or non-string fields (schema drift across event years — e.g.
 * pre-2026 accounts have `grad`/`ethnicity`/`linkedIn` instead of
 * `level_of_study`/`race_ethnicity`/`linkedin_url`) become strings or ""
 * so the form always renders; returning users re-enter the renamed fields.
 */
export function toFormValues(raw: Record<string, unknown>): ProfileFormValues {
  const values = {} as ProfileFormValues;
  for (const field of PROFILE_FIELDS) {
    const v = raw[field.key];
    values[field.key] = v == null ? "" : String(v);
  }
  return values;
}

/**
 * Build the payload for `POST /api/accounts/profile/update`.
 *
 * The endpoint replaces the entire profile object, so spread the fetched
 * document first to preserve fields this form doesn't edit (`pfp`, the
 * `mlh_*` consents, `resume_photo_release`, and anything else we don't
 * know about yet).
 */
export function buildApiProfile(
  raw: Record<string, unknown>,
  values: ProfileFormValues,
): Record<string, unknown> {
  return {
    ...raw,
    ...values,
    // Mirror signup: `otherSchool` only carries a value when `school` is the
    // "Other (not listed)" sentinel.
    otherSchool: values.school === OTHER_SCHOOL ? values.otherSchool : "",
    is_jhu: isJhuSchool(values.school),
  };
}

// ---- Validation ----

export function validateProfileForm(
  values: ProfileFormValues,
): ProfileFormErrors {
  const errors: ProfileFormErrors = {};
  for (const field of visibleFields(values)) {
    const def: ProfileFieldDef = field;
    const value = values[field.key as ProfileFieldKey].trim();
    if (!value) {
      if (def.requiredMsg)
        errors[field.key as ProfileFieldKey] = def.requiredMsg;
      continue;
    }
    const msg = def.validate?.(value);
    if (msg) errors[field.key as ProfileFieldKey] = msg;
  }
  return errors;
}

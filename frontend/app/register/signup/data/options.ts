// Dropdown option sets for the registration form. MLH-required enums use the
// exact wording MLH publishes so demographic data stays standardized.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Length floor must match the API's password_min_length (api/src/accounts.py).
export const PASSWORD_RE =
  /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{8,25}$/;

export const AGES = [
  "Under 18",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31+",
  "Prefer not to answer",
];

// MLH "Level of Study" enum (verbatim).
export const LEVELS_OF_STUDY = [
  "Less than Secondary / High School",
  "Secondary / High School",
  "Undergraduate University (2 year - community college or similar)",
  "Undergraduate University (3+ year)",
  "Graduate University (Masters, Professional, Doctoral, etc)",
  "Code School / Bootcamp",
  "Other Vocational / Trade Program or Apprenticeship",
  "Post Doctorate",
  "Other",
  "I'm not currently a student",
  "Prefer not to answer",
];

// MLH race/ethnicity enum.
export const RACES = [
  "American Indian or Alaskan Native",
  "Asian / Pacific Islander",
  "Black or African American",
  "Hispanic",
  "White / Caucasian",
  "Multiple ethnicity / Other",
  "Prefer not to answer",
];

// MLH field-of-study enum.
export const MAJORS = [
  "Computer science, computer engineering, or software engineering",
  "Another engineering discipline (such as civil, electrical, mechanical, etc.)",
  "Information systems, information technology, or system administration",
  "A natural science (such as biology, chemistry, physics, etc.)",
  "Mathematics or statistics",
  "Web development or web design",
  "Business discipline (such as accounting, finance, marketing, etc.)",
  "Humanities discipline (such as literature, history, philosophy, etc.)",
  "Social science (such as anthropology, psychology, political science, etc.)",
  "Fine arts or performing arts (such as graphic design, music, studio art, etc.)",
  "Health science (such as nursing, pharmacy, radiology, etc.)",
  "Other",
  "Undecided / No major",
  "My school does not offer majors / primary areas of study",
  "Prefer not to answer",
];

export const GENDERS = [
  "Man",
  "Woman",
  "Non-Binary",
  "Prefer to self-describe",
  "Prefer not to answer",
];

export const PRONOUNS = [
  "She/Her",
  "He/Him",
  "They/Them",
  "She/They",
  "He/They",
  "Prefer not to answer",
  "Other",
];

export const SEXUALITY = [
  "Heterosexual or straight",
  "Gay or lesbian",
  "Bisexual",
  "Different identity",
  "Prefer not to answer",
];

export const DIETARY = [
  "None",
  "Vegetarian",
  "Vegan",
  "Celiac Disease",
  "Kosher",
  "Halal",
  "Allergies",
  "Other",
];

export const UNDERREPRESENTED = ["Yes", "No", "Unsure"];

// MLH "highest level of formal education completed" enum.
export const HIGHEST_EDUCATION = [
  "Less than Secondary / High School",
  "Secondary / High School",
  "Undergraduate University (2 year - community college or similar)",
  "Undergraduate University (3+ year)",
  "Graduate University (Masters, Professional, Doctoral, etc)",
  "Code School / Bootcamp",
  "Other Vocational / Trade Program or Apprenticeship",
  "Other",
  "I'm not currently a student",
  "Prefer not to answer",
];

export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/**
 * The application's free-response questions.
 *
 * These are the application, as distinct from the profile: they are answered
 * on `/apply`, submitted once via `POST /api/registrations/apply`, and frozen
 * afterwards. Signup does not ask them, and the profile form does not edit
 * them. The word limit is mirrored server-side in
 * `api/src/registrations.py` (`ESSAY_WORD_LIMIT`).
 */

export const ESSAY_WORD_LIMIT = 300;

export type EssayKey = "essay_project" | "essay_team";

export type EssayQuestion = {
  key: EssayKey;
  /** The prompt as the applicant sees it. */
  prompt: string;
  /** Abridged prompt, for table cells and column headers. */
  shortLabel: string;
  /** Shown when the answer is empty on submit. */
  requiredMsg: string;
};

export const ESSAY_QUESTIONS: readonly EssayQuestion[] = [
  {
    key: "essay_project",
    prompt:
      "Share a project, technical or not, that you're genuinely proud of. What was the hardest decision you made, and why did you make it that way?",
    shortLabel: "A project you're proud of, and the hardest decision you made",
    requiredMsg: "* Please answer the first application question.",
  },
  {
    key: "essay_team",
    prompt:
      "Tell us about a time you worked in a team. What role did you play, and what were your strengths and weaknesses?",
    shortLabel:
      "A time you worked in a team, your role, strengths and weaknesses",
    requiredMsg: "* Please answer the second application question.",
  },
];

export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

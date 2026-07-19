import { test, expect, Page } from "@playwright/test";

// All backend calls are stubbed — these tests exercise the form contract,
// not the API (the API has its own pytest suite).

async function stubBackend(page: Page, created: { payload?: unknown }) {
  await page.route("**/api/auth/session/refresh", (r) =>
    r.fulfill({ status: 401, json: { msg: "no session" } }),
  );
  await page.route("**/api/accounts/check/**", (r) =>
    r.fulfill({ json: { exist: false } }),
  );
  await page.route("**/api/accounts/create", async (r) => {
    created.payload = r.request().postDataJSON();
    await r.fulfill({ json: { msg: "user added" } });
  });
  await page.route("**/api/auth/login", (r) =>
    r.fulfill({ json: { access_token: "stub-token" } }),
  );
  await page.route("**/api/resumes/", (r) =>
    r.fulfill({ json: { msg: "file uploaded" } }),
  );
}

const RESUME_FIXTURE = {
  name: "resume.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.4 e2e fixture"),
};

async function fillAccountStep(page: Page) {
  await page.getByLabel("Email address").fill("e2e@test.com");
  await page.getByLabel("Password", { exact: true }).fill("pass123!");
  await page.getByLabel("Confirm password").fill("pass123!");
  await page.getByRole("button", { name: "Next", exact: true }).click();
}

async function fillBasicInfoStep(page: Page) {
  await page.getByLabel("First name").fill("E2e");
  await page.getByLabel("Last name").fill("Tester");
  await page.getByLabel("Age").selectOption("20");
  await page.getByLabel("Phone number").fill("5555555555");
  await page
    .getByLabel("School", { exact: true })
    .fill("Johns Hopkins University");
  await page
    .getByLabel("Level of study")
    .selectOption("Undergraduate University (3+ year)");
  await page.getByLabel("Graduation month").selectOption("05");
  await page.getByLabel("Graduation year").selectOption("2027");
  await page
    .getByLabel("Country of residence")
    .fill("United States of America");
  await page
    .getByLabel("Field of study")
    .selectOption("Mathematics or statistics");
  await page.getByLabel("Gender").selectOption("Woman");
  await page
    .getByLabel("Race / ethnicity")
    .selectOption("Asian / Pacific Islander");
  await page.getByRole("button", { name: "Next", exact: true }).click();
}

async function fillAboutYou(page: Page) {
  await page.getByLabel("Is this your first hackathon?").selectOption("Yes");
  await page
    .getByLabel("Is this your first time at HopHacks?")
    .selectOption("Yes");
  await page.getByLabel("How did you hear about us?").selectOption("Friend");
  await page
    .getByLabel("LinkedIn profile URL")
    .fill("https://linkedin.com/in/e2e");
  await page
    .getByLabel("Share a project, technical or not")
    .fill("I built a small compiler and chose a simple IR over speed.");
  await page
    .getByLabel("Tell us about a time you worked in a team")
    .fill("I led a four person team and learned to delegate testing.");
  await page.getByLabel("Dietary restrictions").selectOption("None");
  await page.getByLabel("T-shirt size").selectOption("M");
  await page.locator('input[type="file"]').setInputFiles(RESUME_FIXTURE);
}

// The two required MLH consents + HopHacks resume release.
async function checkAllConsents(page: Page) {
  await page
    .getByText("I authorize HopHacks to send my resume")
    .locator("xpath=ancestor::label")
    .locator('input[type="checkbox"]')
    .check();
  await page
    .getByText("I have read and agree to the")
    .locator("xpath=ancestor::label")
    .locator('input[type="checkbox"]')
    .check();
  await page
    .getByText("I authorize you to share my application")
    .locator("xpath=ancestor::label")
    .locator('input[type="checkbox"]')
    .check();
}

test("happy path submits canonical MLH payload", async ({ page }) => {
  const created: { payload?: unknown } = {};
  await stubBackend(page, created);

  await page.goto("/register/signup");
  await fillAccountStep(page);
  await fillBasicInfoStep(page);

  await fillAboutYou(page);
  await checkAllConsents(page);
  await page.getByRole("button", { name: "Next", exact: true }).click();

  // Avatar step → submit.
  await page.getByRole("button", { name: "Finish", exact: true }).click();
  await expect(page.getByText("Application submitted!")).toBeVisible();
  await expect(page.getByText("resume didn't upload")).not.toBeVisible();

  const payload = created.payload as {
    username: string;
    profile: Record<string, unknown>;
  };
  expect(payload.username).toBe("e2e@test.com");
  expect(payload.profile.age).toBe("20");
  expect(payload.profile.level_of_study).toBe(
    "Undergraduate University (3+ year)",
  );
  expect(payload.profile.race_ethnicity).toBe("Asian / Pacific Islander");
  expect(payload.profile.country).toBe("United States of America");
  expect(payload.profile.mlh_code_of_conduct).toBe(true);
  expect(payload.profile.mlh_data_sharing).toBe(true);
  expect(payload.profile.mlh_marketing_emails).toBe(false);
  expect(payload.profile.is_jhu).toBe(true);
  expect(payload.profile.dietary_restrictions).toBe("None");
  expect(payload.profile.tshirt_size).toBe("M");
  expect(payload.profile.essay_project).toContain("compiler");
  expect(payload.profile.essay_team).toContain("team");
});

test("essay over the word limit blocks the application step", async ({
  page,
}) => {
  const created: { payload?: unknown } = {};
  await stubBackend(page, created);

  await page.goto("/register/signup");
  await fillAccountStep(page);
  await fillBasicInfoStep(page);
  await fillAboutYou(page);
  await checkAllConsents(page);

  await page
    .getByLabel("Share a project, technical or not")
    .fill(Array.from({ length: 301 }, (_, i) => `word${i}`).join(" "));
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await expect(
    page.getByText("First answer must be 300 words or fewer"),
  ).toBeVisible();
  expect(created.payload).toBeUndefined();

  // Trimming back under the limit unblocks the step.
  await page
    .getByLabel("Share a project, technical or not")
    .fill("A short answer under the limit.");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Customize your blue jay!")).toBeVisible();
});

test("required MLH consents gate submission", async ({ page }) => {
  const created: { payload?: unknown } = {};
  await stubBackend(page, created);

  await page.goto("/register/signup");
  await fillAccountStep(page);
  await fillBasicInfoStep(page);

  await fillAboutYou(page);
  // Only the resume release — leave both MLH consents unchecked.
  await page
    .getByText("I authorize HopHacks to send my resume")
    .locator("xpath=ancestor::label")
    .locator('input[type="checkbox"]')
    .check();
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await expect(
    page.getByText("Please read the MLH Code of Conduct"),
  ).toBeVisible();
  expect(created.payload).toBeUndefined();
});

test("failed resume upload surfaces notice on confirmation", async ({
  page,
}) => {
  const created: { payload?: unknown } = {};
  await stubBackend(page, created);
  // Registered after stubBackend, so this route wins for /api/resumes/.
  await page.route("**/api/resumes/", (r) =>
    r.fulfill({ status: 500, json: { msg: "s3 unavailable" } }),
  );

  await page.goto("/register/signup");
  await fillAccountStep(page);
  await fillBasicInfoStep(page);
  await fillAboutYou(page);
  await checkAllConsents(page);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Finish", exact: true }).click();

  // Signup still completes — the account was created — but the user is told.
  await expect(page.getByText("Application submitted!")).toBeVisible();
  await expect(page.getByText("resume didn't upload")).toBeVisible();
});

test("pre-registration route redirects to signup", async ({ page }) => {
  await page.goto("/register/interest");
  await page.waitForURL("**/register/signup");
  await expect(page.getByText("Apply to HopHacks")).toBeVisible();
});

test("hero CTA points at the application", async ({ page }) => {
  // The CTA only renders once the session check resolves as logged out.
  await page.route("**/api/auth/session/refresh", (r) =>
    r.fulfill({ status: 401, json: { msg: "no session" } }),
  );
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Apply Now" });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/register/signup");
});

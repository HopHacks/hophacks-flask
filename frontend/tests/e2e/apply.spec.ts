import { test, expect, Page } from "@playwright/test";

// The second half of the application flow: signup makes a profile, /apply
// turns it into a submitted application. Backend stubbed, as elsewhere.

const ESSAY_PROJECT = "I built a small compiler and chose a simple IR.";
const ESSAY_TEAM = "I led a four person team and learned to delegate.";

const PROFILE_FIXTURE: Record<string, unknown> = {
  first_name: "E2e",
  last_name: "Tester",
  school: "Johns Hopkins University",
  tshirt_size: "M",
  essay_project: "",
  essay_team: "",
};

async function stubLoggedIn(page: Page) {
  await page.route("**/api/auth/session/refresh", (r) =>
    r.fulfill({ json: { access_token: "stub-token" } }),
  );
}

type ApplyStubs = {
  emailConfirmed?: boolean;
  registrations?: unknown[];
  profile?: Record<string, unknown>;
};

async function stubApply(page: Page, opts: ApplyStubs = {}) {
  await stubLoggedIn(page);
  await page.route("**/api/accounts/profile/email_confirmed", (r) =>
    r.fulfill({
      json: { email_confirmed: opts.emailConfirmed ?? true },
    }),
  );
  await page.route("**/api/registrations/get", (r) =>
    r.fulfill({ json: { registrations: opts.registrations ?? [] } }),
  );
  await page.route("**/api/accounts/profile/get", (r) =>
    r.fulfill({ json: { profile: opts.profile ?? PROFILE_FIXTURE } }),
  );
}

test("unconfirmed email blocks submission and offers a resend", async ({
  page,
}) => {
  await stubApply(page, { emailConfirmed: false });
  const resend: { payload?: { confirm_url?: string } } = {};
  await page.route("**/api/accounts/confirm_email/request", async (r) => {
    resend.payload = r.request().postDataJSON();
    await r.fulfill({ json: { msg: "confirmation email sent" } });
  });

  await page.goto("/apply");
  await expect(page.getByText("Email not confirmed")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit application" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Resend confirmation email" }).click();
  await expect(page.getByText("Confirmation email sent.")).toBeVisible();
  expect(resend.payload?.confirm_url).toMatch(/\/confirm_email$/);
});

test("a draft posts only the answers, never the whole profile", async ({
  page,
}) => {
  await stubApply(page);
  const draft: { payload?: Record<string, unknown> } = {};
  await page.route("**/api/registrations/apply/draft", async (r) => {
    draft.payload = r.request().postDataJSON();
    await r.fulfill({ json: { msg: "draft saved" } });
  });
  // The profile-replace endpoint must not be involved at all: it would put
  // every other field at risk on a draft save.
  let profileUpdates = 0;
  await page.route("**/api/accounts/profile/update", async (r) => {
    profileUpdates += 1;
    await r.fulfill({ json: { msg: "updated!" } });
  });

  await page.goto("/apply");
  await page
    .getByLabel("Share a project, technical or not")
    .fill(ESSAY_PROJECT);
  await page.getByRole("button", { name: "Save draft" }).click();

  await expect(page.getByText("Draft saved.")).toBeVisible();
  expect(draft.payload).toEqual({
    essay_project: ESSAY_PROJECT,
    essay_team: "",
  });
  expect(profileUpdates).toBe(0);
});

test("a submission that outran this tab resolves to the submitted view", async ({
  page,
}) => {
  // Second tab / double click: the API answers 409, which is the desired end
  // state, not an error to show the applicant.
  await stubApply(page, {
    profile: {
      ...PROFILE_FIXTURE,
      essay_project: ESSAY_PROJECT,
      essay_team: ESSAY_TEAM,
    },
  });
  let registrations: unknown[] = [];
  await page.route("**/api/registrations/get", (r) =>
    r.fulfill({ json: { registrations } }),
  );
  await page.route("**/api/registrations/apply", async (r) => {
    registrations = [
      {
        event: "Fall 2026",
        status: "applied",
        apply_at: "2026-08-10T14:00:00+00:00",
      },
    ];
    await r.fulfill({
      status: 409,
      json: { msg: "Application already submitted" },
    });
  });
  page.on("dialog", (d) => d.accept());

  await page.goto("/apply");
  await page.getByRole("button", { name: "Submit application" }).click();

  await expect(page.getByText("Submitted", { exact: true })).toBeVisible();
  await expect(page.getByText("Could not submit")).toHaveCount(0);
});

test("a submission whose receipt email fails still reads as submitted", async ({
  page,
}) => {
  let registrations: unknown[] = [];
  let profile = { ...PROFILE_FIXTURE };
  await stubLoggedIn(page);
  await page.route("**/api/accounts/profile/email_confirmed", (r) =>
    r.fulfill({ json: { email_confirmed: true } }),
  );
  await page.route("**/api/registrations/get", (r) =>
    r.fulfill({ json: { registrations } }),
  );
  await page.route("**/api/accounts/profile/get", (r) =>
    r.fulfill({ json: { profile } }),
  );
  await page.route("**/api/registrations/apply", async (r) => {
    registrations = [
      {
        event: "Fall 2026",
        status: "applied",
        apply_at: "2026-08-10T14:00:00+00:00",
      },
    ];
    profile = {
      ...profile,
      essay_project: ESSAY_PROJECT,
      essay_team: ESSAY_TEAM,
    };
    await r.fulfill({
      json: { msg: "application submitted", email_sent: false },
    });
  });
  page.on("dialog", (d) => d.accept());

  await page.goto("/apply");
  await page
    .getByLabel("Share a project, technical or not")
    .fill(ESSAY_PROJECT);
  await page
    .getByLabel("Tell us about a time you worked in a team")
    .fill(ESSAY_TEAM);
  await page.getByRole("button", { name: "Submit application" }).click();

  await expect(page.getByText("Submitted", { exact: true })).toBeVisible();
  await expect(
    page.getByText("We couldn't send your confirmation email"),
  ).toBeVisible();
});

test("a blank or over-long answer is refused before any request", async ({
  page,
}) => {
  await stubApply(page);
  let applyCalls = 0;
  await page.route("**/api/registrations/apply", async (r) => {
    applyCalls += 1;
    await r.fulfill({ json: { msg: "application submitted" } });
  });
  page.on("dialog", (d) => d.accept());

  await page.goto("/apply");
  await page
    .getByLabel("Share a project, technical or not")
    .fill(ESSAY_PROJECT);
  // Second answer still blank.
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(
    page.getByText("Please answer the second application question."),
  ).toBeVisible();

  await page
    .getByLabel("Tell us about a time you worked in a team")
    .fill(Array.from({ length: 301 }, (_, i) => `word${i}`).join(" "));
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByText("300 words or fewer")).toBeVisible();

  expect(applyCalls).toBe(0);
});

test("submitting locks the application into a read-only view", async ({
  page,
}) => {
  // The stub flips to a submitted registration, like the real backend.
  let registrations: unknown[] = [];
  let profile = { ...PROFILE_FIXTURE };
  await stubLoggedIn(page);
  await page.route("**/api/accounts/profile/email_confirmed", (r) =>
    r.fulfill({ json: { email_confirmed: true } }),
  );
  await page.route("**/api/registrations/get", (r) =>
    r.fulfill({ json: { registrations } }),
  );
  await page.route("**/api/accounts/profile/get", (r) =>
    r.fulfill({ json: { profile } }),
  );

  const submitted: { payload?: Record<string, unknown> } = {};
  await page.route("**/api/registrations/apply", async (r) => {
    submitted.payload = r.request().postDataJSON();
    registrations = [
      {
        event: "Fall 2026",
        status: "applied",
        apply_at: "2026-08-10T14:00:00+00:00",
      },
    ];
    profile = {
      ...profile,
      essay_project: ESSAY_PROJECT,
      essay_team: ESSAY_TEAM,
    };
    await r.fulfill({ json: { msg: "application submitted" } });
  });

  const dialogs: string[] = [];
  page.on("dialog", (d) => {
    dialogs.push(d.message());
    d.accept();
  });

  await page.goto("/apply");
  await page
    .getByLabel("Share a project, technical or not")
    .fill(ESSAY_PROJECT);
  await page
    .getByLabel("Tell us about a time you worked in a team")
    .fill(ESSAY_TEAM);
  await page.getByRole("button", { name: "Submit application" }).click();

  // Submitting is irreversible, so it must be confirmed first.
  expect(dialogs[0]).toContain("final");
  expect(submitted.payload).toEqual({
    essay_project: ESSAY_PROJECT,
    essay_team: ESSAY_TEAM,
  });

  await expect(page.getByText("Submitted", { exact: true })).toBeVisible();
  await expect(page.getByText(ESSAY_PROJECT)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit application" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Save draft" })).toHaveCount(0);
});

test("an already-submitted application opens read-only", async ({ page }) => {
  await stubApply(page, {
    registrations: [
      {
        event: "Fall 2026",
        status: "applied",
        apply_at: "2026-08-08T14:00:00+00:00",
      },
    ],
    profile: {
      ...PROFILE_FIXTURE,
      essay_project: ESSAY_PROJECT,
      essay_team: ESSAY_TEAM,
    },
  });

  await page.goto("/apply");
  await expect(page.getByText("Submitted", { exact: true })).toBeVisible();
  await expect(page.getByText(ESSAY_TEAM)).toBeVisible();
  await expect(page.locator("textarea")).toHaveCount(0);
});

test("apply redirects to login when not authenticated", async ({ page }) => {
  await page.route("**/api/auth/session/refresh", (r) =>
    r.fulfill({ status: 401, json: { msg: "no session" } }),
  );

  await page.goto("/apply");
  await page.waitForURL("**/register/login");
});

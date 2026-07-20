import { test, expect, Page } from "@playwright/test";

// Stubbed-backend specs for the account pages users reach from emails and
// after signup: email confirmation, login/logout, password reset, and the
// profile page. Mirrors the pattern in registration.spec.ts (these exercise
// the page contracts, not the API; the API has its own pytest suite).

async function stubLoggedOut(page: Page) {
  await page.route("**/api/auth/session/refresh", (r) =>
    r.fulfill({ status: 401, json: { msg: "no session" } }),
  );
}

async function stubLoggedIn(page: Page) {
  await page.route("**/api/auth/session/refresh", (r) =>
    r.fulfill({ json: { access_token: "stub-token" } }),
  );
}

// A saved profile matching the shape signup submits (see registration.spec.ts
// happy path); the profile form loads and re-saves this document.
const PROFILE_FIXTURE = {
  first_name: "E2e",
  last_name: "Tester",
  age: "20",
  phone_number: "5555555555",
  school: "Johns Hopkins University",
  otherSchool: "",
  level_of_study: "Undergraduate University (3+ year)",
  grad_month: "05",
  grad_year: "2027",
  country: "United States of America",
  major: "Mathematics or statistics",
  gender: "Woman",
  race_ethnicity: "Asian / Pacific Islander",
  first_hackathon: "Yes",
  first_hophacks: "Yes",
  learn_about_us: "Friend",
  linkedin_url: "https://linkedin.com/in/e2e",
  essay_project: "A project answer.",
  essay_team: "A team answer.",
  pronouns: "She/Her",
  underrepresented_group: "No",
  dietary_restrictions: "None",
  dietary_restrictions_other: "",
  tshirt_size: "M",
  is_jhu: true,
};

async function stubProfileData(page: Page) {
  await page.route("**/api/accounts/profile/get", (r) =>
    r.fulfill({ json: { profile: PROFILE_FIXTURE } }),
  );
  await page.route("**/api/resumes/filename", (r) =>
    r.fulfill({ json: { filename: "resume.pdf" } }),
  );
  await page.route("**/api/accounts/profile/email_confirmed", (r) =>
    r.fulfill({ json: { email_confirmed: true } }),
  );
  await page.route("**/api/registrations/get", (r) =>
    r.fulfill({
      json: { registrations: [{ event: "Fall 2026", status: "applied" }] },
    }),
  );
}

// ---- Email confirmation (the hard-load path from the email link) ----

test("confirm email posts the token and reports success", async ({ page }) => {
  await stubLoggedOut(page);
  const confirm: { payload?: unknown } = {};
  await page.route("**/api/accounts/confirm_email", async (r) => {
    confirm.payload = r.request().postDataJSON();
    await r.fulfill({ json: { msg: "email confirmed" } });
  });

  await page.goto("/confirm_email/e2e-confirm-token");
  await expect(page.getByText("Email confirmed!")).toBeVisible();
  expect(confirm.payload).toEqual({ confirm_token: "e2e-confirm-token" });
  await expect(page.getByRole("link", { name: "Sign In" })).toHaveAttribute(
    "href",
    "/register/login",
  );
});

test("confirm email tells an already-confirmed user they're set", async ({
  page,
}) => {
  await stubLoggedOut(page);
  // The API answers a re-confirm with 200 (idempotent), not an error.
  await page.route("**/api/accounts/confirm_email", (r) =>
    r.fulfill({ status: 200, json: { msg: "Email already confirmed" } }),
  );

  await page.goto("/confirm_email/reused-token");
  await expect(
    page.getByText("This email is already confirmed."),
  ).toBeVisible();
});

test("confirm email with a bad token shows the failure message", async ({
  page,
}) => {
  await stubLoggedOut(page);
  await page.route("**/api/accounts/confirm_email", (r) =>
    r.fulfill({ status: 400, json: { msg: "Confirmation link is invalid" } }),
  );

  await page.goto("/confirm_email/expired-token");
  await expect(
    page.getByText("This confirmation link is invalid or expired."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
});

// ---- Login / logout ----

test("login success lands on profile and logout returns to login", async ({
  page,
}) => {
  await stubLoggedOut(page);
  await stubProfileData(page);
  const login: { payload?: unknown } = {};
  await page.route("**/api/auth/login", async (r) => {
    login.payload = r.request().postDataJSON();
    await r.fulfill({ json: { access_token: "stub-token" } });
  });
  await page.route("**/api/auth/session/logout", (r) =>
    r.fulfill({ json: { msg: "logged out" } }),
  );

  await page.goto("/register/login");
  await page.getByLabel("Email address").fill("E2E@Test.com");
  await page.getByLabel("Password").fill("pass123!");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/profile");
  await expect(page.getByText("Your Profile")).toBeVisible();
  // The email input lowercases as the user types.
  expect(login.payload).toEqual({
    username: "e2e@test.com",
    password: "pass123!",
  });

  await page.getByRole("button", { name: "Log out" }).click();
  await page.waitForURL("**/register/login");
});

test("login failure shows an error and stays on the page", async ({ page }) => {
  await stubLoggedOut(page);
  await page.route("**/api/auth/login", (r) =>
    r.fulfill({ status: 401, json: { msg: "bad username or password" } }),
  );

  await page.goto("/register/login");
  await page.getByLabel("Email address").fill("e2e@test.com");
  await page.getByLabel("Password").fill("wrong-pass1!");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Incorrect email or password.")).toBeVisible();
  expect(page.url()).toContain("/register/login");
});

// ---- Password reset request ----

test("reset password request posts the email and confirms", async ({
  page,
}) => {
  await stubLoggedOut(page);
  const request: { payload?: { username?: string; reset_url?: string } } = {};
  await page.route("**/api/accounts/reset_password/request", async (r) => {
    request.payload = r.request().postDataJSON();
    await r.fulfill({ json: { msg: "password reset request received" } });
  });

  await page.goto("/register/resetpassword");
  await page.getByLabel("Email address").fill("e2e@test.com");
  await page.getByRole("button", { name: "Send reset link" }).click();

  await expect(
    page.getByText("An email has been sent (if the account exists)!"),
  ).toBeVisible();
  expect(request.payload?.username).toBe("e2e@test.com");
  expect(request.payload?.reset_url).toMatch(/\/reset_password$/);
});

// ---- Password reset form (the hard-load path from the email link) ----

test("reset password form gates weak and mismatched passwords", async ({
  page,
}) => {
  await stubLoggedOut(page);
  let posted = false;
  await page.route("**/api/accounts/reset_password", (r) => {
    posted = true;
    return r.fulfill({ json: { msg: "password updated" } });
  });

  await page.goto("/reset_password/e2e-reset-token");
  await page.getByLabel("New Password").fill("weak");
  await page.getByLabel("Confirm Password").fill("weak");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByText("at least one number and one special character"),
  ).toBeVisible();

  await page.getByLabel("New Password").fill("pass123!");
  await page.getByLabel("Confirm Password").fill("pass124!");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Passwords do not match.")).toBeVisible();

  expect(posted).toBe(false);
});

test("reset password success posts the token and offers sign in", async ({
  page,
}) => {
  await stubLoggedOut(page);
  const reset: { payload?: unknown } = {};
  await page.route("**/api/accounts/reset_password", async (r) => {
    reset.payload = r.request().postDataJSON();
    await r.fulfill({ json: { msg: "password updated" } });
  });

  await page.goto("/reset_password/e2e-reset-token");
  await page.getByLabel("New Password").fill("pass123!");
  await page.getByLabel("Confirm Password").fill("pass123!");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Password reset successfully!")).toBeVisible();
  expect(reset.payload).toEqual({
    reset_token: "e2e-reset-token",
    password: "pass123!",
  });
  await expect(
    page.getByRole("link", { name: "Back to Sign In" }),
  ).toHaveAttribute("href", "/register/login");
});

test("reset password failure surfaces the error", async ({ page }) => {
  await stubLoggedOut(page);
  await page.route("**/api/accounts/reset_password", (r) =>
    r.fulfill({ status: 400, json: { msg: "reset token invalid" } }),
  );

  await page.goto("/reset_password/expired-token");
  await page.getByLabel("New Password").fill("pass123!");
  await page.getByLabel("Confirm Password").fill("pass123!");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Unable to reset password.")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Request a new reset link" }),
  ).toHaveAttribute("href", "/register/resetpassword");
});

// ---- Profile page ----

test("profile page loads the saved application and saves edits", async ({
  page,
}) => {
  await stubLoggedIn(page);
  await stubProfileData(page);
  const update: { payload?: { profile?: Record<string, unknown> } } = {};
  await page.route("**/api/accounts/profile/update", async (r) => {
    update.payload = r.request().postDataJSON();
    await r.fulfill({ json: { msg: "profile updated" } });
  });

  await page.goto("/profile");
  await expect(page.getByText("Your Profile")).toBeVisible();
  await expect(page.getByText("Applied")).toBeVisible();
  await expect(page.getByLabel("First Name")).toHaveValue("E2e");
  await expect(page.getByText("resume.pdf")).toBeVisible();

  await page.getByLabel("First Name").fill("Edited");
  await page.getByRole("button", { name: "Save Changes" }).click();

  await expect(page.getByText("Profile saved!")).toBeVisible();
  expect(update.payload?.profile?.first_name).toBe("Edited");
  // Untouched fields survive the round trip (the endpoint replaces the
  // whole profile object).
  expect(update.payload?.profile?.tshirt_size).toBe("M");
  expect(update.payload?.profile?.is_jhu).toBe(true);
});

test("unconfirmed email surfaces the resend action", async ({ page }) => {
  await stubLoggedIn(page);
  await page.route("**/api/accounts/profile/get", (r) =>
    r.fulfill({ json: { profile: PROFILE_FIXTURE } }),
  );
  await page.route("**/api/resumes/filename", (r) =>
    r.fulfill({ json: { filename: "resume.pdf" } }),
  );
  await page.route("**/api/accounts/profile/email_confirmed", (r) =>
    r.fulfill({ json: { email_confirmed: false } }),
  );
  await page.route("**/api/registrations/get", (r) =>
    r.fulfill({ json: { registrations: [] } }),
  );
  const resend: { payload?: { confirm_url?: string } } = {};
  await page.route("**/api/accounts/confirm_email/request", async (r) => {
    resend.payload = r.request().postDataJSON();
    await r.fulfill({ json: { msg: "confirmation email sent" } });
  });

  await page.goto("/profile");
  await expect(page.getByText("Email not confirmed")).toBeVisible();

  await page.getByRole("button", { name: "Resend confirmation email" }).click();
  await expect(page.getByText("Confirmation email sent.")).toBeVisible();
  expect(resend.payload?.confirm_url).toMatch(/\/confirm_email$/);
});

test("accepted applicant can RSVP from the status section", async ({
  page,
}) => {
  await stubLoggedIn(page);
  await page.route("**/api/accounts/profile/get", (r) =>
    r.fulfill({ json: { profile: PROFILE_FIXTURE } }),
  );
  await page.route("**/api/resumes/filename", (r) =>
    r.fulfill({ json: { filename: "resume.pdf" } }),
  );
  await page.route("**/api/accounts/profile/email_confirmed", (r) =>
    r.fulfill({ json: { email_confirmed: true } }),
  );
  // Status flips to rsvped after the RSVP post, like the real backend.
  let status = "accepted";
  await page.route("**/api/registrations/get", (r) =>
    r.fulfill({
      json: { registrations: [{ event: "Fall 2026", status }] },
    }),
  );
  const rsvp: { payload?: unknown } = {};
  await page.route("**/api/registrations/rsvp/rsvp", async (r) => {
    rsvp.payload = r.request().postDataJSON();
    status = "rsvped";
    await r.fulfill({ json: { msg: "success" } });
  });

  await page.goto("/profile");
  // exact: the step body also mentions "accepted", which would otherwise
  // trip Playwright's strict mode.
  await expect(page.getByText("Accepted", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "RSVP now" }).click();
  await expect(page.getByText("RSVP'd", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel RSVP" })).toBeVisible();
  expect(rsvp.payload).toEqual({ event: "Fall 2026" });
});

test("profile redirects to login when not authenticated", async ({ page }) => {
  await stubLoggedOut(page);

  await page.goto("/profile");
  await page.waitForURL("**/register/login");
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
});

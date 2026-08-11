import { test, expect, Page } from "@playwright/test";

// Stubbed-backend specs for the admin console decision flow (accept /
// revert, confirm dialogs, request chunking). Mirrors account-flows.spec.ts:
// these exercise the page contracts; the decision semantics themselves are
// covered by the API's pytest suite.

const EMPTY_STATS = {
  total: 0,
  by_status: {},
  by_school: {},
  by_level_of_study: {},
  by_country: {},
  by_gender: {},
  by_race_ethnicity: {},
};

function makeUser(id: string, first: string, last: string, status: string) {
  return {
    id,
    username: `${first.toLowerCase()}@e2e.com`,
    profile: {
      first_name: first,
      last_name: last,
      school: "JHU",
      essay_project: `${first} built a thing.\n\nSecond paragraph.`,
      essay_team: `${first} worked on a team.`,
      major: "Computer science",
      linkedin_url: "https://linkedin.com/in/e2e",
    },
    email_confirmed: true,
    registrations: [{ event: "Fall 2026", status }],
    resume: null,
    apply_at: "2026-08-08T14:00:00+00:00",
    submitted: true,
  };
}

/** Confirmed account with no registration: a profile, never an application. */
function makeProfileOnlyUser(id: string, first: string) {
  return {
    id,
    username: `${first.toLowerCase()}@e2e.com`,
    profile: {
      first_name: first,
      last_name: "Tester",
      school: "JHU",
      essay_project: "Half an answer, saved as a draft.",
      essay_team: "",
    },
    email_confirmed: true,
    registrations: [],
    resume: null,
    apply_at: null,
    submitted: false,
  };
}

async function stubAdminConsole(page: Page, statuses: Map<string, string>) {
  await page.route("**/api/auth/session/refresh", (r) =>
    r.fulfill({ json: { access_token: "stub-token" } }),
  );
  await page.route("**/api/admin/", (r) =>
    r.fulfill({ json: { is_admin: true } }),
  );
  await page.route("**/api/admin/stats", (r) =>
    r.fulfill({ json: EMPTY_STATS }),
  );
  await page.route("**/api/admin/users*", (r) =>
    r.fulfill({
      json: {
        users: [...statuses].map(([id, status], i) =>
          makeUser(id, `User${i}`, "Tester", status),
        ),
      },
    }),
  );
}

async function openApplications(page: Page) {
  await page.goto("/admin");
  await page.getByRole("button", { name: "Applications" }).click();
}

test("expanding a row shows both application responses", async ({ page }) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);

  await openApplications(page);

  // Collapsed by default so the table stays scannable.
  await expect(page.getByText("User0 built a thing.")).toBeHidden();

  await page.getByRole("button", { name: /User0 Tester/ }).click();
  await expect(page.getByText("User0 built a thing.")).toBeVisible();
  await expect(page.getByText("User0 worked on a team.")).toBeVisible();
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://linkedin.com/in/e2e",
  );

  // Decision buttons stay reachable while reading.
  await expect(
    page.getByRole("button", { name: "Accept", exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: /User0 Tester/ }).click();
  await expect(page.getByText("User0 built a thing.")).toBeHidden();
});

test("a row with no essays on file says so", async ({ page }) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);
  // Legacy account: registered before the essays were required.
  await page.route("**/api/admin/users*", (r) =>
    r.fulfill({
      json: {
        users: [
          {
            id: "id-ada",
            username: "legacy@e2e.com",
            profile: { first_name: "Legacy", last_name: "User" },
            email_confirmed: true,
            registrations: [{ event: "Fall 2026", status: "applied" }],
            resume: null,
            apply_at: null,
            submitted: true,
          },
        ],
      },
    }),
  );

  await openApplications(page);
  await page.getByRole("button", { name: /Legacy User/ }).click();
  await expect(page.getByText("No response on file.")).toHaveCount(2);
});

test("a submitted row shows the date applied", async ({ page }) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);

  await openApplications(page);
  await expect(
    page.getByRole("columnheader", { name: "Applied" }),
  ).toBeVisible();
  await expect(page.getByRole("cell", { name: /Aug 8, 2026/ })).toBeVisible();
});

test("a profile-only account is flagged, dated blank, and marked draft", async ({
  page,
}) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);
  await page.route("**/api/admin/users*", (r) =>
    r.fulfill({
      json: {
        users: [
          makeUser("id-ada", "Applied", "Tester", "applied"),
          makeProfileOnlyUser("id-pat", "Pat"),
        ],
      },
    }),
  );

  await openApplications(page);

  const patRow = page.getByRole("row", { name: /Pat Tester/ });
  await expect(patRow.getByText("Not submitted")).toBeVisible();
  await expect(
    patRow.getByRole("cell", { name: "—", exact: true }),
  ).toBeVisible();

  // Their saved text is a draft, and must never read as a submission.
  await page.getByRole("button", { name: /Pat Tester/ }).click();
  await expect(page.getByText("Draft — not submitted")).toBeVisible();
  await expect(
    page.getByText("Half an answer, saved as a draft."),
  ).toBeVisible();

  // Filtering isolates them.
  await page.getByRole("combobox").selectOption("not_submitted");
  await expect(page.getByRole("button", { name: /Pat Tester/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Applied Tester/ }),
  ).toHaveCount(0);
});

test("a profile-only account offers no decision to make", async ({ page }) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);
  await page.route("**/api/admin/users*", (r) =>
    r.fulfill({
      json: {
        users: [
          makeUser("id-ada", "Applied", "Tester", "applied"),
          makeProfileOnlyUser("id-pat", "Pat"),
        ],
      },
    }),
  );

  await openApplications(page);

  // There is no application to accept, waitlist, or reject yet — and no way
  // to sweep them into a bulk decision either.
  const patRow = page.getByRole("row", { name: /Pat Tester/ });
  await expect(patRow.getByRole("button", { name: "Accept" })).toHaveCount(0);
  await expect(patRow.getByRole("button", { name: "Revert" })).toHaveCount(0);
  await expect(patRow.getByRole("checkbox")).toBeDisabled();
  // Deleting a junk account still works.
  await expect(patRow.getByRole("button", { name: "Delete" })).toBeVisible();

  const appliedRow = page.getByRole("row", { name: /Applied Tester/ });
  await expect(
    appliedRow.getByRole("button", { name: "Accept" }),
  ).toBeVisible();
  await expect(appliedRow.getByRole("checkbox")).toBeEnabled();
});

test("admin accepts an applicant who RSVPs; revert returns them to Applied", async ({
  page,
}) => {
  const statuses = new Map([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);

  const dialogs: string[] = [];
  page.on("dialog", (d) => {
    dialogs.push(d.message());
    d.accept();
  });

  const acceptCall: { payload?: { users?: string[]; event?: string } } = {};
  await page.route("**/api/registrations/accept", async (r) => {
    acceptCall.payload = r.request().postDataJSON();
    statuses.set("id-ada", "accepted");
    await r.fulfill({
      json: { num_changed: 1, skipped: [], email_failures: 0 },
    });
  });

  await openApplications(page);
  await expect(page.locator("tbody").getByText("Applied")).toBeVisible();

  await page.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(
    page.locator("tbody").getByText("Accepted", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Accepted 1.")).toBeVisible();
  expect(acceptCall.payload).toEqual({
    users: ["id-ada"],
    event: "Fall 2026",
  });
  expect(dialogs[0]).toContain("Accept and email User0 Tester");

  // The accepted user sees the status on their profile and can RSVP.
  await page.route("**/api/accounts/profile/get", (r) =>
    r.fulfill({ json: { profile: { first_name: "User0" } } }),
  );
  await page.route("**/api/resumes/filename", (r) =>
    r.fulfill({ json: { filename: "resume.pdf" } }),
  );
  await page.route("**/api/accounts/profile/email_confirmed", (r) =>
    r.fulfill({ json: { email_confirmed: true } }),
  );
  await page.route("**/api/registrations/get", (r) =>
    r.fulfill({
      json: {
        registrations: [{ event: "Fall 2026", status: statuses.get("id-ada") }],
      },
    }),
  );
  await page.route("**/api/registrations/rsvp/rsvp", async (r) => {
    statuses.set("id-ada", "rsvped");
    await r.fulfill({ json: { msg: "success" } });
  });

  await page.goto("/profile");
  await expect(page.getByText("Accepted", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "RSVP now" }).click();
  await expect(page.getByText("RSVP'd", { exact: true })).toBeVisible();

  // Back in the console, revert silently resets the misclick.
  const revertCall: { payload?: unknown } = {};
  await page.route("**/api/registrations/revert", async (r) => {
    revertCall.payload = r.request().postDataJSON();
    statuses.set("id-ada", "applied");
    await r.fulfill({
      json: { num_changed: 1, skipped: [], email_failures: 0 },
    });
  });

  await openApplications(page);
  await expect(page.locator("tbody").getByText("RSVP'd")).toBeVisible();
  await page.getByRole("button", { name: "Revert", exact: true }).click();
  await expect(page.locator("tbody").getByText("Applied")).toBeVisible();
  await expect(page.getByText("Reverted 1.")).toBeVisible();
  expect(revertCall.payload).toEqual({
    users: ["id-ada"],
    event: "Fall 2026",
  });
  expect(dialogs[dialogs.length - 1]).toContain("No email is sent");
});

test("a dismissed confirm dialog sends nothing", async ({ page }) => {
  const statuses = new Map([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);
  page.on("dialog", (d) => d.dismiss());

  let acceptCalls = 0;
  await page.route("**/api/registrations/accept", async (r) => {
    acceptCalls += 1;
    await r.fulfill({
      json: { num_changed: 1, skipped: [], email_failures: 0 },
    });
  });

  await openApplications(page);
  await page.getByRole("button", { name: "Accept", exact: true }).click();

  await expect(page.locator("tbody").getByText("Applied")).toBeVisible();
  expect(acceptCalls).toBe(0);
});

test("bulk accept chunks into requests of 20", async ({ page }) => {
  const statuses = new Map<string, string>(
    Array.from({ length: 25 }, (_, i) => [`id-${i}`, "applied"]),
  );
  await stubAdminConsole(page, statuses);
  page.on("dialog", (d) => d.accept());

  const chunkSizes: number[] = [];
  await page.route("**/api/registrations/accept", async (r) => {
    const users: string[] = r.request().postDataJSON().users;
    chunkSizes.push(users.length);
    users.forEach((id) => statuses.set(id, "accepted"));
    await r.fulfill({
      json: { num_changed: users.length, skipped: [], email_failures: 0 },
    });
  });

  await openApplications(page);
  for (const box of await page.locator("tbody input[type=checkbox]").all())
    await box.check();
  await expect(page.getByText("25 selected")).toBeVisible();

  await page
    .locator("div.bg-slate-800")
    .getByRole("button", { name: "Accept" })
    .click();

  await expect(page.getByText("Accepted 25.")).toBeVisible();
  expect(chunkSizes).toEqual([20, 5]);
});

test("partial failure is reported and failed rows stay selected", async ({
  page,
}) => {
  const statuses = new Map<string, string>(
    Array.from({ length: 25 }, (_, i) => [`id-${i}`, "applied"]),
  );
  await stubAdminConsole(page, statuses);
  page.on("dialog", (d) => d.accept());

  let call = 0;
  await page.route("**/api/registrations/accept", async (r) => {
    call += 1;
    if (call > 1) {
      await r.fulfill({ status: 500, json: { msg: "boom" } });
      return;
    }
    const users: string[] = r.request().postDataJSON().users;
    users.forEach((id) => statuses.set(id, "accepted"));
    await r.fulfill({
      json: { num_changed: users.length, skipped: [], email_failures: 0 },
    });
  });

  await openApplications(page);
  for (const box of await page.locator("tbody input[type=checkbox]").all())
    await box.check();
  await page
    .locator("div.bg-slate-800")
    .getByRole("button", { name: "Accept" })
    .click();

  await expect(
    page.getByText("Accepted 20 · failed 5, kept selected for retry."),
  ).toBeVisible();
  await expect(page.locator("tbody input[type=checkbox]:checked")).toHaveCount(
    5,
  );
});

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
    profile: { first_name: first, last_name: last, school: "JHU" },
    email_confirmed: true,
    registrations: [{ event: "Fall 2026", status }],
    resume: null,
    apply_at: null,
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
  const statuses = new Map(
    Array.from({ length: 25 }, (_, i) => [`id-${i}`, "applied"] as const),
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
  const statuses = new Map(
    Array.from({ length: 25 }, (_, i) => [`id-${i}`, "applied"] as const),
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

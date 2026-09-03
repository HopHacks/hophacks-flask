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

// --- Regression: acceptance emails that silently fail to send ---

function makeAcceptedNoEmail(id: string, first: string) {
  return {
    id,
    username: `${first.toLowerCase()}@e2e.com`,
    profile: { first_name: first, last_name: "Tester", school: "JHU" },
    email_confirmed: true,
    registrations: [
      {
        event: "Fall 2026",
        status: "accepted",
        accept_email_sent: false,
        apply_at: "2026-08-08T14:00:00+00:00",
      },
    ],
    resume: null,
    apply_at: "2026-08-08T14:00:00+00:00",
    submitted: true,
  };
}

test("an accepted applicant whose email failed is flagged and filterable", async ({
  page,
}) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);
  await page.route("**/api/admin/users*", (r) =>
    r.fulfill({
      json: {
        users: [
          makeUser("id-ok", "Fine", "Tester", "accepted"),
          makeAcceptedNoEmail("id-stuck", "Stuck"),
        ],
      },
    }),
  );

  await openApplications(page);

  const stuck = page.getByRole("row", { name: /Stuck Tester/ });
  await expect(stuck.getByText("email not sent")).toBeVisible();
  // The applicant who did get their letter must not be flagged.
  const fine = page.getByRole("row", { name: /Fine Tester/ });
  await expect(fine.getByText("email not sent")).toHaveCount(0);

  await page.getByRole("combobox").selectOption("email_not_sent");
  await expect(
    page.getByRole("button", { name: /Stuck Tester/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Fine Tester/ })).toHaveCount(
    0,
  );
});

test("a batch whose emails fail warns loudly instead of reporting success", async ({
  page,
}) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);
  // The API accepts everyone but sends nothing -- the incident's signature.
  await page.route("**/api/registrations/accept", (r) =>
    r.fulfill({ json: { num_changed: 1, skipped: [], email_failures: 1 } }),
  );
  page.on("dialog", (d) => d.accept());

  await openApplications(page);
  await page.getByRole("button", { name: "Accept", exact: true }).click();

  await expect(page.getByText(/did NOT send/)).toBeVisible();
});

test("resend re-emails the selected applicants without changing status", async ({
  page,
}) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);
  await page.route("**/api/admin/users*", (r) =>
    r.fulfill({ json: { users: [makeAcceptedNoEmail("id-stuck", "Stuck")] } }),
  );
  const sent: { payload?: { users?: string[] } } = {};
  await page.route("**/api/registrations/resend_acceptance", async (r) => {
    sent.payload = r.request().postDataJSON();
    await r.fulfill({
      json: { num_changed: 1, skipped: [], email_failures: 0 },
    });
  });
  const dialogs: string[] = [];
  page.on("dialog", (d) => {
    dialogs.push(d.message());
    d.accept();
  });

  await openApplications(page);
  await page
    .getByRole("row", { name: /Stuck Tester/ })
    .getByRole("checkbox")
    .check();
  await page.getByRole("button", { name: "Resend email" }).click();

  expect(dialogs[0]).toContain("Nobody's status changes");
  expect(sent.payload?.users).toEqual(["id-stuck"]);
  await expect(page.getByText(/Re-emailed 1/)).toBeVisible();
});

test("the not-submitted export downloads through the API", async ({ page }) => {
  const statuses = new Map<string, string>([["id-ada", "applied"]]);
  await stubAdminConsole(page, statuses);
  let hits = 0;
  await page.route("**/api/admin/export_unsubmitted", (r) => {
    hits += 1;
    return r.fulfill({
      contentType: "text/csv",
      body: "email,first_name\nnudge-me@test.com,Nudge\n",
    });
  });

  await openApplications(page);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export not submitted" }).click();
  expect((await download).suggestedFilename()).toBe(
    "hophacks_not_submitted.csv",
  );
  expect(hits).toBe(1);
});

// --- Stage broadcast email ---

type BroadcastHistoryRow = {
  broadcast_id: string;
  subject: string;
  message: string;
  stage: string | null;
  sent_by: string;
  sent_at: string;
  num_recipients: number;
  num_sent: number;
  num_failed: number;
  failed_ids: string[];
};

type BroadcastSendBody = {
  users: string[];
  subject: string;
  message: string;
  stage: string;
  broadcast_id: string;
};

// Only the history read is stubbed here; each test routes the send, retry and
// test-send paths it cares about. Every path is routed with its own exact
// glob: a pattern has to match the whole URL, so the send route cannot
// swallow /broadcast/history.
async function stubBroadcast(page: Page, history: BroadcastHistoryRow[] = []) {
  await page.route("**/api/admin/broadcast/history", (r) =>
    r.fulfill({ json: { broadcasts: history } }),
  );
}

async function openEmail(page: Page) {
  await page.goto("/admin");
  await page.getByRole("button", { name: "Email" }).click();
}

test("recipient count follows the chosen stage", async ({ page }) => {
  const statuses = new Map<string, string>([
    ["id-0", "accepted"],
    ["id-1", "accepted"],
    ["id-2", "accepted"],
    ["id-3", "applied"],
    ["id-4", "applied"],
    ["id-5", "rsvped"],
  ]);
  await stubAdminConsole(page, statuses);
  await stubBroadcast(page);

  await openEmail(page);

  // Accepted is the default: RSVP logistics are the reason this page exists.
  await expect(page.getByText("3 recipients")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send to 3 people" }),
  ).toBeVisible();

  const stage = page.getByLabel("Stage");
  await stage.selectOption("applied");
  await expect(page.getByText("2 recipients")).toBeVisible();

  await stage.selectOption("rsvped");
  await expect(page.getByText("1 recipient")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send to 1 person" }),
  ).toBeVisible();

  // Only real registration statuses are emailable; the pseudo-stages
  // deriveStatus() invents are not groups anyone should broadcast to.
  const options = await stage.locator("option").allTextContents();
  expect(options).toHaveLength(6);
  expect(options).not.toContain("Not submitted");
  expect(options).not.toContain("Email not confirmed");
});

test("a dismissed broadcast confirm sends nothing", async ({ page }) => {
  const statuses = new Map<string, string>([["id-0", "accepted"]]);
  await stubAdminConsole(page, statuses);
  await stubBroadcast(page);
  page.on("dialog", (d) => d.dismiss());

  let sends = 0;
  await page.route("**/api/admin/broadcast", async (r) => {
    sends += 1;
    await r.fulfill({
      json: { num_sent: 1, email_failures: 0, failed_ids: [], skipped: [] },
    });
  });

  await openEmail(page);
  await page.getByLabel("Subject").fill("RSVP deadline is this Friday");
  await page.getByLabel("Message").fill("Please RSVP by Friday.");
  await page.getByRole("button", { name: "Send to 1 person" }).click();

  await expect(
    page.getByRole("button", { name: "Send to 1 person" }),
  ).toBeEnabled();
  expect(sends).toBe(0);
});

test("a send chunks into requests of 20 under one broadcast_id", async ({
  page,
}) => {
  const statuses = new Map<string, string>(
    Array.from({ length: 25 }, (_, i) => [`id-${i}`, "accepted"]),
  );
  await stubAdminConsole(page, statuses);
  await stubBroadcast(page);
  page.on("dialog", (d) => d.accept());

  const posts: BroadcastSendBody[] = [];
  await page.route("**/api/admin/broadcast", async (r) => {
    const body: BroadcastSendBody = r.request().postDataJSON();
    posts.push(body);
    await r.fulfill({
      json: {
        num_sent: body.users.length,
        email_failures: 0,
        failed_ids: [],
        skipped: [],
      },
    });
  });

  await openEmail(page);
  await page.getByLabel("Subject").fill("RSVP deadline is this Friday");
  await page.getByLabel("Message").fill("Doors open at 5pm on Friday.");
  await page.getByRole("button", { name: "Send to 25 people" }).click();

  await expect(page.getByText("Sent 25.")).toBeVisible();
  expect(posts.map((p) => p.users.length)).toEqual([20, 5]);
  // One audit row per logical send, so a re-attempted chunk cannot double-send.
  expect(new Set(posts.map((p) => p.broadcast_id)).size).toBe(1);
  expect(posts[0].broadcast_id).toBeTruthy();
  for (const p of posts) {
    expect(p.subject).toBe("RSVP deadline is this Friday");
    expect(p.message).toBe("Doors open at 5pm on Friday.");
    expect(p.stage).toBe("accepted");
  }
});

test("a large send warns about the Gmail daily cap", async ({ page }) => {
  const statuses = new Map<string, string>(
    Array.from({ length: 401 }, (_, i) => [`id-${i}`, "accepted"]),
  );
  await stubAdminConsole(page, statuses);
  await stubBroadcast(page);
  const dialogs: string[] = [];
  page.on("dialog", (d) => {
    dialogs.push(d.message());
    d.accept();
  });

  let sends = 0;
  await page.route("**/api/admin/broadcast", async (r) => {
    const users: string[] = r.request().postDataJSON().users;
    sends += 1;
    await r.fulfill({
      json: {
        num_sent: users.length,
        email_failures: 0,
        failed_ids: [],
        skipped: [],
      },
    });
  });

  await openEmail(page);
  await page.getByLabel("Subject").fill("Bus times for Friday");
  await page.getByLabel("Message").fill("The bus leaves at 7am.");
  await page.getByRole("button", { name: "Send to 401 people" }).click();

  // The cap is a warning, not a block: the send still goes out.
  await expect(page.getByText("Sent 401.")).toBeVisible();
  expect(dialogs[0]).toContain("roughly 500 sends per day");
  expect(dialogs[0]).toContain("finish this send tomorrow");
  expect(sends).toBeGreaterThanOrEqual(1);
});

test("past email failures get a retry button carrying the failed ids", async ({
  page,
}) => {
  const statuses = new Map<string, string>([["id-0", "accepted"]]);
  await stubAdminConsole(page, statuses);
  await stubBroadcast(page, [
    {
      broadcast_id: "bc-failed",
      subject: "RSVP deadline is this Friday",
      message: "Please RSVP by Friday.",
      stage: "accepted",
      sent_by: "admin@e2e.com",
      sent_at: "2026-09-01T12:00:00+00:00",
      num_recipients: 10,
      num_sent: 8,
      num_failed: 2,
      failed_ids: ["id-1", "id-2"],
    },
    {
      broadcast_id: "bc-clean",
      subject: "Bus times for Friday",
      message: "The bus leaves at 7am.",
      stage: "rsvped",
      sent_by: "admin@e2e.com",
      sent_at: "2026-09-02T12:00:00+00:00",
      num_recipients: 5,
      num_sent: 5,
      num_failed: 0,
      failed_ids: [],
    },
  ]);
  page.on("dialog", (d) => d.accept());

  const retry: { payload?: unknown } = {};
  await page.route("**/api/admin/broadcast/retry", async (r) => {
    retry.payload = r.request().postDataJSON();
    await r.fulfill({
      json: { num_sent: 2, email_failures: 0, failed_ids: [], skipped: [] },
    });
  });

  await openEmail(page);

  // Only the row that failed offers a retry.
  await expect(
    page.getByRole("button", { name: "Retry failed (2)" }),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "Retry failed (2)" }).click();

  await expect(page.getByText("Retried: sent 2")).toBeVisible();
  expect(retry.payload).toEqual({
    broadcast_id: "bc-failed",
    users: ["id-1", "id-2"],
  });
});

test("a broadcast whose emails fail warns loudly instead of reporting success", async ({
  page,
}) => {
  const statuses = new Map<string, string>([
    ["id-0", "accepted"],
    ["id-1", "accepted"],
  ]);
  await stubAdminConsole(page, statuses);
  await stubBroadcast(page);
  page.on("dialog", (d) => d.accept());

  // The API takes the request and emails nobody -- the incident's signature.
  await page.route("**/api/admin/broadcast", (r) =>
    r.fulfill({
      json: {
        num_sent: 0,
        email_failures: 2,
        failed_ids: ["id-0", "id-1"],
        skipped: [],
      },
    }),
  );

  await openEmail(page);
  await page.getByLabel("Subject").fill("RSVP deadline is this Friday");
  await page.getByLabel("Message").fill("Please RSVP by Friday.");
  await page.getByRole("button", { name: "Send to 2 people" }).click();

  await expect(page.getByText(/did NOT send/)).toBeVisible();
});

test("a test send goes to the admin only", async ({ page }) => {
  const statuses = new Map<string, string>([["id-0", "accepted"]]);
  await stubAdminConsole(page, statuses);
  await stubBroadcast(page);

  let sends = 0;
  await page.route("**/api/admin/broadcast", async (r) => {
    sends += 1;
    await r.fulfill({
      json: { num_sent: 1, email_failures: 0, failed_ids: [], skipped: [] },
    });
  });
  const tests: unknown[] = [];
  await page.route("**/api/admin/broadcast/test", async (r) => {
    tests.push(r.request().postDataJSON());
    await r.fulfill({ json: { num_sent: 1, email_failures: 0 } });
  });

  await openEmail(page);
  await page.getByLabel("Subject").fill("RSVP deadline is this Friday");
  await page.getByLabel("Message").fill("Please RSVP by Friday.");
  await page.getByRole("button", { name: "Send test to me" }).click();

  await expect(page.getByText("Test email sent to you.")).toBeVisible();
  expect(tests).toEqual([
    {
      subject: "RSVP deadline is this Friday",
      message: "Please RSVP by Friday.",
    },
  ]);
  expect(sends).toBe(0);
});

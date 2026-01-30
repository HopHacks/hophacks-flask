import { test, expect } from '@playwright/test';

test('assignments page renders without crashing', async ({ page }) => {
  await page.goto('/assignments', { waitUntil: 'domcontentloaded' });
  const table = page.locator('table');
  await expect(table).toBeVisible();
  //confirms correct rendering
  await expect(page.getByText('Judge')).toBeVisible();
  await expect(page.getByText('Submissions')).toBeVisible();
  const rows = page.locator('tbody tr');
  const rowCount = await rows.count();
  //ensuring data is visible
  if (rowCount > 0) {
    await expect(rows.first()).toBeVisible();
  }
  await expect(page.locator('body')).toBeVisible();
});

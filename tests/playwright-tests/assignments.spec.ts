import { test, expect } from '@playwright/test';

test('assignments page renders without crashing', async ({ page }) => {
  await page.goto('/assignments', { waitUntil: 'domcontentloaded' });

  // Core structure must render
  const table = page.locator('table');
  await expect(table).toBeVisible();

  // Headers must exist (this confirms React rendered correctly)
  await expect(page.getByText('Judge')).toBeVisible();
  await expect(page.getByText('Submissions')).toBeVisible();

  const rows = page.locator('tbody tr');
  const rowCount = await rows.count();

  // If data exists, ensure it is actually visible
  if (rowCount > 0) {
    await expect(rows.first()).toBeVisible();
  }

  // Core assertion: page did not crash or blank
  await expect(page.locator('body')).toBeVisible();
});

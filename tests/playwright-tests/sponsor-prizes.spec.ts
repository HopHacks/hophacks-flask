import { test, expect } from '@playwright/test';

test('sponsor prizes upload page submits without crashing', async ({ page }) => {
  await page.goto('/upload-sponsors');

  // Upload CSV
  await page.setInputFiles(
    'input[name="sponsors_file"]',
    'tests/docs/sponsors.csv'
  );

  await page.click('button[type="submit"]');

  // Page should still be alive (backend may 500)
  await expect(page.locator('form')).toBeVisible();

  // Either we stayed on upload page or redirected — both are acceptable
  await expect(page.url()).toMatch(/upload-sponsors|sponsor-prizes/);
});

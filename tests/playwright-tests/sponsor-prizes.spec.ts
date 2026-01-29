import { test, expect } from '@playwright/test';

test('sponsor prizes upload page submits without crashing', async ({ page }) => {
  await page.goto('/upload-sponsors');
  //uploading file
  await page.setInputFiles(
    'input[name="sponsors_file"]',
    'tests/docs/sponsors.csv'
  );

  await page.click('button[type="submit"]');
  await expect(page.locator('form')).toBeVisible();
  await expect(page.url()).toMatch(/upload-sponsors|sponsor-prizes/);
});

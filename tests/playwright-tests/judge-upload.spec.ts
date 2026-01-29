import { test, expect } from '@playwright/test';

test('judge tool upload page submits without crashing', async ({ page }) => {
  await page.goto('/upload');

  // Upload required files
  await page.setInputFiles(
    'input[name="sfile"]',
    'tests/docs/submissions.csv'
  );
  await page.setInputFiles(
    'input[name="jfile"]',
    'tests/docs/judges.csv'
  );
  await page.setInputFiles(
    'input[name="room_file"]',
    'tests/docs/rooms.csv'
  );

  await page.fill('input[name="ifile"]', '2');
  await page.click('button[type="submit"]');

  // Core assertion: page did not crash
  await expect(page.locator('form')).toBeVisible();

  // Accept either staying on upload or redirecting
  await expect(page.url()).toMatch(/upload|assignments/);
});

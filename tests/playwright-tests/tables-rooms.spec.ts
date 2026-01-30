import { test, expect } from '@playwright/test';

test('tables and rooms page loads', async ({ page }) => {
  await page.goto('/tables');
  //table renders
  await expect(page.locator('table')).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: /room/i })
  ).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: /teams and table numbers/i })
  ).toBeVisible();
  await expect(page.locator('tbody')).toHaveCount(1);
});

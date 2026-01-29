import { test, expect } from '@playwright/test';

test('user can reach registration gateway', async ({ page }) => {
  await page.goto('/');

  const registerSection = page.locator('#register-section');
  await expect(registerSection).toBeVisible();

  const hackLink = registerSection.getByRole('link', { name: 'Hack Bird' });

  await hackLink.evaluate(node => node.removeAttribute('target'));
  await hackLink.click();

  //login loads
  await expect(
    page.getByRole('heading', { name: /login/i })
  ).toBeVisible();
});

test('user can complete registration when apply is open', async ({ page }) => {
  await page.goto('/');

  const registerSection = page.locator('#register-section');
  const hackLink = registerSection.getByRole('link', { name: 'Hack Bird' });
  await hackLink.evaluate(node => node.removeAttribute('target'));
  await hackLink.click();

  const applyNow = page.getByRole('link', { name: /apply now/i });

  // 🚦 Gate test correctly
  if ((await applyNow.count()) === 0) {
    test.skip(true, 'Registration is currently closed');
  }

  await applyNow.click();

  // ---- ACCOUNT PAGE ----
  await expect(page.getByText(/enter credentials/i)).toBeVisible();

  const email = `test${Date.now()}@example.com`;
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill('Password1!');
  await page.getByLabel('Confirm Password').fill('Password1!');
  await page.getByRole('button', { name: /next/i }).click();

  // ---- PROFILE PAGE ----
  await expect(page.getByText(/basic info/i)).toBeVisible();

  await page.getByLabel('First Name').fill('Test');
  await page.getByLabel('Last Name').fill('User');
  await page.getByLabel('Age').fill('20');
  await page.getByLabel(/gender/i).selectOption({ label: 'Male' });
  await page.getByLabel(/ethnicity/i).selectOption({ label: 'Asian' });

  await page.getByLabel(/school/i).fill('Johns Hopkins');
  await page.keyboard.press('Enter');
  await page.getByLabel(/major/i).fill('Computer Science');
  await page.keyboard.press('Enter');

  await page.getByRole('button', { name: /next/i }).click();

  // ---- CHECKS PAGE ----
  await expect(page.getByText(/additional info/i)).toBeVisible();

  await page.getByLabel(/first time attending a hackathon/i).selectOption('Yes');
  await page.getByLabel(/first time attending hophacks/i).selectOption('Yes');
  await page.getByLabel(/how did you learn about us/i).selectOption('Friend');
  await page.getByLabel(/linkedin/i).fill('https://linkedin.com/in/test');

  await page.setInputFiles('input[type="file"]', 'tests/docs/resume.jpeg');

  await page.getByLabel(/authorize.*resume/i).check();
  await page.getByLabel(/mlh code of conduct/i).check();
  await page.getByLabel(/mlh terms/i).check();

  await page.getByRole('button', { name: /next/i }).click();

  await expect(
    page.getByText(/profile created|excited to have you/i)
  ).toBeVisible();
});


import { test, expect } from '@playwright/test';
test('wrong invite blocked, judges invite admitted', async ({ page }) => {
  await page.goto('/'); await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: /Invite code/ }).fill('WRONG');
  await page.getByRole('checkbox', { name: /I confirm I am 18/ }).check();
  await page.getByRole('checkbox', { name: /never leave my laser unattended/ }).check();
  await page.getByRole('checkbox', { name: /No personal photos/ }).check();
  await page.getByRole('button', { name: /enter the workshop/i }).click();
  await expect(page.getByText(/Invalid invite/)).toBeVisible();
  await page.getByRole('textbox', { name: /Invite code/ }).fill('DEMO-JUDGES');
  await page.getByRole('button', { name: /enter the workshop/i }).click();
  await expect(page.getByRole('heading', { name: /workshop/i })).toBeVisible();
});

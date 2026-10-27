import { test, expect } from '@playwright/test';
test('wrong invite blocked, judges invite admitted', async ({ page }) => {
  await page.goto('/snap/welcome'); await page.waitForLoadState('networkidle');
  await page.getByLabel(/Invite code/).fill('WRONG');
  await page.getByLabel(/I confirm I am 18/).check();
  await page.getByLabel(/never leave my laser unattended/).check();
  await page.getByLabel(/No personal photos/).check();
  await page.getByRole('button', { name: /enter the workshop/i }).click();
  await expect(page.getByText(/Invalid invite/)).toBeVisible();
  await page.getByLabel(/Invite code/).fill('DEMO-JUDGES');
  await page.getByRole('button', { name: /enter the workshop/i }).click();
  await expect(page.getByRole('heading', { name: /workshop/i })).toBeVisible();
});

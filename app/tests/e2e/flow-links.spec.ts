import { test, expect } from '@playwright/test';

test('the cost pill opens Under the hood', async ({ page }) => {
  await page.goto('/snap'); await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: /\$0\.00 · 0 models/ }).click();
  await expect(page).toHaveURL(/\/snap\/hood$/);
  await expect(page.getByLabel('Under the hood')).toBeVisible();
});

test('a suggestion chip opens the camera', async ({ page }) => {
  await page.goto('/snap'); await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Coasters from my sketch' }).click();
  await expect(page).toHaveURL(/\/snap\/capture$/);
});

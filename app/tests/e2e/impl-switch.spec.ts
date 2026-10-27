import { test, expect } from '@playwright/test';
test('switch Laser -> Cricut re-plans pieces', async ({ page }) => {
  await page.goto('/snap'); await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /build plan/i }).click();
  await expect(page.getByText(/holder-base/)).toBeVisible();
  await page.getByText('Cricut · P2').click();
  await page.getByRole('button', { name: /build plan/i }).click();
  await expect(page.getByText(/holder-blank/)).toBeVisible();
  await expect(page.getByText(/Export is Phase 2/)).toBeVisible();
});

import { test, expect } from '@playwright/test';
test('switch Laser -> Cricut re-plans pieces (plan stage)', async ({ page }) => {
  await page.goto('/plan'); await page.waitForLoadState('networkidle');
  await expect(page.getByText(/holder-base/)).toBeVisible();
  await page.getByText('Cricut · P2').click();
  await expect(page.getByText(/holder-blank/)).toBeVisible();
  // Client-side navigation keeps the chosen device: the canvas offers Cricut preview, not laser export.
  await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Canvas' }).click();
  await expect(page.getByText(/Export is Phase 2/)).toBeVisible();
});

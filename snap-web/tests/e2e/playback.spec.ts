import { test, expect } from '@playwright/test';
test('playback with no device: seek + assembly', async ({ page }) => {
  await page.goto('/snap'); await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /build plan/i }).click();
  await expect(page.getByLabel('Simulate')).toBeVisible();
  await expect(page.getByLabel('Assembly')).toContainText('Exploded');
  await page.getByLabel('Assembly').locator('input[type=range]').fill('100');
  await expect(page.getByLabel('Assembly')).toContainText('Assembled');
});

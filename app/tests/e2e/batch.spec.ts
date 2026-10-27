import { test, expect } from '@playwright/test';
test('wonder batch produces a production plan', async ({ page }) => {
  await page.goto('/snap/batch'); await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /start batch job/i }).click();
  await expect(page.getByLabel('Production plan')).toContainText('4 sheets');
});

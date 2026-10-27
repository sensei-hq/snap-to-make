import { test, expect } from '@playwright/test';
test('burn watch recorded: event timeline renders', async ({ page }) => {
  await page.goto('/snap/watch'); await page.waitForLoadState('networkidle');
  await expect(page.getByText(/Advisory only/)).toBeVisible();
  await expect(page.getByLabel('Event timeline')).toContainText(/flare/i);
});

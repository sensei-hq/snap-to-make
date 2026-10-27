import { test, expect } from '@playwright/test';
test('workshop shell renders with mic and cost pill', async ({ page }) => {
  await page.goto('/snap'); await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: /workshop/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /talk|mic/i })).toBeVisible();
  await expect(page.getByText(/\$0\.00/).first()).toBeVisible();
});

import { test, expect } from '@playwright/test';

test('the cost pill opens Under the hood', async ({ page }) => {
  await page.goto('/workshop'); await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: /\$0\.00 · 0 models/ }).click();
  await expect(page).toHaveURL(/\/hood$/);
  await expect(page.getByLabel('Under the hood')).toBeVisible();
});

test('a suggestion in the assistant is said to Katachi', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/workshop'); await page.waitForLoadState('networkidle');
  const assistant = page.getByRole('complementary', { name: 'Katachi chat' });
  await assistant.getByRole('group', { name: 'Suggestions' }).getByRole('button', { name: 'A layered mountain picture' }).click();
  await expect(assistant.getByRole('log', { name: 'Katachi conversation' })).toContainText('A layered mountain picture');
  await expect(page).toHaveURL(/\/capture$/);
});

import { test, expect } from '@playwright/test';

test('the cost pill opens Under the hood', async ({ page }) => {
  await page.goto('/snap'); await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: /\$0\.00 · 0 models/ }).click();
  await expect(page).toHaveURL(/\/snap\/hood$/);
  await expect(page.getByLabel('Under the hood')).toBeVisible();
});

test('a suggestion in the assistant is said to Katachi', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.route('**/api/scene', (r) => r.fulfill({ json: { measure: null, trace: [] } }));
  await page.goto('/snap'); await page.waitForLoadState('networkidle');
  const assistant = page.getByRole('complementary', { name: 'Katachi chat' });
  await assistant.getByRole('group', { name: 'Suggestions' }).getByRole('button', { name: 'Coasters from my sketch' }).click();
  await expect(assistant.getByRole('region', { name: 'Katachi conversation' })).toContainText('Coasters from my sketch');
  await expect(page.getByRole('main').getByRole('button', { name: 'Coasters from my sketch' })).toHaveCount(0);
});

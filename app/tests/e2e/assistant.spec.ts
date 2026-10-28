import { test, expect } from '@playwright/test';

test.describe('three parts: nav · work area · assistant (1280×800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test('the Katachi mark appears once, in the nav; the bot speaks only in the assistant', async ({ page }) => {
    await page.goto('/snap'); await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-brand-mark]:visible')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Studio sections' }).locator('[data-brand-mark]')).toBeVisible();
    const assistant = page.getByRole('complementary', { name: 'Katachi chat' });
    await expect(assistant).toContainText('what are we making today');
    await expect(page.getByRole('main')).not.toContainText('what are we making today');
  });
  test('measuring posts the reply in the assistant', async ({ page }) => {
    await page.route('**/api/scene', (r) => r.fulfill({ json: { measure: { status: 'measured', targets: [{ valueMm: 82 }] }, trace: [] } }));
    await page.goto('/snap'); await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('make four coasters 3 mm birch').fill('make four coasters 3 mm birch');
    await page.getByRole('button', { name: /snap & measure/i }).click();
    const assistant = page.getByRole('complementary', { name: 'Katachi chat' });
    await expect(assistant).toContainText('make four coasters 3 mm birch');
    await expect(assistant).toContainText(/measured/i);
  });
});

test.describe('phone (390×844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('the mark sits in the nav bar once; the assistant opens as a sheet', async ({ page }) => {
    await page.goto('/snap'); await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-brand-mark]:visible')).toHaveCount(1);
    await expect(page.getByRole('main')).not.toContainText('what are we making today');
    await page.getByRole('button', { name: 'Open Katachi chat' }).click();
    await expect(page.getByRole('dialog', { name: 'Katachi chat' })).toContainText('what are we making today');
  });
});

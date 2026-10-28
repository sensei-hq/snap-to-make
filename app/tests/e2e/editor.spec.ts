import { test, expect } from '@playwright/test';
import { seedProject } from './seed';

test.describe('desktop editor and studio tools (1280×800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('the work area edits the open craft: pick a sheet, rename it, change its laser settings', async ({ page }) => {
    await seedProject(page);
    await page.goto('/canvas'); await page.waitForLoadState('networkidle');
    const toolbar = page.getByRole('toolbar', { name: 'Editor' });
    await toolbar.getByRole('button', { name: 'Zoom in' }).click();
    await expect(toolbar).toContainText('125%');
    await page.getByRole('navigation', { name: 'Sheets' }).getByRole('button', { name: /Sun/ }).click();
    const sheet = page.getByRole('complementary', { name: 'Sheet' });
    await expect(sheet).toContainText('Sheet 02');
    await sheet.getByRole('textbox', { name: 'Name' }).fill('Moon');
    await sheet.getByRole('textbox', { name: 'Name' }).press('Tab');
    await expect(page.getByRole('navigation', { name: 'Sheets' })).toContainText('Moon');
    await sheet.getByRole('radio', { name: 'Engrave' }).click();
    await expect(toolbar).toContainText('engrave · 35% power');
  });

  test('settings switches density; materials lists the starting presets', async ({ page }) => {
    await page.goto('/settings'); await page.waitForLoadState('networkidle');
    await page.getByRole('radio', { name: 'Compact' }).click();
    await expect(page.locator('body')).toHaveAttribute('data-density', 'compact');
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Materials' }).click();
    await expect(page.getByRole('grid', { name: 'Material presets' })).toContainText('Birch plywood');
  });
});

test.describe('phone work area', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('without a craft it says what it is for; with one, the sheet is on the bed and no toolbar', async ({ page }) => {
    await page.goto('/canvas'); await page.waitForLoadState('networkidle');
    await expect(page.getByRole('region', { name: 'No craft open' })).toBeVisible();
    await seedProject(page);
    await page.goto('/canvas'); await page.waitForLoadState('networkidle');
    await expect(page.getByRole('img', { name: /on the bed/ })).toBeVisible();
    await expect(page.getByRole('toolbar', { name: 'Editor' })).toBeHidden();
  });
});

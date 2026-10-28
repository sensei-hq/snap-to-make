import { test, expect } from '@playwright/test';

test.describe('desktop editor and studio tools (1280×800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('the canvas becomes an editor: toolbar, zoom, properties panel replaces the chat', async ({ page }) => {
    await page.goto('/snap/canvas'); await page.waitForLoadState('networkidle');
    const toolbar = page.getByRole('toolbar', { name: 'Editor' });
    await expect(toolbar).toBeVisible();
    await toolbar.getByRole('button', { name: 'Zoom in' }).click();
    await expect(toolbar).toContainText('125%');
    await page.getByRole('button', { name: 'Toggle properties panel' }).click();
    const props = page.getByRole('complementary', { name: 'Properties' });
    await expect(props).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Katachi chat' })).toBeHidden();
    await props.getByRole('radio', { name: 'Engrave' }).click();
    await expect(toolbar).toContainText('engrave · 35% power');
    await props.getByRole('tab', { name: 'Job' }).click();
    await expect(props).toContainText('Fits the bed');
  });

  test('settings switches density; materials lists the starting presets', async ({ page }) => {
    await page.goto('/snap/settings'); await page.waitForLoadState('networkidle');
    await page.getByRole('radio', { name: 'Compact' }).click();
    await expect(page.locator('body')).toHaveAttribute('data-density', 'compact');
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Materials' }).click();
    await expect(page.getByRole('table', { name: 'Material presets' })).toContainText('Birch plywood');
  });
});

test.describe('phone keeps the simple canvas', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('no editor toolbar below 1024 px', async ({ page }) => {
    await page.goto('/snap/canvas'); await page.waitForLoadState('networkidle');
    await expect(page.getByRole('img', { name: /Nested sheet layout/ })).toBeVisible();
    await expect(page.getByRole('toolbar', { name: 'Editor' })).toBeHidden();
  });
});

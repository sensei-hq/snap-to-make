import { test, expect } from '@playwright/test';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

test.describe('a project: start, name, gate, save, reopen (1280×800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('without a project the flow sends you to the start', async ({ page }) => {
    await page.goto('/make/layers'); await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/workshop$/);
    await expect(page.getByRole('region', { name: 'Start a craft' })).toBeVisible();
  });

  test('Layered picture → capture an upload → named from the file → steps unlock as you go → reopened from Recent crafts', async ({ page }) => {
    await page.goto('/workshop'); await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Layered picture/ }).click();
    await expect(page).toHaveURL(/\/capture$/);
    await expect(page.getByRole('radio', { name: 'Upload' })).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByRole('main').getByRole('button', { name: /Choose/ })).toHaveCount(1);
    await page.setInputFiles('input[type="file"]', [{ name: 'alpine-forest.png', mimeType: 'image/png', buffer: png }]);
    await page.getByRole('main').getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/\/make\/import$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Alpine forest');
    const tabs = page.getByRole('navigation', { name: 'Craft steps' });
    await expect(tabs.getByRole('link', { name: /Layers/ })).toHaveCount(0);
    await page.goto('/make/gaps'); await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/make\/import$/);
    await page.getByRole('main').getByRole('button', { name: 'Find the outline' }).click();
    await page.getByRole('main').getByRole('button', { name: 'Find the objects' }).click();
    await page.getByRole('main').getByRole('button', { name: /Separate into layers/ }).click();
    await expect(page).toHaveURL(/\/make\/layers$/);
    await expect(tabs.getByRole('link', { name: /Layers/ })).toBeVisible();
    await page.reload(); await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Alpine forest');
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Continue' })).toContainText('Step 3 of 5 · Layers');
    await page.getByRole('region', { name: 'Recent crafts' }).getByRole('button', { name: 'Open Alpine forest' }).click();
    await expect(page).toHaveURL(/\/make\/layers$/);
  });

  test('the rail opens the current craft where you left it', async ({ page }) => {
    await page.goto('/workshop'); await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /3D object/ }).click();
    await page.getByRole('radio', { name: 'Single shot' }).click();
    await page.getByRole('button', { name: 'Take photo' }).click();
    await page.getByRole('main').getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Photo · /);
    await page.getByRole('main').getByRole('button', { name: 'Find the outline' }).click();
    await expect(page).toHaveURL(/\/make\/cutout$/);
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Work area' }).click();
    await expect(page).toHaveURL(/\/canvas$/);
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Current craft' }).click();
    await expect(page).toHaveURL(/\/make\/cutout$/);
  });
});

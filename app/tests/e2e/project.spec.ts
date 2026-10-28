import { test, expect } from '@playwright/test';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

test.describe('a project: start, name, gate, save, reopen (1280×800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('without a project the flow sends you to the start', async ({ page }) => {
    await page.goto('/make/layers'); await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/workshop$/);
    await expect(page.getByRole('button', { name: 'New project' })).toBeVisible();
  });

  test('New → capture an upload → named from the file → steps unlock as you go → reopened from Open', async ({ page }) => {
    await page.goto('/workshop'); await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'New project' }).click();
    await expect(page).toHaveURL(/\/capture$/);
    await page.getByRole('radio', { name: 'Upload' }).click();
    await expect(page.getByRole('main').getByRole('button', { name: /Choose/ })).toHaveCount(1);
    await page.setInputFiles('input[type="file"]', [{ name: 'alpine-forest.png', mimeType: 'image/png', buffer: png }]);
    await page.getByRole('main').getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/\/make\/import$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Alpine forest');
    const tabs = page.getByRole('navigation', { name: 'Image to layers steps' });
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
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Workshop' }).click();
    await page.getByRole('button', { name: 'New project' }).click();
    await page.goto('/workshop'); await page.waitForLoadState('networkidle');
    await page.getByRole('region', { name: 'Open a project' }).getByRole('button', { name: /Alpine forest/ }).click();
    await expect(page).toHaveURL(/\/make\/layers$/);
  });

  test('the rail opens the current project where you left it', async ({ page }) => {
    await page.goto('/workshop'); await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByRole('button', { name: 'Take photo' }).click();
    await page.getByRole('main').getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Photo · /);
    await page.getByRole('main').getByRole('button', { name: 'Find the outline' }).click();
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Canvas' }).click();
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Image to layers' }).click();
    await expect(page).toHaveURL(/\/make\/cutout$/);
  });
});

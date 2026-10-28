import { test, expect, type Page } from '@playwright/test';

async function walk(page: Page) {
  await page.goto('/snap/layers/source'); await page.waitForLoadState('networkidle');
  const steps = page.getByRole('navigation', { name: 'Image to layers steps' });
  await expect(steps).toContainText('Source');
  await page.getByRole('radio', { name: /Flat · layered art/ }).check();
  await page.getByRole('button', { name: 'Find the outline' }).click();
  await expect(page).toHaveURL(/\/snap\/layers\/cutout$/);
  await page.getByRole('button', { name: 'Find the objects' }).click();
  await expect(page).toHaveURL(/\/snap\/layers\/objects$/);
  await expect(page.getByRole('region', { name: 'Regions', exact: true })).toContainText(/kept/);
  await page.getByRole('button', { name: /Split into layers/ }).click();
  await expect(page).toHaveURL(/\/snap\/layers\/layers$/);
  await expect(page.getByRole('region', { name: 'Layer stack', exact: true })).toContainText('Sky');
  await page.getByRole('button', { name: /Fill the gaps/ }).click();
  await expect(page).toHaveURL(/\/snap\/layers\/gaps$/);
  await page.getByRole('radio', { name: /Leave it open/ }).check();
  await page.getByRole('button', { name: /Pick materials/ }).click();
  await expect(page).toHaveURL(/\/snap\/layers\/material$/);
  await page.getByRole('button', { name: /Ready to cut/ }).click();
  await expect(page).toHaveURL(/\/snap\/layers\/cut$/);
  await page.getByRole('radio', { name: /xTool S1 laser/ }).check();
  await expect(page.getByRole('button', { name: 'Start cut' })).toBeVisible();
}

test.describe('image → layers · phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('walks source → cutout → objects → layers → gaps → material → cut', async ({ page }) => { await walk(page); });
});

test.describe('image → layers · studio', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test('walks the same seven steps', async ({ page }) => { await walk(page); });
  test('the camera forks into six views and reference', async ({ page }) => {
    await page.goto('/snap/capture'); await page.waitForLoadState('networkidle');
    await page.getByRole('navigation', { name: 'Source' }).getByRole('link', { name: '6 views' }).click();
    await expect(page).toHaveURL(/\/snap\/layers\/views$/);
    await expect(page.getByRole('region', { name: 'Views', exact: true })).toContainText('Left');
  });
});

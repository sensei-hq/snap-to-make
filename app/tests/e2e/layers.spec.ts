import { test, expect, type Page } from '@playwright/test';

async function next(page: Page, name: RegExp | string, url: RegExp) {
  await page.getByRole('button', { name }).click();
  await expect(page).toHaveURL(url);
}

test.describe('image → layers · studio: work area + assistant (Chat | Info)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test('walks seven steps; controls live in Info, guidance in Chat', async ({ page }) => {
    await page.goto('/snap/layers/source'); await page.waitForLoadState('networkidle');
    const assistant = page.getByRole('complementary', { name: 'Katachi chat' });
    await assistant.getByRole('radio', { name: /Flat · layered art/ }).check();
    await next(page, 'Find the outline', /\/snap\/layers\/cutout$/);
    await next(page, 'Find the objects', /\/snap\/layers\/objects$/);
    await expect(assistant.getByRole('region', { name: 'Regions', exact: true })).toContainText(/kept/);
    await assistant.getByRole('tab', { name: 'Chat' }).click();
    await expect(assistant).toContainText('I found 5 regions');
    await expect(assistant.getByRole('link', { name: 'Next · Layers' })).toBeVisible();
    await next(page, /Split into layers/, /\/snap\/layers\/layers$/);
    await expect(page.getByRole('region', { name: 'Layer stack', exact: true })).toContainText('Sky');
    await next(page, /Fill the gaps/, /\/snap\/layers\/gaps$/);
    await assistant.getByRole('radio', { name: /Leave it open/ }).check();
    await next(page, /Pick materials/, /\/snap\/layers\/material$/);
    await next(page, /Ready to cut/, /\/snap\/layers\/cut$/);
    await assistant.getByRole('radio', { name: /xTool S1 laser/ }).check();
    await expect(page.getByRole('button', { name: 'Start cut' })).toBeVisible();
  });

  test('six captured sides unfold into the six-view step', async ({ page }) => {
    await page.goto('/snap/capture'); await page.waitForLoadState('networkidle');
    await page.getByRole('radio', { name: '6 sides' }).click();
    for (let i = 0; i < 6; i++) await page.getByRole('button', { name: 'Take photo' }).click();
    await expect(page.getByText('All 6 sides captured')).toBeVisible();
    await page.getByRole('main').getByRole('button', { name: 'Unfold into parts' }).click();
    await expect(page).toHaveURL(/\/snap\/layers\/views$/);
    await expect(page.getByRole('region', { name: 'Views', exact: true })).toContainText('Left');
  });
});

test.describe('image → layers · phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('Next walks the steps; the sheet holds the step info', async ({ page }) => {
    await page.goto('/snap/layers/source'); await page.waitForLoadState('networkidle');
    await next(page, 'Find the outline', /\/snap\/layers\/cutout$/);
    await next(page, 'Find the objects', /\/snap\/layers\/objects$/);
    await page.getByRole('button', { name: 'Open Katachi chat' }).click();
    await expect(page.getByRole('dialog', { name: 'Katachi chat' }).getByRole('region', { name: 'Regions', exact: true })).toBeVisible();
  });
});

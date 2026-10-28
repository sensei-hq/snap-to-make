import { test, expect } from '@playwright/test';

test.describe('phone layout below 1024 px', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('icon nav docked at the bottom (sections + Katachi); the rail and chat panel are hidden; the composer is in the sheet', async ({ page }) => {
    await page.goto('/snap'); await page.waitForLoadState('networkidle');
    const nav = page.getByRole('navigation', { name: 'Snap sections' });
    await expect(nav).toBeVisible();
    const box = await nav.boundingBox();
    expect(box && box.y + box.height).toBeGreaterThan(800);
    await expect(nav.getByRole('link', { name: 'Burn Watch' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Studio sections' })).toBeHidden();
    await expect(page.getByRole('complementary', { name: 'Katachi chat' })).toBeHidden();
    await nav.getByRole('button', { name: 'Open Katachi chat' }).click();
    await expect(page.getByRole('dialog', { name: 'Katachi chat' }).getByRole('group', { name: 'Ask Katachi' })).toBeVisible();
  });
});

test.describe('studio layout at 1024 px and up (tablet landscape, desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test('shows the rail and the chat panel, hides the phone icon nav', async ({ page }) => {
    await page.goto('/snap'); await page.waitForLoadState('networkidle');
    await expect(page.getByRole('navigation', { name: 'Studio sections' })).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Katachi chat' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Snap sections' })).toBeHidden();
  });

  test('state survives navigation between sections', async ({ page }) => {
    await page.route('**/api/scene', (route) => route.fulfill({ json: { measure: null, trace: [{ model: 'muse-spark-1.3', purpose: 'analyze_scene', latencyMs: 10, costUsd: 0.02 }] } }));
    await page.goto('/snap'); await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /snap & measure/i }).click();
    await expect(page.getByText('$0.02 · 1 models').first()).toBeVisible();
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Burn Watch' }).click();
    await expect(page.getByRole('heading', { name: 'Burn Watch' })).toBeVisible();
    await page.getByRole('navigation', { name: 'Studio sections' }).getByRole('link', { name: 'Workshop' }).click();
    await expect(page.getByText('$0.02 · 1 models').first()).toBeVisible();
  });

  test('every page has a Katachi title', async ({ page }) => {
    for (const [path, title] of [['/snap', 'Katachi · Workshop'], ['/snap/watch', 'Katachi · Burn Watch'], ['/snap/welcome', 'Katachi · Welcome']]) {
      await page.goto(path);
      await expect(page).toHaveTitle(title);
    }
  });
});

test('the root opens the gate', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/snap\/welcome$/);
});

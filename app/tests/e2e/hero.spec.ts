import { test, expect, type Page } from '@playwright/test';

// Deterministic regardless of a live META_API_KEY on the dev server.
async function fixtures(page: Page) {
  await page.route('**/api/scene', (route) => route.fulfill({ json: { scene: { objects: [], reference: { objectId: 'o3', kind: 'id1_card' }, camera: { topDownConfidence: 0.9 }, notes: 'mock' }, measure: { status: 'measured', pxPerMm: 10, targets: [{ objectId: 'o2', kind: 'diameter', valueMm: 82, confidence: 0.95 }] }, source: 'fixture', trace: [{ model: 'muse-spark-1.3', purpose: 'analyze_scene', latencyMs: 10, costUsd: 0.01 }, { model: 'sam-3.1', purpose: 'mask mug base', latencyMs: 5, costUsd: 0.01 }] } }));
}

async function hero(page: Page) {
  await fixtures(page);
  await page.goto('/workshop'); await page.waitForLoadState('networkidle');
  await page.getByPlaceholder('make four coasters 3 mm birch').fill('make four coasters 3 mm birch');
  await page.getByRole('button', { name: /snap & measure/i }).click();
  // Scene: measured, editable.
  await expect(page).toHaveURL(/\/scene$/);
  await expect(page.getByText(/Ø 82 mm/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Looks right' }).click();
  // Plan: derived from the mug (coaster 95 mm).
  await expect(page).toHaveURL(/\/plan$/);
  await expect(page.getByLabel('Build plan')).toContainText('holder-base');
  await expect(page.getByLabel('Build plan')).toContainText('95 × 95 mm');
  await page.getByRole('button', { name: 'Looks good' }).click();
  // Art → preview → canvas.
  await expect(page).toHaveURL(/\/art$/);
  await page.getByRole('button', { name: /Use take/ }).click();
  await expect(page).toHaveURL(/\/preview$/);
  await expect(page.getByRole('region', { name: 'Preview' })).toContainText('Ø 95 mm');
  await page.getByRole('button', { name: 'Make it' }).click();
  await expect(page).toHaveURL(/\/canvas$/);
  await expect(page.getByRole('img', { name: /Nested sheet layout/ })).toBeVisible();
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByLabel('Simulate')).toContainText(/engrave|cut/);
  // The cost pill opens Under the hood with the session's calls.
  await page.getByRole('link', { name: /models/ }).first().click();
  await expect(page.getByLabel('Under the hood')).toContainText('muse-spark-1.3');
}

test.describe('hero journey · studio (1280×800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test('workshop → scene → plan → art → preview → canvas → hood', async ({ page }) => { await hero(page); });
});

test.describe('hero journey · phone (390×844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('workshop → scene → plan → art → preview → canvas → hood', async ({ page }) => { await hero(page); });
});

test('canvas: "make the walls 5 mm taller" re-plans and the lid offer updates the sheet', async ({ page }) => {
  await fixtures(page);
  await page.goto('/canvas'); await page.waitForLoadState('networkidle');
  await expect(page.getByText(/Walls at 40 mm/)).toBeVisible();
  const ask = page.getByRole('complementary', { name: 'Katachi chat' }).getByRole('textbox');
  await ask.fill('Make the walls 5 mm taller'); await ask.press('Enter');
  await expect(page.getByText(/Walls at 45 mm/)).toBeVisible();
  await page.getByRole('button', { name: 'Add lid' }).click();
  await expect(page.getByText(/Lid added/)).toBeVisible();
});

test('scene: fixing a number changes the plan', async ({ page }) => {
  await fixtures(page);
  await page.goto('/workshop'); await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /snap & measure/i }).click();
  await page.getByRole('button', { name: 'Edit Mug base' }).click();
  await page.getByRole('spinbutton', { name: /Mug base/ }).fill('90');
  await page.getByRole('spinbutton', { name: /Mug base/ }).press('Enter');
  await page.getByRole('button', { name: 'Looks right' }).click();
  await expect(page.getByLabel('Build plan')).toContainText('103 × 103 mm');
});

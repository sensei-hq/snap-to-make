import { test, expect } from '@playwright/test';
test('hero: type -> measure -> plan -> simulate -> trace', async ({ page }) => {
  // Deterministic in CI/local regardless of a live META_API_KEY on the dev server.
  await page.route('**/api/scene', async (route) => {
    await route.fulfill({ json: { scene: { objects: [], reference: { objectId: 'o3', kind: 'id1_card' }, camera: { topDownConfidence: 0.9 }, notes: 'mock' }, measure: { status: 'measured', pxPerMm: 10, targets: [{ objectId: 'o2', kind: 'diameter', valueMm: 82, confidence: 0.95 }] }, source: 'fixture', trace: [{ model: 'muse-spark-1.3', purpose: 'analyze_scene', latencyMs: 10, costUsd: 0.01 }, { model: 'sam-3.1', purpose: 'mask mug base', latencyMs: 5, costUsd: 0.01 }] } });
  });
  await page.goto('/snap'); await page.waitForLoadState('networkidle');
  await page.getByPlaceholder('make four coasters 3 mm birch').fill('make four coasters 3 mm birch');
  await page.getByRole('button', { name: /snap & measure/i }).click();
  await expect(page.getByText(/Mug base Ø 82 mm/)).toBeVisible();
  await page.getByRole('button', { name: /build plan/i }).click();
  await expect(page.getByLabel('Build plan')).toBeVisible();
  await expect(page.getByText(/holder-base/)).toBeVisible();
  await expect(page.getByLabel('Under the hood')).toContainText('muse-spark-1.3');
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByLabel('Simulate')).toContainText(/engrave|cut/);
});

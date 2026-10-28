import { test, expect } from '@playwright/test';
import { seedProject } from './seed';
test('burn watch recorded: event timeline renders', async ({ page }) => {
  await page.goto('/watch'); await page.waitForLoadState('networkidle');
  await expect(page.getByText(/Advisory only/)).toBeVisible();
  await expect(page.getByLabel('Event timeline')).toContainText(/flare/i);
});
test('burn watch: acknowledging hides the alert', async ({ page }) => {
  await page.goto('/watch'); await page.waitForLoadState('networkidle');
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: 'I checked it' }).click();
  await expect(page.getByRole('alert')).toBeHidden();
});

test('with a craft open, Burn Watch lists its cuts like Sheets: send the next one, it is watched, the alert is cleared', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await seedProject(page);
  await page.goto('/watch'); await page.waitForLoadState('networkidle');
  const cuts = page.getByRole('region', { name: 'Cuts' });
  await expect(cuts.getByRole('listitem')).toHaveCount(6);
  await expect(cuts.getByRole('button', { name: 'Download .zip' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Watch stage' })).toContainText('Send the next sheet');
  await cuts.getByRole('listitem', { name: /Cut 01/ }).getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('heading', { name: /Cut 01/ })).toBeVisible();
  await expect(cuts.getByRole('listitem', { name: /Cut 01/ })).toContainText(/alert/);
  await page.getByRole('button', { name: 'I checked it' }).click();
  await expect(cuts.getByRole('listitem', { name: /Cut 01/ })).toContainText('clean');
});

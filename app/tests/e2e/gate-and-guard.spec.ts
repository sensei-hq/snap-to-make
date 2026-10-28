import { test, expect } from '@playwright/test';
import { inviteCode } from './invite';

// The gate is enforced on the server: no session, no pages and no API (R-PL-4/5).
test.use({ storageState: { cookies: [], origins: [] } });

test('without a session every page goes to the gate and the API refuses', async ({ page, request }) => {
  for (const path of ['/workshop', '/make/layers', '/capture']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/$/);
  }
  const r = await request.post('/api/scene', { data: {} });
  expect(r.status()).toBe(401);
  const forged = await request.post('/api/scene', { data: {}, headers: { cookie: 'snap_session=made-up.value' } });
  expect(forged.status()).toBe(401);
});

test('the gate says which part is wrong; a valid code opens the workshop', async ({ page }) => {
  await page.goto('/'); await page.waitForLoadState('networkidle');
  const enter = page.getByRole('button', { name: /enter the workshop/i });
  await enter.click();
  await expect(page.getByRole('status')).toHaveText('Enter your invite code');
  await page.getByRole('textbox', { name: /Invite code/ }).fill('WRONG');
  await enter.click();
  await expect(page.getByRole('status')).toHaveText('Tick all three to continue');
  await page.getByRole('checkbox', { name: /I confirm I am 18/ }).check();
  await page.getByRole('checkbox', { name: /never leave my laser unattended/ }).check();
  await page.getByRole('checkbox', { name: /No personal photos/ }).check();
  await enter.click();
  await expect(page.getByRole('status')).toHaveText('That invite code isn’t valid');
  await page.getByRole('textbox', { name: /Invite code/ }).fill(inviteCode());
  await enter.click();
  await expect(page).toHaveURL(/\/workshop$/);
  await expect(page.getByRole('heading', { name: /workshop/i })).toBeVisible();
});

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test('the welcome sits in two columns: the pitch beside the form', async ({ page }) => {
    await page.goto('/'); await page.waitForLoadState('networkidle');
    const pitch = await page.getByRole('heading', { level: 1 }).boundingBox();
    const form = await page.getByRole('textbox', { name: /Invite code/ }).boundingBox();
    expect(pitch && form && form.x > pitch.x + pitch.width - 1).toBe(true);
    await expect(page.getByPlaceholder('MAKER-2026')).toHaveCount(0);
  });
});

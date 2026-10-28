import { test, expect } from '@playwright/test';

test.describe('capture wizard (studio)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test('six sides: shoot, see which side is next, retake, view full size', async ({ page }) => {
    await page.goto('/snap/capture'); await page.waitForLoadState('networkidle');
    await page.getByRole('radio', { name: '6 sides' }).click();
    await expect(page.getByText('Shoot the front · 1 of 6')).toBeVisible();
    await page.getByRole('button', { name: 'Take photo' }).click();
    await page.getByRole('button', { name: 'Take photo' }).click();
    await expect(page.getByText('Shoot the back · 3 of 6')).toBeVisible();
    const strip = page.getByRole('radiogroup', { name: 'Captured images' });
    await expect(strip.getByRole('radio')).toHaveCount(6);
    await page.getByRole('button', { name: 'Retake right' }).click();
    await expect(page.getByText('Shoot the right · 2 of 6')).toBeVisible();
    await page.getByRole('button', { name: 'Toggle 3×3 grid' }).click();
    await expect(page.getByTestId('grid-guide')).toBeVisible();
  });

  test('upload mixes with camera shots in the same slots', async ({ page }) => {
    await page.goto('/snap/capture'); await page.waitForLoadState('networkidle');
    await page.getByRole('radio', { name: '6 sides' }).click();
    await page.getByRole('button', { name: 'Take photo' }).click();
    await page.getByRole('radio', { name: 'Upload' }).click();
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    await page.setInputFiles('input[type="file"][multiple]', [{ name: 'a.png', mimeType: 'image/png', buffer: png }, { name: 'b.png', mimeType: 'image/png', buffer: png }]);
    await expect(page.getByText('Shoot the left · 4 of 6')).toBeVisible();
  });
});

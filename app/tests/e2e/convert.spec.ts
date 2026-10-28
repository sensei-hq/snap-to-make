import { test, expect } from '@playwright/test';
test('convert: describe -> variations -> agree -> breakdown', async ({ page }) => {
  await page.route('**/api/convert', async (route) => { await route.fulfill({ json: { subject: 'coffin lantern', group: 'laser-cut', conversionClass: 'composite-3d', objective: 'Build a coffin lantern for laser-cut', variations: [{ title: 'As shown', change: 'Faithful' }, { title: 'Cat edition', change: 'Add a cat silhouette' }], piecesHint: ['faces'], source: 'fixture' } }); });
  await page.goto('/snap/convert'); await page.waitForLoadState('networkidle');
  await page.getByPlaceholder('A layered autumn wreath').fill('A coffin lantern for Halloween');
  await page.getByPlaceholder("It's a lantern").fill('make it smaller, add a cat');
  await page.getByRole('button', { name: /ask katachi to dissect/i }).click();
  await expect(page.getByLabel('Variations')).toBeVisible();
  await page.getByLabel('Variations').getByRole('button').first().click();
  await expect(page.getByLabel('Build breakdown')).toContainText('Assembly');
  await expect(page.getByLabel('Build breakdown')).toContainText('cut');
});
test('convert: shrink plastic shows scale-up guidance', async ({ page }) => {
  await page.goto('/snap/convert'); await page.waitForLoadState('networkidle');
  await page.getByLabel(/Shrink plastic/).check();
  await expect(page.getByText(/cut\/drawn larger/)).toBeVisible();
});
test('convert: uploaded photo stays visible, dissection + gallery show', async ({ page }) => {
  await page.route('**/api/convert', async (route) => { await route.fulfill({ json: { subject: 'Coffin lantern', group: 'laser-cut', conversionClass: 'composite-3d', objective: 'Build a coffin lantern', variations: [{ title: 'As shown', change: 'Faithful' }], piecesHint: ['front panel', 'side panels', 'slotted base'], source: 'live' } }); });
  await page.goto('/snap/convert'); await page.waitForLoadState('networkidle');
  const jpeg = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AvwH/2Q==', 'base64');
  await page.setInputFiles('input[type="file"]', { name: 'coffin.jpg', mimeType: 'image/jpeg', buffer: jpeg });
  await expect(page.getByRole('img', { name: 'Your uploaded project' })).toBeVisible();
  await expect(page.getByLabel('Dissection')).toContainText('Coffin lantern');
  await expect(page.getByLabel('Dissection')).toContainText('front panel');
  await expect(page.getByLabel('Guided chat')).toContainText('what I see');
  await page.getByLabel('Variations').getByRole('button').first().click();
  await expect(page.getByLabel('Piece gallery')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Your uploaded project' })).toBeVisible();
});
test('convert: dropping anywhere on the page does not navigate away', async ({ page }) => {
  await page.route('**/api/convert', async (route) => { await route.fulfill({ json: { subject: 'Dropped lantern', group: 'laser-cut', conversionClass: 'layered', objective: 'Build dropped lantern', variations: [{ title: 'As shown', change: 'Faithful' }], piecesHint: ['layer 1'], source: 'live' } }); });
  await page.goto('/snap/convert'); await page.waitForLoadState('networkidle');
  // Drop a file onto the header (far outside the drop box) — browser default would open the file full-page.
  await page.evaluate(async () => {
    const res = await fetch('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AvwH/2Q==');
    const blob = await res.blob();
    const file = new File([blob], 'dropped.jpg', { type: 'image/jpeg' });
    const dt = new DataTransfer(); dt.items.add(file);
    const target = document.querySelector('header')!;
    target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }));
    target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
  });
  await expect(page).toHaveURL(/\/snap\/convert/);
  await expect(page.getByRole('img', { name: 'Your uploaded project' })).toBeVisible();
});
test('convert: dissection pieces are tappable and show piece detail', async ({ page }) => {
  await page.route('**/api/convert', async (route) => { await route.fulfill({ json: { subject: 'Coffin lantern', group: 'laser-cut', conversionClass: 'composite-3d', objective: 'Build a coffin lantern', variations: [{ title: 'As shown', change: 'Faithful' }], pieces: [{ name: 'Front face', kind: 'face', note: 'Trace the front outline' }, { name: 'Base / stand', kind: 'base', note: 'Flat base the faces slot into' }], piecesHint: ['Front face', 'Base / stand'], source: 'live' } }); });
  await page.goto('/snap/convert'); await page.waitForLoadState('networkidle');
  const jpeg = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AvwH/2Q==', 'base64');
  await page.setInputFiles('input[type="file"]', { name: 'coffin.jpg', mimeType: 'image/jpeg', buffer: jpeg });
  await expect(page.getByLabel('Dissection')).toContainText('Coffin lantern');
  await page.getByRole('button', { name: 'Base / stand' }).click();
  await expect(page.getByLabel('Piece detail')).toContainText('Flat base the faces slot into');
});

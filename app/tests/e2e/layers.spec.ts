import { test, expect, type Page } from '@playwright/test';

async function next(page: Page, name: RegExp | string, url: RegExp) {
  await page.getByRole('main').getByRole('button', { name }).click();
  await expect(page).toHaveURL(url);
}

// mockups/desktop D1–D6: nav rail · top bar with six step tabs · left controls · work area · Katachi column
test.describe('image → layers · studio (1280×800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('six step tabs; cutout lights Segment, material lights Layers', async ({ page }) => {
    await page.goto('/snap/layers/cutout'); await page.waitForLoadState('networkidle');
    const tabs = page.getByRole('navigation', { name: 'Image to layers steps' });
    await expect(tabs.getByRole('link')).toHaveText([/Import/, /Segment/, /Layers/, /Gaps/, /6 views/, /Output/]);
    await expect(tabs.getByRole('link', { name: /Segment/ })).toHaveAttribute('aria-current', 'step');
    await tabs.getByRole('link', { name: /Layers/ }).click();
    await expect(page).toHaveURL(/\/snap\/layers\/layers$/);
    await page.goto('/snap/layers/material'); await page.waitForLoadState('networkidle');
    await expect(tabs.getByRole('link', { name: /Layers/ })).toHaveAttribute('aria-current', 'step');
    await expect(page.getByRole('navigation', { name: 'Studio sections' })).toBeVisible();
  });

  test('controls sit in the left panel; Katachi talks in the right column with no tabs', async ({ page }) => {
    await page.goto('/snap/layers/objects'); await page.waitForLoadState('networkidle');
    const assistant = page.getByRole('complementary', { name: 'Katachi chat' });
    const controls = page.getByRole('complementary', { name: 'Step controls' });
    await expect(assistant.getByRole('tab')).toHaveCount(0);
    await expect(assistant).toContainText('I found 5 regions');
    await expect(assistant.getByRole('group', { name: 'Suggestions' }).getByRole('button', { name: 'Raise the sun on a spacer' })).toBeVisible();
    const regions = controls.getByRole('region', { name: 'Regions', exact: true });
    await expect(regions).toContainText('4 of 5 kept');
    await regions.getByRole('switch', { name: 'Sun' }).click();
    await expect(regions).toContainText('3 of 5 kept');
    await page.getByRole('main').getByRole('radio', { name: 'Original' }).click();
    await expect(page.getByRole('main').getByRole('img', { name: /Layered mountain sunset/ })).toBeVisible();
  });

  test('layers: pick a layer on the left, its inspector sits above the chat', async ({ page }) => {
    await page.goto('/snap/layers/layers'); await page.waitForLoadState('networkidle');
    const assistant = page.getByRole('complementary', { name: 'Katachi chat' });
    const inspector = assistant.getByRole('region', { name: 'Layer', exact: true });
    await expect(inspector.getByRole('heading')).toHaveText('Snow ridge');
    await page.getByRole('complementary', { name: 'Step controls' }).getByRole('button', { name: /Hills/ }).click();
    await expect(inspector.getByRole('heading')).toHaveText('Hills');
    await expect(inspector).toContainText('5 of 6');
  });

  test('walks import → output', async ({ page }) => {
    await page.goto('/snap/layers/source'); await page.waitForLoadState('networkidle');
    const controls = page.getByRole('complementary', { name: 'Step controls' });
    await expect(controls.getByRole('button', { name: /Upload an image/ })).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Katachi chat' })).toContainText('Send from phone');
    await next(page, /Continue with mountain-sunset/, /\/snap\/layers\/cutout$/);
    await next(page, 'Find the objects', /\/snap\/layers\/objects$/);
    await next(page, /Separate into layers/, /\/snap\/layers\/layers$/);
    await next(page, /Review all gaps/, /\/snap\/layers\/gaps$/);
    await expect(page.getByRole('main').getByRole('heading', { name: 'Fill what the photo can’t see' })).toBeVisible();
    await page.getByRole('complementary', { name: 'Katachi chat' }).getByRole('radio', { name: /Leave all open/ }).check();
    await expect(page.getByRole('main').getByRole('button', { name: /L1 Sky: open/ })).toBeVisible();
    await next(page, /Pick materials/, /\/snap\/layers\/material$/);
    await next(page, /Stack & cut/, /\/snap\/layers\/cut$/);
    await expect(page.getByRole('main').getByRole('heading', { name: /6 sheets/ })).toBeVisible();
    await page.getByRole('complementary', { name: 'Katachi chat' }).getByRole('radio', { name: /xTool S1 laser/ }).check();
    await expect(page.getByRole('main').getByRole('button', { name: 'Start cut' })).toBeVisible();
  });

  test('3D object: six view cards, missing views wait for a photo, parts list beside the chat', async ({ page }) => {
    await page.goto('/snap/layers/views'); await page.waitForLoadState('networkidle');
    const views = page.getByRole('region', { name: 'Views', exact: true });
    await expect(views.getByText('Waiting for a photo')).toHaveCount(3);
    await expect(page.getByRole('complementary', { name: 'Katachi chat' }).getByRole('region', { name: 'Parts' })).toContainText('Front · back');
    await expect(page.getByRole('main').getByRole('button', { name: /Build with 3 views/ })).toBeVisible();
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

// mockups/mobile 01–09: app bar with back · seven-step strip · one column · actions · icon nav at the bottom
test.describe('image → layers · phone (390×844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('step strip, back, inline controls and Katachi note; the icon nav opens the chat', async ({ page }) => {
    await page.goto('/snap/layers/source'); await page.waitForLoadState('networkidle');
    const strip = page.getByRole('navigation', { name: 'Image to layers steps' });
    await expect(strip).toContainText('01 / 07 · Source');
    await expect(strip).toContainText('next · cutout');
    await expect(page.getByRole('main').getByRole('radio', { name: /Flat · layered art/ })).toBeVisible();
    await next(page, 'Find the outline', /\/snap\/layers\/cutout$/);
    await next(page, 'Find the objects', /\/snap\/layers\/objects$/);
    await expect(strip).toContainText('03 / 07 · Objects');
    const main = page.getByRole('main');
    await expect(main.getByRole('note', { name: 'Katachi' })).toContainText('I found 5 regions');
    await main.getByRole('region', { name: 'Regions', exact: true }).getByRole('switch', { name: 'Sky' }).click();
    await expect(main.getByRole('region', { name: 'Regions', exact: true })).toContainText('3 of 5 kept');
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page).toHaveURL(/\/snap\/layers\/cutout$/);
    const nav = page.getByRole('navigation', { name: 'Snap sections' });
    await expect(nav.getByRole('link', { name: 'Image to layers' })).toHaveAttribute('aria-current', 'page');
    await nav.getByRole('button', { name: 'Open Katachi chat' }).click();
    await expect(page.getByRole('dialog', { name: 'Katachi chat' })).toContainText('Background removed');
  });

  test('layers: list with share bars; gaps: radio list and apply-to-all', async ({ page }) => {
    await page.goto('/snap/layers/layers'); await page.waitForLoadState('networkidle');
    const main = page.getByRole('main');
    await main.getByRole('button', { name: /Hills/ }).click();
    await expect(main.getByRole('img', { name: /Layer 5, Hills/ })).toBeVisible();
    await next(page, 'Fill the gaps', /\/snap\/layers\/gaps$/);
    await main.getByRole('radio', { name: /Leave it open/ }).check();
    await expect(main.getByRole('checkbox', { name: /Use this for all 6 layers/ })).toBeChecked();
    await main.getByRole('button', { name: 'Next layer' }).click();
    await expect(main.getByRole('img', { name: /L6 · Front pines/ })).toBeVisible();
  });
});

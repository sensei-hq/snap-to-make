import type { Page } from '@playwright/test';

/** Seed a saved, current project in browser storage before the app boots (the flow pages need one). */
export async function seedProject(page: Page, { reached = 5, kind = 'flat', name = 'Mountain sunset' }: { reached?: number; kind?: 'flat' | '3d' | 'ref'; name?: string } = {}) {
  const now = Date.now();
  const record = { id: 'seed', name, createdAt: now, updatedAt: now, reached, kind, path: '/make/import', image: '', choices: {} };
  await page.addInitScript(([r]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('katachi.projects', JSON.stringify([r]));
    localStorage.setItem('katachi.current', 'seed');
  }, [record] as const);
}

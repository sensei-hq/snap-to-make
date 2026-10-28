import { describe, expect, it } from 'vitest';
import { sections } from './sections';

describe('app sections (phone icon nav and studio rail share one list)', () => {
  it('lists the sections in flow order with stable ids and hrefs', () => {
    expect(sections.map((s) => s.id)).toEqual(['workshop', 'capture', 'layers', 'canvas', 'watch', 'batch']);
    expect(sections.map((s) => s.href)).toEqual(['/workshop', '/capture', '/make/import', '/canvas', '/watch', '/batch']);
  });

  it('gives every section a label and a Solar icon for the rail', () => {
    for (const s of sections) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.icon).toMatch(/^i-solar:[a-z0-9-]+-linear$/);
    }
  });
});

describe('sectionFor (which tab / rail item is current)', () => {
  it('matches the longest section prefix, so stage routes keep their section', async () => {
    const { sectionFor } = await import('./sections');
    expect(sectionFor('/workshop')).toBe('workshop');
    expect(sectionFor('/scene')).toBe('workshop');
    expect(sectionFor('/watch')).toBe('watch');
    expect(sectionFor('/make/layers')).toBe('layers');
    expect(sectionFor('/make/views')).toBe('layers');
    expect(sectionFor('/hood')).toBe('workshop');
  });
});

describe('studio tools (rail only)', () => {
  it('lists materials, annotations and settings below the divider', async () => {
    const { tools } = await import('./sections');
    expect(tools.map((t) => [t.id, t.href])).toEqual([['materials', '/materials'], ['annotations', '/annotations'], ['settings', '/settings']]);
  });
});

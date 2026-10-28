import { describe, expect, it } from 'vitest';
import { sections } from './sections';

describe('app sections (phone tabs and studio rail share one list)', () => {
  it('lists the sections in flow order with stable ids and hrefs', () => {
    expect(sections.map((s) => s.id)).toEqual(['workshop', 'capture', 'convert', 'layers', 'canvas', 'watch', 'batch']);
    expect(sections.map((s) => s.href)).toEqual(['/snap', '/snap/capture', '/snap/convert', '/snap/layers/source', '/snap/canvas', '/snap/watch', '/snap/batch']);
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
    expect(sectionFor('/snap')).toBe('workshop');
    expect(sectionFor('/snap/scene')).toBe('workshop');
    expect(sectionFor('/snap/watch')).toBe('watch');
    expect(sectionFor('/snap/layers/layers')).toBe('layers');
    expect(sectionFor('/snap/layers/views')).toBe('layers');
    expect(sectionFor('/snap/hood')).toBe('workshop');
  });
});

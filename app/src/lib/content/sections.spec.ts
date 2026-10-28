import { describe, expect, it } from 'vitest';
import { sections } from './sections';

describe('app sections (phone tabs and studio rail share one list)', () => {
  it('lists the sections in flow order with stable ids and hrefs', () => {
    expect(sections.map((s) => s.id)).toEqual(['workshop', 'capture', 'convert', 'canvas', 'watch', 'batch']);
    expect(sections.map((s) => s.href)).toEqual(['/snap', '/snap/capture', '/snap/convert', '/snap/canvas', '/snap/watch', '/snap/batch']);
  });

  it('gives every section a label and a Solar icon for the rail', () => {
    for (const s of sections) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.icon).toMatch(/^i-solar:[a-z0-9-]+-linear$/);
    }
  });
});

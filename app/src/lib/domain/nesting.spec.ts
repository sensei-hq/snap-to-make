import { describe, it, expect } from 'vitest';
import { nestParts } from './nesting';
describe('shelf nesting (R-DS-5)', () => {
  it('fits parts on one sheet with 3mm spacing', () => {
    const r = nestParts([{ id: 'a', wMm: 95, hMm: 95 }, { id: 'b', wMm: 95, hMm: 95 }], { wMm: 300, hMm: 300 });
    expect(r.sheets).toHaveLength(1);
    const [a, b] = r.sheets[0].placements;
    expect(Math.abs(a.xMm - b.xMm)).toBeGreaterThanOrEqual(98 - 0.001);
  });
  it('overflows to a second sheet', () => {
    const parts = Array.from({ length: 10 }, (_, i) => ({ id: `p${i}`, wMm: 95, hMm: 95 }));
    expect(nestParts(parts, { wMm: 300, hMm: 300 }).sheets.length).toBeGreaterThan(1);
  });
});

import { describe, it, expect } from 'vitest';
import { scaleFromCard, diameterFromMask, measureScene } from './measure';
describe('scaleFromCard (R-UN-3)', () => {
  it('recovers px/mm from a card mask rect', () => {
    // card 85.60x53.98mm at 10 px/mm => 856 x 540 px
    const r = scaleFromCard({ wPx: 856, hPx: 540 });
    expect(r.pxPerMm).toBeCloseTo(10, 1);
    expect(r.aspectError).toBeLessThan(0.06);
  });
  it('warns when aspect error > 6%', () => {
    const r = scaleFromCard({ wPx: 856, hPx: 400 });
    expect(r.aspectError).toBeGreaterThan(0.06);
    expect(r.warning).toMatch(/top-down/i);
  });
});
describe('diameterFromMask (R-UN-4)', () => {
  it('uses minor axis for a perspective ellipse', () => {
    // true Ø80mm at 10px/mm, perspective squashes major axis
    const d = diameterFromMask({ minorPx: 800, majorPx: 880 }, 10);
    expect(d).toBeCloseTo(80, 0);
  });
});
describe('measureScene', () => {
  it('returns needs-reference without a reference', () => {
    expect(measureScene({ reference: null, targets: [] }).status).toBe('needs-reference');
  });
  it('measures targets in mm in code, not from LLM numbers', () => {
    const r = measureScene({ reference: { kind: 'id1_card', wPx: 856, hPx: 540 }, targets: [{ id: 'mug', shape: 'round', minorPx: 820, majorPx: 850 }] });
    if (r.status !== 'measured') throw new Error('expected measured');
    expect(r.targets[0].valueMm).toBeCloseTo(82, 0);
    expect(r.targets[0].confidence).toBeGreaterThan(0.6);
  });
});

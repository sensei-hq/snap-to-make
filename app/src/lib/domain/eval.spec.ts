import { describe, it, expect } from 'vitest';
import { evaluateSamples } from './eval';
describe('measurement eval (Stage 10 gate)', () => {
  it('reports mean abs % error and pass rate at 5%', () => {
    const r = evaluateSamples([
      { id: 's1', truthMm: 82, card: { wPx: 856, hPx: 540 }, mask: { minorPx: 820, majorPx: 850 } },
      { id: 's2', truthMm: 95, card: { wPx: 856, hPx: 540 }, mask: { minorPx: 950, majorPx: 980 } }
    ]);
    expect(r.samples[0].measuredMm).toBeCloseTo(82, 0);
    expect(r.passRate).toBe(1);
    expect(r.meanAbsPctError).toBeLessThan(5);
  });
  it('flags samples beyond 5% instead of hiding them', () => {
    const r = evaluateSamples([{ id: 'bad', truthMm: 100, card: { wPx: 856, hPx: 540 }, mask: { minorPx: 800, majorPx: 810 } }]);
    expect(r.passRate).toBe(0);
    expect(r.samples[0].within5).toBe(false);
  });
});

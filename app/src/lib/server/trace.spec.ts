import { describe, it, expect } from 'vitest';
import { costFor } from './trace';
describe('cost model (PRD 04 §4.5)', () => {
  it('prices known models', () => {
    expect(costFor('sam-3.1', { images: 4 })).toBeCloseTo(0.01, 3);
    expect(costFor('muse-image-1.0', { images: 4 })).toBeCloseTo(0.04, 3);
    expect(costFor('muse-spark-1.3', { inputTokens: 6000, outputTokens: 400 })).toBeGreaterThan(0);
  });
});

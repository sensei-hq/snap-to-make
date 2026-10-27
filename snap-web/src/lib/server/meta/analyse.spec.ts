import { describe, it, expect } from 'vitest';
import { analyseScene } from './analyse';
describe('analyseScene degraded modes (PRD 04 §4.4)', () => {
  it('uses fixtures without a key', async () => {
    const r = await analyseScene({});
    expect(r.source).toBe('fixture');
    expect(r.measure.status).toBe('measured');
  });
  it('uses live Spark output when valid, falls back on invalid', async () => {
    const good = { sparkJson: async () => ({ data: { objects: [], reference: { objectId: 'x', kind: 'none' }, camera: { topDownConfidence: 0.5 }, notes: '' }, costUsd: 0.01, latencyMs: 5 }) };
    expect((await analyseScene({ META_API_KEY: 'k' }, good as any)).source).toBe('live');
    const bad = { sparkJson: async () => ({ data: { nope: 1 }, costUsd: 0, latencyMs: 1 }) };
    expect((await analyseScene({ META_API_KEY: 'k' }, bad as any)).source).toBe('fixture');
  });
});

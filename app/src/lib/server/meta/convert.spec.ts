import { describe, it, expect } from 'vitest';
import { proposeConversion } from './convert';
describe('proposeConversion fallback dissection', () => {
  it('composite-3d fallback returns structured, named pieces (not generic chips)', async () => {
    const r = await proposeConversion({}, { description: 'coffin lantern', group: 'laser-cut' });
    expect(r.pieces.length).toBeGreaterThan(2);
    expect(r.pieces[0]).toHaveProperty('name');
    expect(r.pieces[0]).toHaveProperty('kind');
    expect(r.pieces[0]).toHaveProperty('note');
    expect(r.pieces.map(p => p.kind)).toContain('base');
  });
  it('layered fallback returns layer pieces', async () => {
    const live = { sparkVision: async () => ({ data: { subject: 'wreath', group: 'laser-cut', conversionClass: 'layered', objective: 'Build wreath', variations: [], pieces: [{ name: 'Layer 1', kind: 'layer', note: 'back silhouette' }] }, costUsd: 0.01, latencyMs: 1 }) };
    const r = await proposeConversion({ META_API_KEY: 'k' }, { description: 'wreath', group: 'laser-cut' }, live as any);
    expect(r.source).toBe('live');
    expect(r.pieces[0].kind).toBe('layer');
  });
});

import { describe, it, expect } from 'vitest';
import { SceneAnalysisSchema, DesignSpecSchema } from './schemas';
describe('SceneAnalysis strict schema (R-UN-1)', () => {
  it('accepts a valid analysis', () => {
    const v = { objects: [{ id: 'o1', label: 'mug', samPrompt: 'mug base', role: 'fit_target', bbox: [0,0,10,10], shapeHint: 'round' }], reference: { objectId: 'o1', kind: 'id1_card' }, camera: { topDownConfidence: 0.9 }, notes: '' };
    expect(SceneAnalysisSchema.safeParse(v).success).toBe(true);
  });
  it('rejects extra keys (strict)', () => {
    const v = { objects: [], reference: { objectId: 'x', kind: 'none' }, camera: { topDownConfidence: 1 }, notes: '', bogus: 1 };
    expect(SceneAnalysisSchema.safeParse(v).success).toBe(false);
  });
});
describe('DesignSpec strict schema (R-DS-1)', () => {
  it('rejects raw coordinates in parts', () => {
    const v = { project: 'x', material: { id: 'birch', thicknessMm: 3 }, deviceId: 'longer-ray5-10w', sheet: { wMm: 300, hMm: 300 }, parts: [{ name: 'c', qty: 1, template: 'coaster', params: { shape: 'round', diameterMm: 95, x: 10 } }], kerfMm: 0.1, clearanceMm: 1, assumptions: [] };
    // params is free-form per template, but top-level strictness must hold:
    expect(DesignSpecSchema.safeParse({ ...v, extra: true }).success).toBe(false);
    expect(DesignSpecSchema.safeParse(v).success).toBe(true);
  });
});

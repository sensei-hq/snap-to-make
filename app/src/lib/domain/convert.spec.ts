import { describe, it, expect } from 'vitest';
import { scaledForShrink, calibrateRatio, buildBreakdown } from './convert';
import { designSpecToObject } from './geometry';
describe('shrink plastic scaling (design LARGER than final)', () => {
  it('scales up by 1/ratio at default 0.40', () => {
    expect(scaledForShrink(40, 0.4)).toBeCloseTo(100);
    expect(calibrateRatio(100, 42)).toBeCloseTo(0.42);
    expect(scaledForShrink(40, calibrateRatio(100, 42))).toBeCloseTo(95.2, 0);
  });
});
describe('build breakdown', () => {
  it('lists pieces, materials and assembly steps from an Object + Impl', () => {
    const obj = designSpecToObject({ project: 'Holder', material: { id: 'birch', thicknessMm: 3 }, deviceId: 'longer-ray5-10w', sheet: { wMm: 300, hMm: 300 }, parts: [{ name: 'holder', qty: 1, template: 'finger_box_open', params: { innerWMm: 97, innerDMm: 14, innerHMm: 40 } }], kerfMm: 0.1, clearanceMm: 1, assumptions: [] });
    const b = buildBreakdown(obj, 'laser-cut');
    expect(b.pieces.length).toBeGreaterThan(0);
    expect(b.materials.join(' ')).toMatch(/birch/i);
    expect(b.assemblySteps.length).toBeGreaterThan(1);
    expect(b.assemblySteps.join(' ')).toMatch(/join|slot|glue/i);
  });
  it('shrink breakdown shows cut size AND expected final size + bake step', () => {
    const obj = designSpecToObject({ project: 'Charm', material: { id: 'shrink-film', thicknessMm: 0.3 }, deviceId: 'cricut-maker', sheet: { wMm: 200, hMm: 200 }, parts: [{ name: 'charm', qty: 1, template: 'ornament', params: { shape: 'round', diameterMm: 40 } }], kerfMm: 0, clearanceMm: 0, assumptions: [] });
    const b = buildBreakdown(obj, 'shrink-plastic', 0.4);
    expect(b.pieces[0].cutMm).toBeCloseTo(100);
    expect(b.pieces[0].finalMm).toBeCloseTo(40);
    expect(b.assemblySteps.join(' ')).toMatch(/bake|oven/i);
  });
});

import { describe, expect, it } from 'vitest';
import { deriveCoasterSet, coasterSetToSpec } from './holder';

// Models choose, code computes: every size follows the measured mug base (mock SnapSession numbers).
describe('deriveCoasterSet', () => {
  const base = deriveCoasterSet({ mugBaseMm: 82 });

  it('sizes the coaster from the mug (mug + 13 mm) and the holder around four 3 mm coasters', () => {
    expect(base.coasterDiameterMm).toBe(95);
    expect(base.holderInner).toEqual({ wMm: 97, dMm: 14, hMm: 40 });
    expect(base.holderOuter).toEqual({ lengthMm: 103, depthMm: 20 });
  });

  it('lists the parts with quantities and counts them', () => {
    expect(base.parts.map((p) => [p.id, p.qty, p.wMm, p.hMm])).toEqual([
      ['coaster', 4, 95, 95], ['base', 1, 103, 20], ['long', 2, 103, 40], ['short', 2, 20, 40]
    ]);
    expect(base.partCount).toBe(9);
  });

  it('reports sheet use, a time estimate and preflight checks', () => {
    expect(base.sheetUsePct).toBe(45);
    expect(base.estimateMinutes).toBe(14);
    expect(base.preflight).toEqual([
      { label: 'Fits the bed', ok: true }, { label: 'Paths closed', ok: true }, { label: 'Engrave before cut', ok: true }
    ]);
  });

  it('follows a corrected mug measurement', () => {
    expect(deriveCoasterSet({ mugBaseMm: 90 }).coasterDiameterMm).toBe(103);
  });

  it('taller walls and a lid change the parts and the estimate', () => {
    const s = deriveCoasterSet({ mugBaseMm: 82, wallHeightMm: 45, lid: 'added' });
    expect(s.parts.find((p) => p.id === 'long')?.hMm).toBe(45);
    expect(s.parts.at(-1)).toMatchObject({ id: 'lid', qty: 1, wMm: 103, hMm: 20 });
    expect(s.partCount).toBe(10);
    expect(s.estimateMinutes).toBe(16);
  });

  it('fails the bed check when the holder outgrows the sheet', () => {
    expect(deriveCoasterSet({ mugBaseMm: 300 }).preflight[0]).toEqual({ label: 'Fits the bed', ok: false });
  });
});

describe('coasterSetToSpec', () => {
  it('builds the DesignSpec from the derived sizes (not hardcoded)', () => {
    const spec = coasterSetToSpec(deriveCoasterSet({ mugBaseMm: 82 }), { qty: 4, materialId: 'birch', thicknessMm: 3 });
    expect(spec.parts[0]).toMatchObject({ name: 'coaster', qty: 4, template: 'coaster', params: { shape: 'round', diameterMm: 95 } });
    expect(spec.parts[1]).toMatchObject({ name: 'holder', template: 'finger_box_open', params: { innerWMm: 97, innerDMm: 14, innerHMm: 40 } });
    expect(spec.assumptions).toEqual(['Coaster = mug base + 13 mm', 'Clearance 1 mm · kerf 0.1 mm']);
  });

  it('adds the lid as a flat panel when the user accepts it', () => {
    const spec = coasterSetToSpec(deriveCoasterSet({ mugBaseMm: 82, lid: 'added' }), { qty: 4, materialId: 'birch', thicknessMm: 3 });
    expect(spec.parts[2]).toMatchObject({ name: 'lid', qty: 1, template: 'panel', params: { shape: 'rect', innerWMm: 103, innerDMm: 20 } });
  });
});

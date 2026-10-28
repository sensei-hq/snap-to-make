import { describe, expect, it } from 'vitest';
import { implToCanvas } from './canvas';
import type { ImplPlan } from '../devices/types';

const impl: ImplPlan = {
  adapterId: 'laser', deviceId: 'longer-ray5-10w', sheetMm: { wMm: 300, hMm: 300 }, sheets: 1, assemblyTexts: [],
  pieces: [
    { id: 'coaster-1', name: 'coaster', wMm: 95, hMm: 95, ops: ['engrave-surface', 'cut-through'] },
    { id: 'coaster-2', name: 'coaster', wMm: 95, hMm: 95, ops: ['engrave-surface', 'cut-through'] },
    { id: 'holder-base', name: 'holder-base', wMm: 103, hMm: 20, joint: 'finger', ops: ['cut-through'] }
  ]
};

describe('implToCanvas: the sheet shows the real plan, nested', () => {
  const pieces = implToCanvas(impl);
  it('places every piece on the sheet without overlap', () => {
    expect(pieces.map((p) => p.id)).toEqual(['coaster-1', 'coaster-2', 'holder-base']);
    for (const p of pieces) { expect(p.xMm + p.wMm).toBeLessThanOrEqual(300); expect(p.yMm + p.hMm).toBeLessThanOrEqual(300); }
    expect(pieces[1].xMm).toBeGreaterThanOrEqual(pieces[0].xMm + pieces[0].wMm);
  });
  it('draws coasters as circles carrying the engraved art, holder parts as rectangles', () => {
    expect(pieces[0]).toMatchObject({ kind: 'circle', label: 'M' });
    expect(pieces[2]).toMatchObject({ kind: 'rect' });
    expect(pieces[2].label).toBeUndefined();
  });
});

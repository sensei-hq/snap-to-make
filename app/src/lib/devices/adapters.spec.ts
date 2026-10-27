import { describe, it, expect } from 'vitest';
import { ADAPTERS, getAdapter, Phase2Error } from './registry';
import { designSpecToObject } from '../domain/geometry';
import type { DesignSpec } from '../domain/schemas';
const hero: DesignSpec = { project: 'Coasters for Maya', material: { id: 'birch', thicknessMm: 3 }, deviceId: 'longer-ray5-10w', sheet: { wMm: 300, hMm: 300 },
  parts: [ { name: 'coaster', qty: 4, template: 'coaster', params: { shape: 'round', diameterMm: 95 }, engrave: [{ artId: 'art-2', sizeMm: 60, anchor: 'center' }] },
           { name: 'holder', qty: 1, template: 'finger_box_open', params: { innerWMm: 97, innerDMm: 14, innerHMm: 40 } } ], kerfMm: 0.1, clearanceMm: 1, assumptions: [] };
const obj = designSpecToObject(hero);
describe('adapter contract (every registered adapter)', () => {
  it.each(Object.keys(ADAPTERS))('%s: plan covers parts, validate flags oversize, preview matches estimate', (id) => {
    const a = getAdapter(id);
    const plan = a.plan(obj, a.defaultTarget);
    expect(plan.pieces.length).toBeGreaterThan(0);
    expect(a.validate(obj, a.defaultTarget).filter(i => i.level === 'error')).toHaveLength(0);
    const big = { ...obj, parts: obj.parts.map(p => ({ ...p, profile: { ...p.profile, wMm: 9999, hMm: 9999 } })) };
    expect(a.validate(big, a.defaultTarget).some(i => i.level === 'error')).toBe(true);
    const tl = a.preview(plan), est = a.estimate(plan);
    expect(tl.totalSec).toBeGreaterThan(0);
    expect(Math.abs(tl.totalSec - est.durationSec) / est.durationSec).toBeLessThan(0.25);
  });
});
describe('laser adapter (P1 full)', () => {
  it('emits valid G-code: engrave before cut, holder finger geometry', () => {
    const a = getAdapter('laser');
    const plan = a.plan(obj, a.defaultTarget);
    const gc = a.emit(plan).find(f => f.filename.endsWith('.gcode'));
    expect(gc?.content).toContain('G21');
    expect(gc!.content.indexOf('ENGRAVE')).toBeLessThan(gc!.content.indexOf('CUT'));
    expect(plan.pieces.find(p => p.name === 'holder-base')).toBeTruthy();
    expect(a.emit(plan).some(f => f.filename.endsWith('.svg'))).toBe(true);
  });
});
describe('re-plan: Object unchanged, Impl differs (Object -> Impl)', () => {
  it('laser has finger walls, cricut has folded blank, no model cost', () => {
    const before = JSON.stringify(obj);
    const laser = getAdapter('laser').plan(obj, getAdapter('laser').defaultTarget);
    const cricut = getAdapter('cricut').plan(obj, getAdapter('cricut').defaultTarget);
    expect(laser.pieces.some(p => p.joint === 'finger')).toBe(true);
    expect(cricut.pieces.some(p => p.joint === 'fold')).toBe(true);
    expect(JSON.stringify(obj)).toBe(before);
    expect(() => getAdapter('cricut').emit(cricut)).toThrow(Phase2Error);
    expect(() => getAdapter('printer3d').emit(getAdapter('printer3d').plan(obj, getAdapter('printer3d').defaultTarget))).toThrow(Phase2Error);
  });
});
describe('simulator', () => {
  it('orders engrave before cut with monotonic timing', () => {
    const laser = getAdapter('laser');
    const tl = getAdapter('simulator').preview(laser.plan(obj, laser.defaultTarget));
    const kinds = tl.ops.map(o => o.op);
    expect(kinds.indexOf('engrave-surface')).toBeLessThan(kinds.lastIndexOf('cut-through'));
    expect(tl.ops.every((o, i) => i === 0 || o.startSec >= tl.ops[i - 1].startSec)).toBe(true);
  });
});
describe('laser artifacts completeness (R-MK-4)', () => {
  it('also emits a .burn project artifact', async () => {
    const { getAdapter } = await import('./registry');
    const { designSpecToObject } = await import('../domain/geometry');
    const obj = designSpecToObject({ project: 'x', material: { id: 'birch', thicknessMm: 3 }, deviceId: 'longer-ray5-10w', sheet: { wMm: 300, hMm: 300 }, parts: [{ name: 'coaster', qty: 1, template: 'coaster', params: { shape: 'round', diameterMm: 95 } }], kerfMm: 0.1, clearanceMm: 1, assumptions: [] });
    const a = getAdapter('laser');
    const files = a.emit(a.plan(obj, a.defaultTarget));
    const burn = files.find(f => f.filename.endsWith('.burn'));
    expect(burn).toBeTruthy();
    expect(JSON.parse(burn!.content).name).toBe('x');
  });
});

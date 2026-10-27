import { describe, it, expect } from 'vitest';
import { designSpecToObject } from './geometry';
import type { DesignSpec } from './schemas';
const hero: DesignSpec = { project: 'Coasters for Maya', material: { id: 'birch', thicknessMm: 3 }, deviceId: 'longer-ray5-10w', sheet: { wMm: 300, hMm: 300 },
  parts: [ { name: 'coaster', qty: 4, template: 'coaster', params: { shape: 'round', diameterMm: 95 }, engrave: [{ artId: 'art-2', sizeMm: 60, anchor: 'center' }] },
           { name: 'holder', qty: 1, template: 'finger_box_open', params: { innerWMm: 97, innerDMm: 14, innerHMm: 40 } } ],
  kerfMm: 0.1, clearanceMm: 1, assumptions: ['coaster = mug base + 13mm'] };
describe('DesignSpec -> ObjectSpec (Object layer, device-agnostic)', () => {
  it('expands qty and carries intent dims', () => {
    const o = designSpecToObject(hero);
    expect(o.parts.filter(p => p.template === 'coaster')).toHaveLength(4);
    const holder = o.parts.find(p => p.template === 'finger_box_open');
    expect(holder?.intent).toMatchObject({ innerWMm: 97, innerDMm: 14 });
  });
  it('contains NO device geometry anywhere (anti-leak)', () => {
    const s = JSON.stringify(designSpecToObject(hero));
    for (const k of ['power','feedRate','gcode','deviceId','finger']) expect(s).not.toContain(`"${k}"`);
  });
  it('keeps abstract art intent only', () => {
    const o = designSpecToObject(hero);
    expect(o.surfaceArt[0]).toMatchObject({ artId: 'art-2', op: 'engrave-surface' });
  });
});

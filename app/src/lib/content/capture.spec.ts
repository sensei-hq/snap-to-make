import { describe, expect, it } from 'vitest';
import { captureModes, captureSources, sides } from './capture';

describe('capture copy', () => {
  it('offers camera, upload or sketch (each with its Solar icon); no reference option', () => {
    expect(captureSources.map((s) => [s.value, s.icon])).toEqual([['camera', 'i-solar:camera-linear'], ['upload', 'i-solar:gallery-linear'], ['sketch', 'i-solar:pen-new-square-linear']]);
  });
  it('single shot by default, or six sides for a 3D object', () => {
    expect(captureModes.map((m) => m.value)).toEqual(['single', 'multi']);
    expect(sides.map((s) => s.id)).toEqual(['front', 'right', 'back', 'left', 'top', 'base']);
  });
});

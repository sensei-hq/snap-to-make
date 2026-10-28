import { describe, expect, it } from 'vitest';
import { captureModes, captureSources, sides } from './capture';

describe('capture copy', () => {
  it('offers camera (camera icon) or upload (image icon); no reference option', () => {
    expect(captureSources.map((s) => [s.value, s.icon])).toEqual([['camera', 'i-solar:camera-linear'], ['upload', 'i-solar:gallery-linear']]);
  });
  it('single shot by default, or six sides for a 3D object', () => {
    expect(captureModes.map((m) => m.value)).toEqual(['single', 'multi']);
    expect(sides.map((s) => s.id)).toEqual(['front', 'right', 'back', 'left', 'top', 'base']);
  });
});

import { describe, expect, it } from 'vitest';
import { sourceModes } from './capture';

describe('camera source modes (mock SourceModes)', () => {
  it('offers Photo, Upload, 6 views and Reference in that order', () => {
    expect(sourceModes.map((m) => m.label)).toEqual(['Photo', 'Upload', '6 views', 'Reference']);
  });
  it('routes Upload to Convert; 6 views and Reference wait for the layers flow (Stage 14)', () => {
    const by = Object.fromEntries(sourceModes.map((m) => [m.id, m]));
    expect(by.upload.href).toBe('/snap/convert');
    expect(by.views.href).toBeUndefined();
    expect(by.reference.href).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import { legacyPath } from './routes';

describe('legacy /snap links redirect to the root routes', () => {
  it('maps the gate, the workshop and studio pages', () => {
    expect(legacyPath('/snap/welcome')).toBe('/');
    expect(legacyPath('/snap')).toBe('/workshop');
    expect(legacyPath('/snap/capture')).toBe('/capture');
    expect(legacyPath('/snap/canvas')).toBe('/canvas');
  });
  it('maps the image → layers flow onto /make (no doubled layers/layers)', () => {
    expect(legacyPath('/snap/layers/source')).toBe('/make/import');
    expect(legacyPath('/snap/layers/cutout')).toBe('/make/cutout');
    expect(legacyPath('/snap/layers/objects')).toBe('/make/segment');
    expect(legacyPath('/snap/layers/layers')).toBe('/make/layers');
    expect(legacyPath('/snap/layers/material')).toBe('/make/layers');
    expect(legacyPath('/snap/layers/cut')).toBe('/make/output');
    expect(legacyPath('/snap/layers/views')).toBe('/make/views');
  });
  it('Convert folded into Import; non-legacy paths are left alone', () => {
    expect(legacyPath('/snap/convert')).toBe('/make/import');
    expect(legacyPath('/make/layers')).toBeNull();
    expect(legacyPath('/snapshot')).toBeNull();
  });
});

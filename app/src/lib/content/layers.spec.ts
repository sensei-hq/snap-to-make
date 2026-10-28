import { describe, expect, it } from 'vitest';
import { desktopStepFor, desktopSteps, makeAs, phoneStep, sources } from './layers';

describe('image → layers steps (mockups/desktop D1–D6 · mockups/mobile 01–09)', () => {
  it('the studio shows six step tabs; each opens its first route', () => {
    expect(desktopSteps.map((s) => s.label)).toEqual(['Import', 'Segment', 'Layers', 'Gaps', '6 views', 'Output']);
    expect(desktopSteps.map((s) => s.path)).toEqual([
      '/snap/layers/source', '/snap/layers/objects', '/snap/layers/layers', '/snap/layers/gaps', '/snap/layers/views', '/snap/layers/cut'
    ]);
  });

  it('every route of the flow lights one studio tab (cutout is part of Segment, material of Layers)', () => {
    expect(desktopStepFor('/snap/layers/source')).toBe('import');
    expect(desktopStepFor('/snap/layers/reference')).toBe('import');
    expect(desktopStepFor('/snap/layers/cutout')).toBe('segment');
    expect(desktopStepFor('/snap/layers/objects')).toBe('segment');
    expect(desktopStepFor('/snap/layers/layers')).toBe('layers');
    expect(desktopStepFor('/snap/layers/material')).toBe('layers');
    expect(desktopStepFor('/snap/layers/gaps')).toBe('gaps');
    expect(desktopStepFor('/snap/layers/views')).toBe('views');
    expect(desktopStepFor('/snap/layers/cut')).toBe('output');
    expect(desktopStepFor('/snap/canvas')).toBe('');
  });

  it('the phone strip counts seven steps and names the next one; branch screens have no strip', () => {
    expect(phoneStep('/snap/layers/source')).toEqual({ n: 1, total: 7, label: 'Source', next: 'cutout', back: null });
    expect(phoneStep('/snap/layers/gaps')).toEqual({ n: 5, total: 7, label: 'Gaps', next: 'material', back: '/snap/layers/layers' });
    expect(phoneStep('/snap/layers/cut')).toEqual({ n: 7, total: 7, label: 'Cut', next: null, back: '/snap/layers/material' });
    expect(phoneStep('/snap/layers/views')).toBeNull();
  });

  it('D1 · start from: upload and phone are flat art; 3D and reference branch', () => {
    expect(sources.map((s) => [s.id, s.kind])).toEqual([['upload', 'flat'], ['phone', 'flat'], ['3d', '3d'], ['ref', 'ref']]);
    expect(makeAs.map((m) => m.id)).toEqual(['auto', 'paper', 'wood', 'acrylic']);
  });
});

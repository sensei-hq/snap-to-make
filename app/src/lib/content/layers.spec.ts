import { describe, expect, it } from 'vitest';
import { desktopStepFor, desktopSteps, makeAs, phoneStep } from './layers';

describe('image → layers steps (mockups/desktop D1–D6 · mockups/mobile 01–09)', () => {
  it('the studio shows six step tabs; each opens its first route', () => {
    expect(desktopSteps.map((s) => s.label)).toEqual(['Import', 'Segment', 'Layers', 'Gaps', '6 views', 'Output']);
    expect(desktopSteps.map((s) => s.path)).toEqual(['/make/import', '/make/segment', '/make/layers', '/make/gaps', '/make/views', '/make/output']);
  });

  it('every route of the flow lights one studio tab (cutout is part of Segment, reference part of Import)', () => {
    expect(desktopStepFor('/make/import')).toBe('import');
    expect(desktopStepFor('/make/reference')).toBe('import');
    expect(desktopStepFor('/make/cutout')).toBe('segment');
    expect(desktopStepFor('/make/segment')).toBe('segment');
    expect(desktopStepFor('/make/layers')).toBe('layers');
    expect(desktopStepFor('/make/gaps')).toBe('gaps');
    expect(desktopStepFor('/make/views')).toBe('views');
    expect(desktopStepFor('/make/output')).toBe('output');
    expect(desktopStepFor('/canvas')).toBe('');
  });

  it('the phone strip counts six steps (no Material: the medium is picked at Import) and names the next one; branch screens have no strip', () => {
    expect(phoneStep('/make/import')).toEqual({ n: 1, total: 6, label: 'Import', next: 'cutout', back: null });
    expect(phoneStep('/make/gaps')).toEqual({ n: 5, total: 6, label: 'Gaps', next: 'output', back: '/make/layers' });
    expect(phoneStep('/make/output')).toEqual({ n: 6, total: 6, label: 'Output', next: null, back: '/make/gaps' });
    expect(phoneStep('/make/views')).toBeNull();
  });

  it('D1 · make it as: Katachi picks, paper, wood or acrylic (where the image comes from is Capture)', () => {
    expect(makeAs.map((m) => m.id)).toEqual(['auto', 'paper', 'wood', 'acrylic']);
  });
});

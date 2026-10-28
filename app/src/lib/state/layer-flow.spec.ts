import { describe, expect, it } from 'vitest';
import { LayerFlowState } from './layer-flow.svelte';
import { kinds, layerSets, steps } from '../content/layers';

describe('LayerFlowState · image → layers (docs/design/01 S1–S9)', () => {
  it('walks seven steps; the kind picker routes flat art to the cutout, 3D to six views, reference to changes', () => {
    expect(steps.map((s) => s.id)).toEqual(['source', 'cutout', 'objects', 'layers', 'gaps', 'material', 'cut']);
    expect(Object.fromEntries(kinds.map((k) => [k.id, k.next]))).toEqual({ flat: '/snap/layers/cutout', '3d': '/snap/layers/views', ref: '/snap/layers/reference' });
    const f = new LayerFlowState();
    expect(f.kind).toBe('flat');
    f.setKind('3d');
    expect(f.currentKind.next).toBe('/snap/layers/views');
  });

  it('S4: keeps regions by default except the bought frame; toggling updates the kept share', () => {
    const f = new LayerFlowState();
    expect(f.regions.find((r) => r.id === 'frame')?.on).toBe(false);
    const before = f.keptPct;
    f.toggleRegion('sun');
    expect(f.keptPct).toBeLessThan(before);
    f.toggleRegion('frame');
    expect(f.kept.map((r) => r.id)).toContain('frame');
  });

  it('S5a: switching paper ↔ wood changes the stack; depth follows the selected layer', () => {
    const f = new LayerFlowState();
    expect(f.layers).toHaveLength(layerSets.paper.layers.length);
    f.selectLayer(3);
    expect(f.selected.n).toBe(3);
    expect(f.depthMm).toBe((3 * layerSets.paper.mmPerLayer).toFixed(1));
    f.setSet('wood');
    expect(f.layers).toHaveLength(layerSets.wood.layers.length);
    expect(f.data.mmPerLayer).toBe(3);
  });

  it('S6: the gap rule fills structural layers under "smart"; per-layer overrides win; material % follows', () => {
    const f = new LayerFlowState();
    f.setGapRule('extend');
    expect(f.gapCards.every((c) => c.solid)).toBe(true);
    const full = f.materialPct;
    f.setGapRule('leave');
    expect(f.gapCards.every((c) => !c.solid)).toBe(true);
    expect(f.materialPct).toBeLessThan(full);
    f.setGapRule('smart');
    expect(f.gapCards.filter((c) => c.solid).map((c) => c.n)).toEqual(f.structural);
    f.toggleSolid(2);
    expect(f.gapCards.find((c) => c.n === 2)?.solid).toBe(true);
    f.setGapRule('smart');
    expect(f.gapCards.find((c) => c.n === 2)?.solid).toBe(false);
  });

  it('S6 (phone): one gap choice, optionally for every layer', () => {
    const f = new LayerFlowState();
    expect(f.gapChoice).toBe('extend');
    f.setGapChoice('imagine');
    expect(f.currentGap.label).toBe('Let Katachi imagine it');
    expect(f.applyAll).toBe(true);
    f.toggleApplyAll();
    expect(f.applyAll).toBe(false);
  });

  it('S5b: six views — shoot fills the next missing view', () => {
    const f = new LayerFlowState();
    expect(f.views.filter((v) => v.ok).map((v) => v.id)).toEqual(['front', 'right', 'back']);
    expect(f.nextView?.id).toBe('left');
    f.shoot();
    expect(f.nextView?.id).toBe('top');
    f.toggleView('front');
    expect(f.views.find((v) => v.id === 'front')?.ok).toBe(false);
  });

  it('reference + changes: each change can be skipped', () => {
    const f = new LayerFlowState();
    expect(f.activeChanges).toBe(3);
    f.toggleChange(2);
    expect(f.activeChanges).toBe(2);
  });

  it('output: the device choice drives format, time and the call to action', () => {
    const f = new LayerFlowState();
    expect(f.currentDevice.id).toBe('cricut');
    f.setDevice('xtool');
    expect(f.currentDevice.cta).toBe('Start cut');
  });
});

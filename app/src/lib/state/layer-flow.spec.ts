import { describe, expect, it } from 'vitest';
import { LayerFlowState } from './layer-flow.svelte';
import { kinds, layerSets, steps } from '../content/layers';

describe('LayerFlowState · image → layers (docs/design/01 S1–S9)', () => {
  it('walks six steps; the kind picker routes flat art to the cutout, 3D to six views, reference to changes', () => {
    expect(steps.map((s) => s.id)).toEqual(['import', 'cutout', 'segment', 'layers', 'gaps', 'output']);
    expect(Object.fromEntries(kinds.map((k) => [k.id, k.next]))).toEqual({ flat: '/make/cutout', '3d': '/make/views', ref: '/make/reference' });
    const f = new LayerFlowState();
    expect(f.kind).toBe('flat');
    f.setKind('3d');
    expect(f.currentKind.next).toBe('/make/views');
  });

  it('D1: "make it as" paper or wood picks the layer set', () => {
    const f = new LayerFlowState();
    expect(f.makeAs).toBe('auto');
    f.setMakeAs('wood');
    expect([f.makeAs, f.set]).toEqual(['wood', 'wood']);
    f.setMakeAs('acrylic');
    expect([f.makeAs, f.set]).toEqual(['acrylic', 'wood']);
    f.setMakeAs('paper');
    expect(f.set).toBe('paper');
  });

  it('D2: segment view (masks · cutout · original) and refine tool', () => {
    const f = new LayerFlowState();
    expect([f.segmentView, f.refineTool]).toEqual(['masks', 'pick']);
    f.setSegmentView('original');
    f.setRefineTool('box');
    expect([f.segmentView, f.refineTool]).toEqual(['original', 'box']);
  });

  it('M05: "next layer" walks the stack and wraps to the back', () => {
    const f = new LayerFlowState();
    f.selectLayer(f.layers.length);
    f.nextLayer();
    expect(f.selected.n).toBe(1);
    f.nextLayer();
    expect(f.selected.n).toBe(2);
  });

  it('D5: joinery for the six-view parts defaults to finger joints', () => {
    const f = new LayerFlowState();
    expect(f.joinery).toBe('finger');
    f.setJoinery('tabs');
    expect(f.joinery).toBe('tabs');
  });

  it('a snapshot of every choice restores into a fresh flow (projects save and reopen)', () => {
    const f = new LayerFlowState();
    f.setKind('3d'); f.setMakeAs('wood'); f.toggleRegion('sun'); f.selectLayer(2); f.setGapRule('leave'); f.toggleSolid(1); f.setDevice('xtool'); f.setJoinery('tabs');
    const g = new LayerFlowState();
    g.restore(JSON.parse(JSON.stringify(f.snapshot())));
    expect(g.snapshot()).toEqual(f.snapshot());
    expect([g.kind, g.set, g.selected.n, g.gapRule, g.currentDevice.id]).toEqual(['3d', 'wood', 2, 'leave', 'xtool']);
    expect(g.regions.find((r) => r.id === 'sun')?.on).toBe(false);
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

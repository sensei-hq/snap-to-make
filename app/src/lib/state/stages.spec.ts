import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FlowState } from './flow.svelte';
import { WatchState } from './watch.svelte';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => ({
    ok: true,
    json: async () => String(url).includes('scene')
      ? { measure: { status: 'measured', targets: [{ valueMm: 82 }] }, trace: [] }
      : String(url).includes('watch') ? { events: [{ atSec: 12, kind: 'ok', note: 'Engrave started' }, { atSec: 42, kind: 'flare', note: 'Flare-up at coaster 3' }], clipSec: 58 }
      : { trace: [] }
  })));
});

describe('scene: measurements are editable and drive the design', () => {
  it('takes the mug base from the measurement and lets the user fix it', async () => {
    const f = new FlowState();
    await f.analyse();
    expect(f.measurements.find((m) => m.id === 'mug')?.value).toBe(82);
    expect(f.coasterSet.coasterDiameterMm).toBe(95);
    f.setMeasurement('mug', 90);
    expect(f.coasterSet.coasterDiameterMm).toBe(103);
    f.setMeasurement('mug', -4);
    expect(f.measurements.find((m) => m.id === 'mug')?.value).toBe(90);
  });
});

describe('plan + canvas: edits re-plan in code', () => {
  it('builds the plan from the derived sizes and shows it on the canvas', async () => {
    const f = new FlowState();
    await f.analyse();
    await f.plan();
    expect(f.design.object?.parts.find((p) => p.name === 'coaster')?.profile.diameterMm).toBe(95);
    expect(f.canvasPieces.length).toBeGreaterThan(0);
  });
  it('"make the walls 5 mm taller" raises the walls; the lid offer can be accepted or declined', async () => {
    const f = new FlowState();
    await f.analyse();
    await f.runCommand('Make the walls 5 mm taller');
    expect(f.wallHeightMm).toBe(45);
    expect(f.lid).toBe('offered');
    await f.addLid();
    expect(f.coasterSet.partCount).toBe(10);
    await f.declineLid();
    expect(f.lid).toBe('declined');
  });
});

describe('art + preview choices', () => {
  it('re-rolls, picks a take or the original', () => {
    const f = new FlowState();
    f.reroll(); f.reroll();
    expect(f.artRerolls).toBe(2);
    f.useOriginalArt();
    expect(f.artUsesOriginal).toBe(true);
    f.pickArt(1);
    expect(f.artUsesOriginal).toBe(false);
    expect(f.artSelected).toBe(1);
  });
  it('cycles preview scenes and engraving depth; the caption follows the geometry', async () => {
    const f = new FlowState();
    await f.analyse();
    expect(f.previewCaption).toContain('Ø 95 mm');
    expect(f.previewCaption).toContain('on a coffee table');
    f.nextScene();
    expect(f.previewCaption).toContain('on a kitchen counter');
    f.toggleEngraving();
    expect(f.darkerEngraving).toBe(true);
  });
});

describe('Burn Watch: select events, acknowledge hides the alert, timeline follows the clip', () => {
  it('works on the loaded clip', async () => {
    const w = new WatchState();
    await w.load();
    expect(w.clipSec).toBe(58);
    expect(w.selected?.atSec).toBe(42);
    w.selectEvent(12);
    expect(w.selected?.note).toBe('Engrave started');
    expect(w.showAlert).toBe(true);
    w.acknowledge();
    expect(w.showAlert).toBe(false);
  });
});

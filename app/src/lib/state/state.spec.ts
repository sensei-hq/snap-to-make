import { describe, it, expect } from 'vitest';
import { ConversationState } from './conversation.svelte';
import { TraceState } from './trace.svelte';
import { PlaybackState } from './playback.svelte';
describe('ConversationState slots (R-CV-5)', () => {
  it('fills slots from the AC utterance', () => {
    const c = new ConversationState();
    c.ingestTranscript('make four coasters 3 mm birch');
    expect(c.slots).toMatchObject({ intent: 'coasters', qty: 4, material: 'birch', thicknessMm: 3 });
  });
});
describe('TraceState (R-UT-1/2)', () => {
  it('sums cost and counts models', () => {
    const t = new TraceState();
    t.add({ model: 'muse-spark-1.3', purpose: 'plan', latencyMs: 100, costUsd: 0.02 });
    t.add({ model: 'sam-3.1', purpose: 'mask', latencyMs: 50, costUsd: 0.01 });
    expect(t.totalCostUsd).toBeCloseTo(0.03);
    expect(t.modelCount).toBe(2);
    expect(t.label).toContain('$0.03');
  });
  it('trips budget at session cap', () => {
    const t = new TraceState(0.05);
    t.add({ model: 'muse-image-1.0', purpose: 'preview', latencyMs: 1, costUsd: 0.06 });
    expect(t.budgetTripped).toBe(true);
  });
});
describe('PlaybackState', () => {
  it('play/pause/scrub/speed advance deterministically', () => {
    const p = new PlaybackState({ ops: [{ op: 'engrave-surface', pieceId: 'a', label: 'engrave a', startSec: 0, durationSec: 6 }, { op: 'cut-through', pieceId: 'a', label: 'cut a', startSec: 6, durationSec: 6 }], totalSec: 12 });
    expect(p.currentOp?.label).toBe('engrave a');
    p.seek(7); expect(p.currentOp?.label).toBe('cut a');
    p.setSpeed(16); expect(p.speed).toBe(16);
    p.play(); expect(p.playing).toBe(true);
    p.pause(); expect(p.playing).toBe(false);
  });
});
import { DesignState } from './design.svelte';
import { SessionState } from './session.svelte';
describe('DesignState Object -> Impl re-plan', () => {
  it('defaults to laser and re-plans on target switch without changing Object', async () => {
    const { designSpecToObject } = await import('../domain/geometry');
    const obj = designSpecToObject({ project: 'x', material: { id: 'birch', thicknessMm: 3 }, deviceId: 'longer-ray5-10w', sheet: { wMm: 300, hMm: 300 }, parts: [{ name: 'holder', qty: 1, template: 'finger_box_open', params: { innerWMm: 97, innerDMm: 14, innerHMm: 40 } }], kerfMm: 0.1, clearanceMm: 1, assumptions: [] });
    const d = new DesignState();
    d.setObject(obj);
    expect(d.impl?.adapterId).toBe('laser');
    const before = JSON.stringify(d.object);
    d.selectTarget({ adapterId: 'cricut', deviceId: 'cricut-maker', materialId: 'chipboard', thicknessMm: 1 });
    expect(d.impl?.adapterId).toBe('cricut');
    expect(JSON.stringify(d.object)).toBe(before);
  });
});
describe('SessionState + Playback tick + Trace export', () => {
  it('gates until accepted; playback ticks only when playing; trace exports', () => {
    const s = new SessionState(); expect(s.gated).toBe(false);
    s.accept('sess-1', 'DEMO-JUDGES'); expect(s.gated).toBe(true); expect(s.attested18).toBe(true);
    const p = new PlaybackState({ ops: [{ op: 'cut-through', pieceId: 'a', label: 'cut a', startSec: 0, durationSec: 6 }], totalSec: 6 });
    p.tick(3); expect(p.positionSec).toBe(0);
    p.play(); p.tick(3); expect(p.positionSec).toBe(3);
    p.tick(10); expect(p.playing).toBe(false);
    const t = new TraceState(); t.add({ model: 'muse-spark-1.3', purpose: 'plan', latencyMs: 1, costUsd: 0.01 });
    expect(JSON.parse(t.exportJson()).entries).toHaveLength(1);
    const c = new ConversationState(); c.say('hello'); expect(c.log.at(-1)).toEqual({ role: 'assistant', text: 'hello' });
    c.ingestTranscript('ornament for six in walnut'); expect(c.slots.qty).toBe(6);
  });
});

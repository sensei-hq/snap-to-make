import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlowState } from './flow.svelte';
import { SessionState } from './session.svelte';
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => ({
    ok: true,
    json: async () => String(url).includes('scene')
      ? { measure: { status: 'measured', targets: [{ valueMm: 82 }] }, trace: [{ model: 'muse-spark-1.3', purpose: 'analyze_scene', latencyMs: 1, costUsd: 0.01 }] }
      : String(url).includes('gate') ? { sessionId: 'sess-9' } : { object: {}, impl: {}, trace: [{ model: 'muse-spark-1.3', purpose: 'plan_design', latencyMs: 1, costUsd: 0.02 }] }
  })));
});
describe('FlowState orchestration', () => {
  it('analyse measures and traces; plan builds impl + playback; switch re-plans', async () => {
    const f = new FlowState();
    await f.analyse();
    expect(f.measureLabel).toContain('82 mm');
    await f.plan();
    expect(f.design.impl?.adapterId).toBe('laser');
    expect(f.playback).toBeTruthy();
    f.selectAdapter('cricut');
    expect(f.design.impl?.adapterId).toBe('cricut');
    expect(f.download('.gcode')).toBe('Phase 2 export');
    f.selectAdapter('laser');
    expect(f.download('.gcode')).toContain('G21');
  });
});
describe('SessionState.enter', () => {
  it('accepts on ok gate response', async () => {
    const s = new SessionState();
    expect(await s.enter('DEMO-JUDGES', true)).toBe(true);
    expect(s.sessionId).toBe('sess-9');
  });
});
describe('FlowState.talk fallback', () => {
  it('uses the demo transcript when SpeechRecognition is unavailable', async () => {
    const f = new FlowState();
    await f.talk();
    expect(f.conversation.slots).toMatchObject({ intent: 'coasters', qty: 4 });
  });
});

import { describe, it, expect } from 'vitest';
import { ConversationState } from './conversation.svelte';

describe('ConversationState listening shell', () => {
  it('start/stop listening sets partial transcript and timer label', () => {
    const c = new ConversationState();
    c.startListening();
    expect(c.listening).toBe(true);
    expect(c.partial).toContain('coasters');
    c.stopListening();
    expect(c.listening).toBe(false);
    expect(c.transcript).toContain('coasters');
  });
});

import { WatchState } from './watch.svelte';
import { TraceState } from './trace.svelte';
import { SessionState } from './session.svelte';
import { FlowState } from './flow.svelte';

describe('WatchState alert shell', () => {
  it('finds flare alert, replay seeks, acknowledge marks checked', async () => {
    const w = new WatchState();
    w.events = [{ atSec: 5, kind: 'ok', note: 'Engrave pass OK' }, { atSec: 42, kind: 'flare', note: 'Flare · coaster 3' }];
    expect(w.alert?.atSec).toBe(42);
    w.replay(); expect(w.positionSec).toBe(42);
    w.acknowledge(); expect(w.checked).toBe(true);
    const empty = new WatchState(); expect(empty.alert).toBeNull(); empty.replay(); expect(empty.positionSec).toBe(42);
  });
  it('loads events from /api/watch', async () => {
    globalThis.fetch = (async () => ({ json: async () => ({ events: [{ atSec: 1, kind: 'ok', note: 'n' }] }) })) as any;
    const w = new WatchState(); await w.load(); expect(w.events).toHaveLength(1);
  });
});

describe('TraceState totals for Under the hood', () => {
  it('sums ms, shares by model', () => {
    const t = new TraceState();
    t.add({ model: 'muse-spark-1.3', purpose: 'read scene', latencyMs: 1800, costUsd: 0.01 });
    t.add({ model: 'sam-3.1', purpose: 'mask mug', latencyMs: 640, costUsd: 0.0025 });
    t.add({ model: 'muse-spark-1.3', purpose: 'plan', latencyMs: 6200, costUsd: 0.02 });
    expect(t.totalMs).toBe(8640);
    expect(t.modelShares.find(s => s.model === 'muse-spark-1.3')?.cost).toBeCloseTo(0.03);
  });
});

describe('SessionState form gate (First run)', () => {
  it('says which part is missing: the code, the three ticks, or what the gate said', async () => {
    const s = new SessionState();
    expect(s.canEnter).toBe(false);
    expect(await s.enterFromForm()).toBe(false);
    expect(s.msg).toBe('Enter your invite code');
    s.code = 'NOPE';
    expect(await s.enterFromForm()).toBe(false);
    expect(s.msg).toBe('Tick all three to continue');
    s.attested = true; s.safetyAck = true; s.noPersonalAck = true;
    expect(s.canEnter).toBe(true);
    globalThis.fetch = (async () => ({ ok: false, json: async () => ({ ok: false, reason: 'That invite code isn’t valid' }) })) as any;
    expect(await s.enterFromForm()).toBe(false);
    expect(s.msg).toBe('That invite code isn’t valid');
    globalThis.fetch = (async () => ({ ok: true, json: async () => ({ ok: true }) })) as any;
    expect(await s.enterFromForm()).toBe(true);
    expect(s.msg).toContain('Welcome');
  });
});

describe('FlowState listening wiring', () => {
  it('starts and stops listening', () => {
    globalThis.fetch = (async () => ({ json: async () => ({ trace: [], measure: null }) })) as any;
    const f = new FlowState();
    f.startListen(); expect(f.conversation.listening).toBe(true);
    f.stopListen(); expect(f.conversation.listening).toBe(false);
  });
});

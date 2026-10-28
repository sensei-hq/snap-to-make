import { describe, expect, it } from 'vitest';
import { AppState } from './app.svelte';

describe('AppState (one per app, shared by every section)', () => {
  it('owns one flow, and the trace the cost pill reads is that flow’s trace', () => {
    const app = new AppState();
    expect(app.trace).toBe(app.flow.trace);
    app.trace.add({ model: 'muse-spark-1.3', purpose: 'analyze_scene', latencyMs: 10, costUsd: 0.02 });
    expect(app.costPill).toBe('$0.02 · 1 models');
  });

  it('keeps section state alive across navigation (same instances)', () => {
    const app = new AppState();
    const { convert, watch, batch, capture } = app;
    expect([app.convert, app.watch, app.batch, app.capture]).toEqual([convert, watch, batch, capture]);
  });

  it('opens and closes the Katachi chat panel', () => {
    const app = new AppState();
    expect(app.chatOpen).toBe(true);
    app.toggleChat();
    expect(app.chatOpen).toBe(false);
  });

  it('holds the current screen title and subtitle for the shell header', () => {
    const app = new AppState();
    app.setScreen('Burn Watch', 'recorded clip · 0:58');
    expect(app.screen).toEqual({ title: 'Burn Watch', subtitle: 'recorded clip · 0:58' });
  });

  it('routes a composer message into the conversation and the analysis', async () => {
    globalThis.fetch = (async () => ({ json: async () => ({ trace: [], measure: null }) })) as unknown as typeof fetch;
    const app = new AppState();
    await app.ask('make four coasters 3 mm birch');
    expect(app.flow.conversation.slots).toMatchObject({ qty: 4, thicknessMm: 3, material: 'birch' });
  });

  it('keeps every bot interaction in one chat log (Rokkit ChatMessage shape), with optional actions', () => {
    const app = new AppState();
    expect(app.messages).toEqual([{ id: 'm0', role: 'assistant', text: 'Hi Dev — what are we making today?' }]);
    app.flow.conversation.ingestTranscript('make four coasters');
    app.flow.conversation.say('Build plan ready.', [{ label: 'Open the plan', href: '/snap/plan' }]);
    expect(app.messages).toEqual([
      { id: 'm0', role: 'assistant', text: 'Hi Dev — what are we making today?' },
      { id: 'm1', role: 'user', text: 'make four coasters' },
      { id: 'm2', role: 'assistant', text: 'Build plan ready.', data: { actions: [{ label: 'Open the plan', href: '/snap/plan' }] } }
    ]);
  });

  it('shows one right panel at a time in the studio: properties or the Katachi chat', () => {
    const app = new AppState();
    expect([app.chatOpen, app.propsOpen]).toEqual([true, false]);
    app.toggleProps();
    expect([app.chatOpen, app.propsOpen]).toEqual([false, true]);
    app.toggleChat();
    expect([app.chatOpen, app.propsOpen]).toEqual([true, false]);
  });

  it('sets the theme density for the whole app (settings)', async () => {
    const { vibe } = await import('@rokkit/states');
    const app = new AppState();
    app.setDensity('compact');
    expect(vibe.density).toBe('compact');
    app.setDensity('comfortable');
    expect(vibe.density).toBe('comfortable');
  });

  it('opens and closes the assistant sheet on phones', () => {
    const app = new AppState();
    expect(app.sheetOpen).toBe(false);
    app.toggleSheet();
    expect(app.sheetOpen).toBe(true);
  });

  it('hands a page’s info view to the assistant (Chat | Info) and clears it when the page leaves', () => {
    const app = new AppState();
    expect(app.info).toBeNull();
    const body = (() => {}) as never;
    app.setInfo('Regions', body);
    expect(app.info?.title).toBe('Regions');
    expect(app.panelTab).toBe('info');
    app.setPanelTab('chat');
    expect(app.panelTab).toBe('chat');
    app.clearInfo();
    expect([app.info, app.panelTab]).toEqual([null, 'chat']);
  });

  it('guides each layers step once in the chat, with Previous / Next and the step’s suggestions', () => {
    const app = new AppState();
    app.guideStep('objects');
    app.guideStep('objects');
    const steps = app.messages.filter((m) => m.data?.actions?.some((a) => a.label.startsWith('Next')));
    expect(steps).toHaveLength(1);
    expect(steps[0].data?.actions).toEqual([
      { label: 'Previous · Cutout', href: '/snap/layers/cutout' },
      { label: 'Next · Layers', href: '/snap/layers/layers' }
    ]);
    expect(app.suggestions.length).toBeGreaterThan(0);
  });

  it('a leaving page only clears the info it set (the next page sets its own first)', () => {
    const app = new AppState();
    const cutout = (() => {}) as never, objects = (() => {}) as never;
    app.setInfo('Checks', cutout);
    app.setInfo('Regions', objects);
    app.clearInfo(cutout);
    expect(app.info?.title).toBe('Regions');
    app.clearInfo(objects);
    expect(app.info).toBeNull();
  });
});

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

  it('builds the chat panel thread from the conversation: greeting, what you said, Katachi’s replies', () => {
    const app = new AppState();
    expect(app.messages).toEqual([{ role: 'katachi', text: 'Hi Dev — what are we making today?' }]);
    app.flow.conversation.ingestTranscript('make four coasters');
    app.flow.conversation.say('Build plan ready.');
    expect(app.messages).toEqual([
      { role: 'katachi', text: 'Hi Dev — what are we making today?' },
      { role: 'user', text: 'make four coasters' },
      { role: 'katachi', text: 'Build plan ready.' }
    ]);
  });

  it('a suggestion chip becomes what you said (the page then opens the camera)', () => {
    const app = new AppState();
    app.pickSuggestion('Coasters from my sketch');
    expect(app.flow.conversation.transcript).toBe('Coasters from my sketch');
    expect(app.flow.conversation.slots.intent).toBe('coasters');
  });

  it('shows one right panel at a time in the studio: properties or the Katachi chat', () => {
    const app = new AppState();
    expect([app.chatOpen, app.propsOpen]).toEqual([true, false]);
    app.toggleProps();
    expect([app.chatOpen, app.propsOpen]).toEqual([false, true]);
    app.toggleChat();
    expect([app.chatOpen, app.propsOpen]).toEqual([true, false]);
  });
});

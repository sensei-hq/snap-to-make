import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConvertState } from './convert.svelte';
import { BatchState } from './batch.svelte';
import { WatchState } from './watch.svelte';
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, json: async () => String(url).includes('convert')
    ? { objective: 'Build a coffin lantern', conversionClass: 'composite-3d', variations: [{ title: 'As shown', change: 'faithful' }, { title: 'Cat edition', change: 'add a cat' }], pieces: [{ name: 'Front face', kind: 'face', note: 'outline' }, { name: 'Base / stand', kind: 'base', note: 'base' }], source: 'fixture' }
    : String(url).includes('batch') ? { status: 'done', steps: ['Nested onto 4 sheets'], plan: '4 sheets' } : { events: [{ atSec: 1, kind: 'ok', note: 'cutting' }] } })));
});
describe('ConvertState propose -> agree -> breakdown', () => {
  it('builds a breakdown for the agreed variation', async () => {
    const c = new ConvertState();
    c.description = 'coffin lantern'; c.comment = 'add a cat';
    await c.propose();
    expect(c.objective).toContain('coffin');
    c.agree(c.variations[1]);
    expect(c.breakdown?.pieces.length).toBeGreaterThan(0);
    expect(c.breakdown?.pieces.some(p => p.name.includes('holder'))).toBe(false);
    expect(c.status).toBe('agreed');
  });
  it('shrink group breakdown scales pieces', async () => {
    const c = new ConvertState(); c.group = 'shrink-plastic'; c.description = 'fox charm';
    await c.propose(); c.agree(c.variations[0]);
    expect(c.breakdown?.group).toBe('shrink-plastic');
  });
});
describe('Batch + Watch states', () => {
  it('batch completes with a plan; watch loads events', async () => {
    const b = new BatchState(); await b.start('Maya, Leo'); expect(b.job?.plan).toContain('sheets');
    const w = new WatchState(); await w.load(); expect(w.events[0].kind).toBe('ok');
  });
});
describe('ConvertState guided dissection', () => {
  it('keeps the image visible state and narrates dissection in chat', async () => {
    const c = new ConvertState();
    await c.setImage('photo.jpg', 'data:image/jpeg;base64,xx');
    expect(c.imageUrl).toContain('data:image');
    expect(c.dissection?.subject).toBeTruthy();
    expect(c.chatTurns.some(m => m.role === 'katachi' && /see/i.test(m.text))).toBe(true);
    c.comment = 'add a cat';
    await c.propose('data:image/jpeg;base64,xx');
    expect(c.chatTurns.some(m => /variation/i.test(m.text))).toBe(true);
  });
});
describe('ConvertState dedupe', () => {
  it('proposing twice with unchanged inputs does not duplicate chat or re-call the API', async () => {
    const c = new ConvertState(); c.description = 'coffin lantern';
    const before = (globalThis.fetch as any).mock.calls.length;
    await c.propose();
    const callsAfterFirst = (globalThis.fetch as any).mock.calls.length;
    const msgsAfterFirst = c.chatTurns.length;
    await c.propose();
    expect((globalThis.fetch as any).mock.calls.length).toBe(callsAfterFirst);
    expect(c.chatTurns.length).toBe(msgsAfterFirst);
    expect(callsAfterFirst).toBeGreaterThan(before);
  });
  it('changing the comment allows a fresh dissection', async () => {
    const c = new ConvertState(); c.description = 'coffin lantern';
    await c.propose();
    const n = c.chatTurns.length;
    c.comment = 'make it spookier';
    await c.propose();
    expect(c.chatTurns.length).toBeGreaterThan(n);
  });
});
describe('ConvertState empty input', () => {
  it('asks for a photo or description instead of a generic dissection', async () => {
    const c = new ConvertState();
    await c.propose();
    expect(c.variations).toHaveLength(0);
    expect(c.messages.at(-1)?.text).toMatch(/drop.*photo|describe/i);
  });
});

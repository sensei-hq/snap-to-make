import { describe, it, expect, vi } from 'vitest';
import { MetaClient, metaEnabled } from './meta/client';
describe('MetaClient (server-only key)', () => {
  it('is disabled without a key (routes serve fixtures)', () => {
    expect(metaEnabled({})).toBe(false);
    expect(metaEnabled({ META_API_KEY: 'k' })).toBe(true);
  });
  it('calls Spark with structured output and returns parsed JSON + cost', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ output_text: '{"objects":[]}' }), { status: 200 }));
    const c = new MetaClient('secret', fetchFn as any);
    const r = await c.sparkJson('sys', 'hi', { type: 'object' });
    expect(r.data).toEqual({ objects: [] });
    expect(r.costUsd).toBeGreaterThan(0);
    const [, init] = fetchFn.mock.calls[0] as any;
    expect(init.headers.Authorization).toBe('Bearer secret');
    expect(String(init.body)).not.toContain('undefined');
  });
  it('throws a typed error on 429 for backoff handling', async () => {
    const c = new MetaClient('k', (async () => new Response('slow', { status: 429 })) as any);
    await expect(c.sparkJson('s', 'u', {})).rejects.toMatchObject({ status: 429 });
  });
});
describe('sparkJson response parsing (real API shape)', () => {
  it('skips the reasoning block and parses the message JSON', async () => {
    const realShape = { output: [{ type: 'reasoning', summary: [] }, { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: '{"objects":[]}' }] }], usage: { input_tokens: 100, output_tokens: 20 } };
    const c = new MetaClient('k', (async () => new Response(JSON.stringify(realShape), { status: 200 })) as any);
    expect((await c.sparkJson('s', 'u', {})).data).toEqual({ objects: [] });
  });
});

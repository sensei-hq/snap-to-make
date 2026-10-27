import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { MetaClient } from '$lib/server/meta/client';
export async function POST() {
  if (env.META_API_KEY) {
    try {
      const c = new MetaClient(env.META_API_KEY);
      const r = await c.imageEdit('Redraw as clean, bold, single-color black line art on pure white, laser-engraving friendly, keep the composition', 3);
      return json({ variants: ['M · live variant 1', 'M · live variant 2', 'M · live variant 3'], source: 'live', trace: [{ model: 'muse-image-1.0', purpose: 'art_cleanup x3', latencyMs: 2200, costUsd: r.costUsd }] });
    } catch { /* degraded: fall through to fixture */ }
  }
  return json({ variants: ['M · bold lines', 'M · leaves', 'M · minimal'], source: 'fixture', trace: [{ model: 'muse-image-1.0', purpose: 'art_cleanup x3 (demo fixture — set META_API_KEY for live)', latencyMs: 2200, costUsd: 0.03 }] });
}

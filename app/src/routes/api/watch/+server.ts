import { json } from '@sveltejs/kit';
import { BurnEventsSchema } from '$lib/domain/schemas';
const EVENTS = { events: [{ atSec: 4, kind: 'ok', note: 'Cutting coaster 1' }, { atSec: 22, kind: 'smoke_heavy', note: 'Heavy smoke — check extraction' }, { atSec: 41, kind: 'flare', note: 'Flare on coaster 3 — pause and check air assist' }, { atSec: 58, kind: 'ok', note: 'Sheet complete' }] };
export async function POST() {
  const parsed = BurnEventsSchema.safeParse(EVENTS);
  if (!parsed.success) return json({ error: 'Invalid burn events' }, { status: 502 });
  return json({ events: parsed.data.events, trace: [{ model: 'sam-3.1', purpose: 'track workpiece (video)', latencyMs: 1800, costUsd: 0.024 }, { model: 'muse-spark-1.3', purpose: 'watch_burn analysis', latencyMs: 1200, costUsd: 0.01 }] });
}

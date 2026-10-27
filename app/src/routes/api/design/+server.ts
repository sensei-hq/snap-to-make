import { json } from '@sveltejs/kit';
import { DesignSpecSchema } from '$lib/domain/schemas';
import { designSpecToObject } from '$lib/domain/geometry';
import { getAdapter } from '$lib/devices/registry';
export async function POST({ request }) {
  const body = await request.json();
  const parsed = DesignSpecSchema.safeParse(body.spec ?? body);
  if (!parsed.success) return json({ error: 'Invalid DesignSpec', issues: parsed.error.issues }, { status: 400 });
  const object = designSpecToObject(parsed.data);
  const adapter = getAdapter(body.adapterId ?? 'laser');
  const impl = adapter.plan(object, { ...adapter.defaultTarget, ...(body.thicknessMm ? { thicknessMm: body.thicknessMm } : {}) });
  return json({ object, impl, trace: [{ model: 'muse-spark-1.3', purpose: 'plan_design', latencyMs: 1400, costUsd: 0.02 }] });
}

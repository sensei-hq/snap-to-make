import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { analyseScene } from '$lib/server/meta/analyse';
export async function POST() {
  const r = await analyseScene({ META_API_KEY: env.META_API_KEY });
  return json({ scene: r.scene, measure: r.measure, source: r.source, trace: r.trace });
}

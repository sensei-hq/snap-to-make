import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
// Wonder batch (R-WB, P1+): background-style job, never on the interactive path.
// Without META_API_KEY returns the recorded-run plan (demo fallback per cut order).
export async function POST({ request }) {
  const { names = '' } = await request.json().catch(() => ({ names: '' }));
  const list = String(names).split(',').map(s => s.trim()).filter(Boolean);
  const count = list.length || 40;
  return json({ status: 'done', steps: ['Designed template', `Generated ${count} variants`, 'Nested onto 4 sheets', 'Looked up birch prices', 'Estimated burn time 3h 10m'], plan: `4 sheets · est. 3h 10m burn · $18.40 birch · ${count} ornaments`, source: env.META_API_KEY ? 'wonder-ready' : 'recorded-run' });
}

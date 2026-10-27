import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { proposeConversion } from '$lib/server/meta/convert';
export async function POST({ request }) {
  const body = await request.json().catch(() => ({}));
  const r = await proposeConversion({ META_API_KEY: env.META_API_KEY }, body);
  return json(r);
}

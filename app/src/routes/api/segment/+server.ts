import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { segmentPiece } from '$lib/server/meta/sam';
export async function POST({ request }) {
  const { imageDataUrl, prompt } = await request.json().catch(() => ({}));
  const r = await segmentPiece({ META_API_KEY: env.META_API_KEY }, String(imageDataUrl ?? ''), String(prompt ?? ''));
  return json(r);
}

// SAM 3.1 via Responses returns text like: <|box;x1=..;y1=..;x2=..;y2=..;w=1024;h=1024|><|mask;...|>
export interface SamBox { x1: number; y1: number; x2: number; y2: number }
export function parseSamBoxes(text: string): SamBox[] {
  const boxes: SamBox[] = [];
  for (const m of text.matchAll(/<\|box;x1=(\d+);y1=(\d+);x2=(\d+);y2=(\d+);w=(\d+);h=(\d+)\|>/g)) {
    const [, x1, y1, x2, y2, w, h] = m.map(Number) as unknown as number[];
    boxes.push({ x1: (x1 / w) * 1000, y1: (y1 / h) * 1000, x2: (x2 / w) * 1000, y2: (y2 / h) * 1000 });
  }
  return boxes;
}
import { MetaClient } from './client';
export async function segmentPiece(env: Record<string, string | undefined>, imageDataUrl: string, prompt: string, client?: MetaClient): Promise<{ boxes: SamBox[]; source: 'live' | 'fixture' }> {
  if (env.META_API_KEY && imageDataUrl) {
    try {
      const c = client ?? new MetaClient(env.META_API_KEY);
      const text = await c.samText(imageDataUrl, prompt);
      const boxes = parseSamBoxes(text);
      if (boxes.length) return { boxes, source: 'live' };
    } catch (e) { console.error('segment live failed:', e instanceof Error ? e.message : String(e)); }
  }
  return { boxes: [{ x1: 300, y1: 200, x2: 700, y2: 800 }], source: 'fixture' };
}

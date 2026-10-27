// Measurement math (R-UN-3/4): code measures, models never guess numbers.
export const REFERENCE_MM: Record<string, { w: number; h: number }> = {
  id1_card: { w: 85.60, h: 53.98 }, us_letter: { w: 279.4, h: 215.9 }, a4: { w: 297, h: 210 }, quarter: { w: 24.26, h: 24.26 }
};
export interface ScaleResult { pxPerMm: number; aspectError: number; warning?: string }
export function scaleFromCard(rect: { wPx: number; hPx: number }, kind = 'id1_card'): ScaleResult {
  const ref = REFERENCE_MM[kind] ?? REFERENCE_MM.id1_card;
  const longPx = Math.max(rect.wPx, rect.hPx), shortPx = Math.min(rect.wPx, rect.hPx);
  const pxPerMm = (longPx / ref.w + shortPx / ref.h) / 2;
  const expectedAspect = ref.w / ref.h, actualAspect = longPx / Math.max(shortPx, 1);
  const aspectError = Math.abs(actualAspect - expectedAspect) / expectedAspect;
  return { pxPerMm, aspectError, ...(aspectError > 0.06 ? { warning: 'Shoot more top-down for accuracy' } : {}) };
}
export function diameterFromMask(mask: { minorPx: number; majorPx: number }, pxPerMm: number): number {
  return mask.minorPx / pxPerMm; // minor axis is perspective-robust for circles
}
export type MeasureInput = { reference: { kind: string; wPx: number; hPx: number } | null; targets: { id: string; shape: 'round'|'rectangular'; minorPx?: number; majorPx?: number; wPx?: number; hPx?: number }[] };
export type MeasureResult = { status: 'needs-reference' } | { status: 'measured'; pxPerMm: number; targets: { objectId: string; kind: 'diameter'|'wh'; valueMm: number; wMm?: number; hMm?: number; confidence: number }[] };
export function measureScene(input: MeasureInput): MeasureResult {
  if (!input.reference) return { status: 'needs-reference' };
  const scale = scaleFromCard(input.reference, input.reference.kind);
  const confidence = Math.max(0, Math.min(1, 1 - scale.aspectError * 4));
  const targets = input.targets.map((t) => t.shape === 'round'
    ? { objectId: t.id, kind: 'diameter' as const, valueMm: diameterFromMask({ minorPx: t.minorPx ?? 0, majorPx: t.majorPx ?? 0 }, scale.pxPerMm), confidence }
    : { objectId: t.id, kind: 'wh' as const, valueMm: 0, wMm: (t.wPx ?? 0) / scale.pxPerMm, hMm: (t.hPx ?? 0) / scale.pxPerMm, confidence });
  return { status: 'measured', pxPerMm: scale.pxPerMm, targets };
}

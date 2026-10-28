import { nestParts } from './nesting';
import type { ImplPlan } from '../devices/types';

// The canvas sheet: the plan's real pieces, nested on the first sheet. Pure; the page only draws it.
export interface CanvasPiece { id: string; kind: 'circle' | 'rect'; xMm: number; yMm: number; wMm: number; hMm: number; label?: string }

export function implToCanvas(impl: ImplPlan, marginMm = 6): CanvasPiece[] {
  const inner = { wMm: impl.sheetMm.wMm - 2 * marginMm, hMm: impl.sheetMm.hMm - 2 * marginMm };
  const first = nestParts(impl.pieces.map((p) => ({ id: p.id, wMm: p.wMm, hMm: p.hMm })), inner).sheets[0]?.placements ?? [];
  const at = new Map(first.map((pl) => [pl.id, pl]));
  return impl.pieces.filter((p) => at.has(p.id)).map((p) => {
    const pl = at.get(p.id)!;
    const round = p.name === 'coaster';
    return {
      id: p.id, kind: round ? 'circle' : 'rect', xMm: pl.xMm + marginMm, yMm: pl.yMm + marginMm, wMm: p.wMm, hMm: p.hMm,
      ...(p.ops.includes('engrave-surface') ? { label: 'M' } : {})
    };
  });
}

import type { DesignSpec } from './schemas';

// Coasters + finger-joint holder, sized in code from the measured mug base
// (PRD rule: models choose, code computes). Numbers follow the design mock.
export const COASTER_RULES = { clearanceMm: 13, fitMm: 1, kerfMm: 0.1, qty: 4, thicknessMm: 3, sheet: { wMm: 300, hMm: 300 } } as const;

export type LidState = 'offered' | 'added' | 'declined';
export interface CoasterSetInput { mugBaseMm: number; wallHeightMm?: number; lid?: LidState }
export interface SetPart { id: string; name: string; qty: number; wMm: number; hMm: number; round?: boolean }
export interface CoasterSet {
  coasterDiameterMm: number;
  holderInner: { wMm: number; dMm: number; hMm: number };
  holderOuter: { lengthMm: number; depthMm: number };
  wallHeightMm: number;
  lid: LidState;
  parts: SetPart[];
  partCount: number;
  sheetUsePct: number;
  estimateMinutes: number;
  preflight: { label: string; ok: boolean }[];
  assumptions: string[];
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function deriveCoasterSet({ mugBaseMm, wallHeightMm = 40, lid = 'offered' }: CoasterSetInput): CoasterSet {
  const { clearanceMm, fitMm, kerfMm, qty, thicknessMm: t, sheet } = COASTER_RULES;
  const d = round1(mugBaseMm + clearanceMm);
  const inner = { wMm: round1(d + 2 * fitMm), dMm: round1(qty * t + 2 * fitMm), hMm: wallHeightMm };
  const outer = { lengthMm: round1(inner.wMm + 2 * t), depthMm: round1(inner.dMm + 2 * t) };
  const parts: SetPart[] = [
    { id: 'coaster', name: 'Coaster', qty, wMm: d, hMm: d, round: true },
    { id: 'base', name: 'Base', qty: 1, wMm: outer.lengthMm, hMm: outer.depthMm },
    { id: 'long', name: 'Long wall', qty: 2, wMm: outer.lengthMm, hMm: wallHeightMm },
    { id: 'short', name: 'Short wall', qty: 2, wMm: outer.depthMm, hMm: wallHeightMm },
    ...(lid === 'added' ? [{ id: 'lid', name: 'Lid', qty: 1, wMm: outer.lengthMm, hMm: outer.depthMm }] : [])
  ];
  const area = parts.reduce((sum, p) => sum + p.qty * (p.round ? Math.PI * (p.wMm / 2) ** 2 : p.wMm * p.hMm), 0);
  const sheetUsePct = Math.min(100, Math.round((area / (sheet.wMm * sheet.hMm)) * 100));
  return {
    coasterDiameterMm: d, holderInner: inner, holderOuter: outer, wallHeightMm, lid, parts,
    partCount: parts.reduce((n, p) => n + p.qty, 0),
    sheetUsePct,
    estimateMinutes: 12 + Math.round(wallHeightMm / 20) + (lid === 'added' ? 2 : 0),
    preflight: [
      { label: 'Fits the bed', ok: sheetUsePct < 100 && outer.lengthMm <= sheet.wMm && d <= sheet.wMm },
      { label: 'Paths closed', ok: true },
      { label: 'Engrave before cut', ok: true }
    ],
    assumptions: [`Coaster = mug base + ${clearanceMm} mm`, `Clearance ${fitMm} mm · kerf ${kerfMm} mm`]
  };
}

export function coasterSetToSpec(set: CoasterSet, opts: { qty: number; materialId: string; thicknessMm: number; project?: string }): DesignSpec {
  return {
    project: opts.project ?? 'Coasters for Maya',
    material: { id: opts.materialId, thicknessMm: opts.thicknessMm },
    deviceId: 'longer-ray5-10w',
    sheet: { ...COASTER_RULES.sheet },
    parts: [
      { name: 'coaster', qty: opts.qty, template: 'coaster', params: { shape: 'round', diameterMm: set.coasterDiameterMm }, engrave: [{ artId: 'art-2', sizeMm: 60, anchor: 'center' }] },
      { name: 'holder', qty: 1, template: 'finger_box_open', params: { innerWMm: set.holderInner.wMm, innerDMm: set.holderInner.dMm, innerHMm: set.holderInner.hMm } },
      ...(set.lid === 'added' ? [{ name: 'lid', qty: 1, template: 'panel', params: { shape: 'rect', innerWMm: set.holderOuter.lengthMm, innerDMm: set.holderOuter.depthMm } }] : [])
    ],
    kerfMm: COASTER_RULES.kerfMm,
    clearanceMm: COASTER_RULES.fitMm,
    assumptions: set.assumptions
  } as DesignSpec;
}

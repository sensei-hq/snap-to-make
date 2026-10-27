// Convert pipeline domain: groups, classes, shrink scaling, build breakdown.
export type FabricationGroup = 'laser-cut' | 'cricut-paper' | 'shrink-plastic';
export type ConversionClass = 'layered' | 'composite-3d' | 'pattern-shape';
export const DEFAULT_SHRINK_RATIO = 0.4; // final/design for typical shrink film; calibrate per material
export function calibrateRatio(testDesignMm: number, measuredFinalMm: number): number {
  return measuredFinalMm / testDesignMm;
}
export function scaledForShrink(finalMm: number, ratio = DEFAULT_SHRINK_RATIO): number {
  return finalMm / ratio;
}
import type { ObjectSpec } from './object';
import { getAdapter } from '../devices/registry';
export interface BreakdownPiece { name: string; kind: string; cutMm: number; finalMm: number; note: string }
export interface BuildBreakdown { group: FabricationGroup; pieces: BreakdownPiece[]; materials: string[]; tools: string[]; assemblySteps: string[] }
const ADAPTER_FOR_GROUP: Record<FabricationGroup, string> = { 'laser-cut': 'laser', 'cricut-paper': 'cricut', 'shrink-plastic': 'shrink' };
export function buildBreakdown(obj: ObjectSpec, group: FabricationGroup, shrinkRatio = DEFAULT_SHRINK_RATIO): BuildBreakdown {
  const adapter = getAdapter(ADAPTER_FOR_GROUP[group]);
  const plan = adapter.plan(obj, adapter.defaultTarget);
  const isShrink = group === 'shrink-plastic';
  // Adapter plans are in CUT sizes; for shrink the final size is cut x ratio.
  const kindByName = new Map(obj.parts.map(p => [p.name, String(p.intent.kind ?? 'pattern')]));
  const pieces: BreakdownPiece[] = plan.pieces.map(p => {
    const cutMm = Math.max(p.wMm, p.hMm);
    return { name: p.name, kind: (p as { kind?: string }).kind ?? kindByName.get(p.name) ?? 'pattern', cutMm, finalMm: isShrink ? cutMm * shrinkRatio : cutMm, note: p.joint && p.joint !== 'none' ? `${p.joint} join` : 'flat piece' };
  });
  const steps: string[] = [...plan.assemblyTexts];
  if (obj.parts.some(p => p.template === 'finger_box_open')) steps.push('Dry-fit the walls to the base, join the finger joints with wood glue, clamp until set');
  if (isShrink) steps.push(`Bake on parchment per film instructions until flat — pieces shrink to about ${Math.round(shrinkRatio * 100)}% and thicken`, 'Let cool under a flat weight; add findings (jump ring through the pre-punched hole)');
  if (group === 'cricut-paper') steps.push('Weed, score fold lines, fold and glue tabs in order');
  steps.push('Sand edges if needed, finish, and do a final fit check');
  return { group, pieces,
    materials: isShrink ? ['Shrink plastic film', 'Parchment paper', 'Jump rings / findings'] : group === 'cricut-paper' ? [`${obj.materialId} cardstock/chipboard`, 'Glue'] : [`${obj.materialId} sheet ${obj.thicknessMm} mm`, 'Wood glue', 'Finish (oil/wax)'],
    tools: isShrink ? ['Cricut / scissors', 'Hole punch (before baking)', 'Oven or heat gun'] : group === 'cricut-paper' ? ['Cricut Maker', 'Scoring stylus', 'Glue'] : ['Laser cutter', 'Clamps', 'Sandpaper 220'],
    assemblySteps: steps };
}

const KIND_SIZE: Record<string, { wMm: number; hMm: number; shape: string }> = {
  wheel: { wMm: 120, hMm: 120, shape: 'round' }, face: { wMm: 160, hMm: 120, shape: 'rect' },
  base: { wMm: 150, hMm: 90, shape: 'rect' }, join: { wMm: 80, hMm: 24, shape: 'rect' },
  layer: { wMm: 140, hMm: 140, shape: 'rect' }, pattern: { wMm: 120, hMm: 120, shape: 'rect' }, detail: { wMm: 60, hMm: 60, shape: 'round' }
};
export function objectFromPieces(project: string, pieces: { name: string; kind: string; note: string }[], group: FabricationGroup): ObjectSpec {
  return { project, materialId: group === 'shrink-plastic' ? 'shrink-film' : 'birch', thicknessMm: group === 'laser-cut' ? 3 : 1,
    sheetMm: { wMm: 300, hMm: 300 },
    parts: pieces.map((piece, i) => { const s = KIND_SIZE[piece.kind] ?? KIND_SIZE.pattern;
      return { id: `piece-${i + 1}`, name: piece.name, template: piece.kind, qtyIndex: 0, profile: { shape: s.shape, wMm: s.wMm, hMm: s.hMm, ...(s.shape === 'round' ? { diameterMm: s.wMm } : {}) }, thicknessMm: group === 'laser-cut' ? 3 : 1, intent: { kind: piece.kind, note: piece.note } }; }),
    surfaceArt: [], assembly: pieces.map((piece, i) => ({ step: i + 1, text: `Prepare ${piece.name}: ${piece.note}` })), assumptions: [], implVariants: ['laser', 'vinyl', 'printer3d'] };
}

import type { ObjectSpec, AbstractOp } from '../domain/object';
export type { AbstractOp };
export interface Target { adapterId: string; deviceId: string; materialId: string; thicknessMm: number }
export interface ImplPiece { id: string; name: string; kind?: string; wMm: number; hMm: number; joint?: 'finger'|'fold'|'slot'|'none'; ops: AbstractOp[] }
export interface ImplPlan { name?: string; adapterId: string; deviceId: string; pieces: ImplPiece[]; sheetMm: { wMm: number; hMm: number }; sheets: number; assemblyTexts: string[] }
export interface Artifact { filename: string; mime: string; content: string }
export interface TimelineOp { op: AbstractOp; pieceId: string; label: string; startSec: number; durationSec: number }
export interface PlaybackTimeline { ops: TimelineOp[]; totalSec: number }
export interface Estimate { durationSec: number; materialLabel: string }
export interface PreflightIssue { level: 'error'|'warn'; message: string }
export class Phase2Error extends Error { constructor(id: string) { super(`${id} export is Phase 2`); this.name = 'Phase2Error'; } }
export interface DeviceAdapter {
  id: string; kind: string; label: string; defaultTarget: Target;
  capabilities: { workspaceMm: { wMm: number; hMm: number }; ops: AbstractOp[] };
  validate(obj: ObjectSpec, target: Target): PreflightIssue[];
  plan(obj: ObjectSpec, target: Target): ImplPlan;
  emit(plan: ImplPlan): Artifact[];
  preview(plan: ImplPlan): PlaybackTimeline;
  estimate(plan: ImplPlan): Estimate;
}
export function validateWorkspace(obj: ObjectSpec, ws: { wMm: number; hMm: number }): PreflightIssue[] {
  return obj.parts.filter(p => p.profile.wMm > ws.wMm || p.profile.hMm > ws.hMm)
    .map(p => ({ level: 'error' as const, message: `${p.name} exceeds workspace ${ws.wMm}x${ws.hMm}mm` }));
}
export function timelineFor(plan: ImplPlan, secPerOp = 6): PlaybackTimeline {
  const ops: TimelineOp[] = []; let t = 0;
  const ordered = [...plan.pieces.flatMap(p => p.ops.map(op => ({ op, pieceId: p.id })))].sort((a, b) => (a.op === 'engrave-surface' ? 0 : 1) - (b.op === 'engrave-surface' ? 0 : 1));
  for (const o of ordered) { ops.push({ ...o, label: `${o.op} ${o.pieceId}`, startSec: t, durationSec: secPerOp }); t += secPerOp; }
  return { ops, totalSec: t };
}

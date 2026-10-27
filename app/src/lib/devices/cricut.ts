import type { DeviceAdapter } from './types';
import { validateWorkspace, timelineFor, Phase2Error } from './types';
export const cricutAdapter: DeviceAdapter = {
  id: 'cricut', kind: 'vinyl', label: 'Cricut (Phase 2 export)',
  defaultTarget: { adapterId: 'cricut', deviceId: 'cricut-maker', materialId: 'chipboard', thicknessMm: 1 },
  capabilities: { workspaceMm: { wMm: 305, hMm: 305 }, ops: ['cut-through','score-crease','draw-line'] },
  validate: (obj) => validateWorkspace(obj, { wMm: 305, hMm: 305 }),
  plan(obj) { const pieces = obj.parts.map(p => p.template === 'finger_box_open'
    ? { id: 'holder-blank', name: 'holder-blank', wMm: Number(p.intent.innerWMm ?? 97) * 2, hMm: 120, joint: 'fold' as const, ops: ['score-crease' as const, 'cut-through' as const] }
    : { id: p.id, name: p.name, wMm: p.profile.diameterMm ?? p.profile.wMm, hMm: p.profile.diameterMm ?? p.profile.hMm, joint: 'none' as const, ops: ['cut-through' as const] });
    return { adapterId: 'cricut', deviceId: 'cricut-maker', pieces, sheetMm: { wMm: 305, hMm: 305 }, sheets: 1, assemblyTexts: ['Fold on score lines','Glue tabs'] }; },
  emit() { throw new Phase2Error('cricut'); },
  preview: (plan) => timelineFor(plan, 4), estimate: (plan) => ({ durationSec: timelineFor(plan, 4).totalSec, materialLabel: 'chipboard mat' })
};

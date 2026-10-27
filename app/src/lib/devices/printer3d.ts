import type { DeviceAdapter } from './types';
import { validateWorkspace, timelineFor, Phase2Error } from './types';
export const printer3dAdapter: DeviceAdapter = {
  id: 'printer3d', kind: 'printer3d', label: '3D printer (Phase 2 export)',
  defaultTarget: { adapterId: 'printer3d', deviceId: 'generic-fdm', materialId: 'pla', thicknessMm: 3 },
  capabilities: { workspaceMm: { wMm: 220, hMm: 220 }, ops: ['extrude-solid'] },
  validate: (obj) => validateWorkspace(obj, { wMm: 220, hMm: 220 }),
  plan(obj) { const pieces = obj.parts.map(p => ({ id: p.id, name: p.name, wMm: p.profile.diameterMm ?? p.profile.wMm, hMm: p.profile.diameterMm ?? p.profile.hMm, joint: 'slot' as const, ops: ['extrude-solid' as const] }));
    return { adapterId: 'printer3d', deviceId: 'generic-fdm', pieces, sheetMm: { wMm: 220, hMm: 220 }, sheets: 1, assemblyTexts: obj.assembly.map(a => a.text) }; },
  emit() { throw new Phase2Error('printer3d'); },
  preview: (plan) => timelineFor(plan, 30), estimate: (plan) => ({ durationSec: timelineFor(plan, 30).totalSec, materialLabel: 'PLA' })
};

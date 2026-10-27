import type { DeviceAdapter } from './types';
import { timelineFor, validateWorkspace } from './types';
// Simulator wraps any plan's timeline; plan()/emit delegate semantics documented in Stage 07.
export const simulatorAdapter: DeviceAdapter = {
  id: 'simulator', kind: 'simulator', label: 'Simulator (no device)',
  defaultTarget: { adapterId: 'simulator', deviceId: 'simulator', materialId: 'birch', thicknessMm: 3 },
  capabilities: { workspaceMm: { wMm: 400, hMm: 400 }, ops: ['cut-through','engrave-surface','score-crease','draw-line','extrude-solid'] },
  validate: (obj) => validateWorkspace(obj, { wMm: 400, hMm: 400 }),
  plan(obj) { return { adapterId: 'simulator', deviceId: 'simulator', pieces: obj.parts.map(p => ({ id: p.id, name: p.name, wMm: p.profile.wMm, hMm: p.profile.hMm, ops: ['engrave-surface','cut-through'] as const })), sheetMm: obj.sheetMm, sheets: 1, assemblyTexts: obj.assembly.map(a => a.text) }; },
  emit() { return []; },
  preview: (plan) => timelineFor(plan), estimate: (plan) => ({ durationSec: timelineFor(plan).totalSec, materialLabel: 'simulated' })
};

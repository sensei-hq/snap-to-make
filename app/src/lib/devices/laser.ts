import type { DeviceAdapter, ImplPlan } from './types';
import { validateWorkspace, timelineFor } from './types';
import { nestParts } from '../domain/nesting';
function piecesFor(obj: import('../domain/object').ObjectSpec): ImplPlan['pieces'] {
  const pieces: ImplPlan['pieces'] = [];
  for (const p of obj.parts) {
    if (p.template === 'finger_box_open') {
      pieces.push({ id: 'holder-base', name: 'holder-base', wMm: Number(p.intent.innerWMm ?? 97) + 6, hMm: Number(p.intent.innerDMm ?? 14) + 6, joint: 'finger', ops: ['cut-through'] });
      pieces.push({ id: 'holder-wall-long', name: 'holder-wall-long', wMm: Number(p.intent.innerWMm ?? 97) + 6, hMm: Number(p.intent.innerHMm ?? 40), joint: 'finger', ops: ['cut-through'] });
    } else {
      pieces.push({ id: p.id, name: p.name, kind: String(p.intent.kind ?? 'pattern'), wMm: p.profile.diameterMm ?? p.profile.wMm, hMm: p.profile.diameterMm ?? p.profile.hMm, joint: 'none',
        ops: [...(obj.surfaceArt.some(a => a.partName === p.name) ? ['engrave-surface' as const] : []), 'cut-through' as const] });
    }
  }
  return pieces;
}
export const laserAdapter: DeviceAdapter = {
  id: 'laser', kind: 'laser', label: 'Laser · Longer Ray 5',
  defaultTarget: { adapterId: 'laser', deviceId: 'longer-ray5-10w', materialId: 'birch', thicknessMm: 3 },
  capabilities: { workspaceMm: { wMm: 400, hMm: 400 }, ops: ['cut-through','engrave-surface','score-crease'] },
  validate: (obj) => validateWorkspace(obj, { wMm: 400, hMm: 400 }),
  plan(obj) { const pieces = piecesFor(obj); const nested = nestParts(pieces.map(p => ({ id: p.id, wMm: p.wMm, hMm: p.hMm })), obj.sheetMm);
    return { name: obj.project, adapterId: 'laser', deviceId: 'longer-ray5-10w', pieces, sheetMm: obj.sheetMm, sheets: nested.sheets.length, assemblyTexts: obj.assembly.map(a => a.text) }; },
  emit(plan) {
    const engrave = plan.pieces.filter(p => p.ops.includes('engrave-surface')).map(p => `; ENGRAVE ${p.id}\nG0 X0 Y0\nM3 S400\nG1 X${p.wMm} Y${p.hMm} F800\nM5`).join('\n');
    const cut = plan.pieces.map(p => `; CUT ${p.id} joint=${p.joint}\nG0 X0 Y0\nM3 S800\nG1 X${p.wMm} Y0 F400\nG1 X${p.wMm} Y${p.hMm}\nG1 X0 Y${p.hMm}\nG1 X0 Y0\nM5`).join('\n');
    const gcode = `; Katachi laser (Longer Ray 5)\nG21 ; mm\nG90\n${engrave}\n${cut}\nM2\n`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${plan.sheetMm.wMm}mm" height="${plan.sheetMm.hMm}mm">${plan.pieces.map(p => `<rect width="${p.wMm}" height="${p.hMm}" fill="none" stroke="red" stroke-width="0.1"/>`).join('')}</svg>`;
    const burn = JSON.stringify({ version: '1.3', name: plan.name ?? 'design', deviceId: plan.deviceId, adapterId: plan.adapterId, pieces: plan.pieces }, null, 2);
    return [{ filename: 'design.gcode', mime: 'text/plain', content: gcode }, { filename: 'design.svg', mime: 'image/svg+xml', content: svg }, { filename: 'design.burn', mime: 'application/json', content: burn }];
  },
  preview: (plan) => timelineFor(plan), estimate: (plan) => ({ durationSec: timelineFor(plan).totalSec, materialLabel: 'birch sheet' })
};

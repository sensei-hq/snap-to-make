import type { DeviceAdapter } from './types';
import { timelineFor, Phase2Error } from './types';
import { scaledForShrink, DEFAULT_SHRINK_RATIO } from '../domain/convert';
// Shrink plastic: cut/draw LARGE, bake, piece shrinks to final size (thicker + stronger).
export const shrinkAdapter: DeviceAdapter = {
  id: 'shrink', kind: 'shrink-plastic', label: 'Shrink plastic (bake to final size)',
  defaultTarget: { adapterId: 'shrink', deviceId: 'cricut-maker', materialId: 'shrink-film', thicknessMm: 0.3 },
  capabilities: { workspaceMm: { wMm: 280, hMm: 200 }, ops: ['cut-through', 'draw-line'] },
  validate(obj) {
    return obj.parts.flatMap(p => {
      const cut = scaledForShrink(Math.max(p.profile.wMm, p.profile.hMm), DEFAULT_SHRINK_RATIO);
      return cut > 280 ? [{ level: 'error' as const, message: `${p.name}: cut size ${Math.round(cut)}mm at ratio ${DEFAULT_SHRINK_RATIO} exceeds shrink film sheet — reduce final size or calibrate ratio` }] : [];
    });
  },
  plan(obj) {
    const pieces = obj.parts.map(p => { const finalMm = p.profile.diameterMm ?? Math.max(p.profile.wMm, p.profile.hMm); const cut = scaledForShrink(finalMm, DEFAULT_SHRINK_RATIO);
      return { id: p.id, name: p.name, wMm: cut, hMm: cut, joint: 'none' as const, ops: ['draw-line' as const, 'cut-through' as const] }; });
    return { name: obj.project, adapterId: 'shrink', deviceId: 'cricut-maker', pieces, sheetMm: { wMm: 280, hMm: 200 }, sheets: 1, assemblyTexts: ['Cut and colour the oversized design', 'Punch holes BEFORE baking', `Bake until flat (shrinks to ~${Math.round(DEFAULT_SHRINK_RATIO * 100)}%)`] };
  },
  emit() { throw new Phase2Error('shrink-plastic SVG'); },
  preview: (plan) => timelineFor(plan, 5), estimate: (plan) => ({ durationSec: timelineFor(plan, 5).totalSec, materialLabel: 'shrink film + bake' })
};

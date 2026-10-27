import type { DesignSpec } from './schemas';
import type { ObjectSpec, ObjectPart } from './object';
const IMPL_VARIANTS: Record<string, string[]> = { coaster: ['laser','vinyl','printer3d'], finger_box_open: ['laser','vinyl','printer3d'], ornament: ['laser','vinyl','printer3d'] };
export function designSpecToObject(spec: DesignSpec): ObjectSpec {
  const parts: ObjectPart[] = [];
  const surfaceArt: ObjectSpec['surfaceArt'] = [];
  for (const p of spec.parts) {
    const d = Number(p.params.diameterMm ?? 0);
    for (let i = 0; i < p.qty; i++) {
      parts.push({ id: `${p.name}-${i + 1}`, name: p.name, template: p.template, qtyIndex: i,
        profile: { shape: String(p.params.shape ?? 'rect'), wMm: d || Number(p.params.innerWMm ?? 0), hMm: d || Number(p.params.innerDMm ?? 0), ...(d ? { diameterMm: d } : {}) },
        thicknessMm: spec.material.thicknessMm, intent: { ...p.params },
        ...(p.template === 'finger_box_open' ? { joineryIntent: 'walls join base edges to hold the stack' } : {}) });
    }
    for (const e of p.engrave ?? []) surfaceArt.push({ artId: e.artId, partName: p.name, op: 'engrave-surface', sizeMm: e.sizeMm, anchor: e.anchor });
  }
  return { project: spec.project, materialId: spec.material.id, thicknessMm: spec.material.thicknessMm, sheetMm: spec.sheet,
    parts, surfaceArt, assumptions: spec.assumptions,
    assembly: [{ step: 1, text: 'Lay out the flat pieces' }, { step: 2, text: 'Join the walls to the base edges' }, { step: 3, text: 'Stack the coasters inside' }],
    implVariants: [...new Set(spec.parts.flatMap(p => IMPL_VARIANTS[p.template] ?? ['laser']))] };
}

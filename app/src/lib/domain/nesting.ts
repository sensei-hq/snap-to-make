export interface NestPart { id: string; wMm: number; hMm: number }
export interface Placement { id: string; xMm: number; yMm: number }
export function nestParts(parts: NestPart[], sheet: { wMm: number; hMm: number }, spacingMm = 3) {
  const sheets: { placements: Placement[] }[] = [];
  let placements: Placement[] = [], x = 0, y = 0, rowH = 0;
  const flush = () => { if (placements.length) sheets.push({ placements }); placements = []; x = 0; y = 0; rowH = 0; };
  for (const p of parts) {
    if (x + p.wMm > sheet.wMm) { x = 0; y += rowH + spacingMm; rowH = 0; }
    if (y + p.hMm > sheet.hMm) { flush(); }
    placements.push({ id: p.id, xMm: x, yMm: y });
    x += p.wMm + spacingMm; rowH = Math.max(rowH, p.hMm);
  }
  flush();
  return { sheets };
}

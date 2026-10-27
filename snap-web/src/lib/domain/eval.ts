import { scaleFromCard, diameterFromMask } from './measure';
export interface EvalSample { id: string; truthMm: number; card: { wPx: number; hPx: number }; mask: { minorPx: number; majorPx: number } }
export function evaluateSamples(samples: EvalSample[]) {
  const rows = samples.map(s => {
    const scale = scaleFromCard(s.card);
    const measuredMm = diameterFromMask(s.mask, scale.pxPerMm);
    const pctError = Math.abs(measuredMm - s.truthMm) / s.truthMm * 100;
    return { id: s.id, truthMm: s.truthMm, measuredMm, pctError, within5: pctError <= 5 };
  });
  return { samples: rows, meanAbsPctError: rows.length ? rows.reduce((a, r) => a + r.pctError, 0) / rows.length : 0, passRate: rows.length ? rows.filter(r => r.within5).length / rows.length : 0 };
}

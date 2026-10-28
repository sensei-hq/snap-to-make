import { SceneAnalysisSchema, SceneAnalysisJsonSchema, type SceneAnalysis } from '../../domain/schemas';
import { measureScene, type MeasureResult } from '../../domain/measure';
import { MetaClient } from './client';
const FIXTURE: SceneAnalysis = { objects: [{ id: 'o1', label: 'hand-drawn M logo', samPrompt: 'logo drawing', role: 'art', bbox: [0, 0, 10, 10], shapeHint: 'freeform' }, { id: 'o2', label: 'mug base', samPrompt: 'bottom rim of the mug', role: 'fit_target', bbox: [0, 0, 10, 10], shapeHint: 'round' }, { id: 'o3', label: 'credit card', samPrompt: 'credit card', role: 'reference', bbox: [0, 0, 10, 10], shapeHint: 'rectangular' }], reference: { objectId: 'o3', kind: 'id1_card' }, camera: { topDownConfidence: 0.92 }, notes: 'demo fixture' };
export async function analyseScene(env: Record<string, string | undefined>, client?: MetaClient): Promise<{ scene: SceneAnalysis; measure: MeasureResult; source: 'live' | 'fixture'; trace: { model: string; purpose: string; latencyMs: number; costUsd: number }[] }> {
  const measure = measureScene({ reference: { kind: 'id1_card', wPx: 856, hPx: 540 }, targets: [{ id: 'o2', shape: 'round', minorPx: 820, majorPx: 850 }] });
  if (env.META_API_KEY) {
    try {
      const c = client ?? new MetaClient(env.META_API_KEY);
      const r = await c.sparkJson('You are Katachi, a workshop buddy. Analyse the workshop scene described by the user: identify the art sketch, the fit target object, and the size reference.', 'A hand-drawn M logo sketch, a mug, and a credit card on a work bench, shot from above.', SceneAnalysisJsonSchema as unknown as Record<string, unknown>, 'SceneAnalysis');
      const parsed = SceneAnalysisSchema.safeParse(r.data);
      if (parsed.success) return { scene: parsed.data, measure, source: 'live', trace: [{ model: 'muse-spark-1.3', purpose: 'analyze_scene', latencyMs: r.latencyMs, costUsd: r.costUsd }] };
    } catch (e) { console.error('live scene failed, using fixture:', e instanceof Error ? e.message : String(e)); }
  }
  return { scene: FIXTURE, measure, source: 'fixture', trace: [{ model: 'muse-spark-1.3', purpose: 'analyze_scene (demo fixture — set META_API_KEY for live)', latencyMs: 900, costUsd: 0.01 }, { model: 'sam-3.1', purpose: 'mask mug base', latencyMs: 600, costUsd: 0.0075 }] };
}

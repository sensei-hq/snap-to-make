// Cost model from PRD 04 §4.5 (Standard prices, USD).
export function costFor(model: string, units: { images?: number; inputTokens?: number; outputTokens?: number; audioHours?: number }): number {
  switch (model) {
    case 'sam-3.1': return (units.images ?? 0) * 0.0025;
    case 'muse-image-1.0': return (units.images ?? 0) * 0.01;
    case 'muse-spark-1.3': return ((units.inputTokens ?? 0) * 1.25 + (units.outputTokens ?? 0) * 4.25) / 1_000_000;
    case 'muse-wonder-1.0': return ((units.inputTokens ?? 0) * 4 + (units.outputTokens ?? 0) * 20) / 1_000_000;
    case 'muse-voice-transcribe-1.0': return (units.audioHours ?? 0) * 0.18;
    default: return 0;
  }
}
export interface LedgerRow { sessionId: string; model: string; purpose: string; latencyMs: number; units: Record<string, number>; costUsd: number }
export function ledgerRow(sessionId: string, model: string, purpose: string, latencyMs: number, units: LedgerRow['units']): LedgerRow {
  return { sessionId, model, purpose, latencyMs, units, costUsd: costFor(model, units) };
}

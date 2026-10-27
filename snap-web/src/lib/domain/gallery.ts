import type { BreakdownPiece } from './convert';
// Descriptor for one gallery card; the component renders the SVG in Svelte markup (no {@html}).
export function pieceShape(piece: BreakdownPiece): { isRound: boolean; hasJointTeeth: boolean; sizeLabel: string } {
  return { isRound: /coaster|charm|ornament|round/i.test(piece.name + piece.note), hasJointTeeth: piece.note.includes('finger'), sizeLabel: `${Math.round(piece.cutMm)} mm` };
}
export function pieceFinalLabel(piece: BreakdownPiece, group: string): string {
  return group === 'shrink-plastic' ? `cut ${Math.round(piece.cutMm)} mm → final ${Math.round(piece.finalMm)} mm` : `${Math.round(piece.cutMm)} mm`;
}

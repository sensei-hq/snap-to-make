import { MetaClient } from './client';
export interface DissectPiece { name: string; kind: 'face' | 'join' | 'base' | 'layer' | 'pattern' | 'detail'; note: string }
export const ConvertProposalSchema = {
  type: 'object', additionalProperties: false, required: ['subject', 'group', 'conversionClass', 'objective', 'variations', 'pieces'],
  properties: {
    subject: { type: 'string' },
    group: { type: 'string', enum: ['laser-cut', 'cricut-paper', 'shrink-plastic'] },
    conversionClass: { type: 'string', enum: ['layered', 'composite-3d', 'pattern-shape'] },
    objective: { type: 'string' },
    variations: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'change'], properties: { title: { type: 'string' }, change: { type: 'string' } } } },
    pieces: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['name', 'kind', 'note'], properties: { name: { type: 'string' }, kind: { type: 'string', enum: ['face', 'join', 'base', 'layer', 'pattern', 'detail'] }, note: { type: 'string' } } } }
  }
} as const;
export interface ConvertInput { imageDataUrl?: string; description?: string; comment?: string; group?: string }
const FALLBACK_PIECES: Record<string, DissectPiece[]> = {
  'composite-3d': [
    { name: 'Front face', kind: 'face', note: 'Trace the front outline and pierced detail from the photo; this face carries the design' },
    { name: 'Back face', kind: 'face', note: 'Mirror-simplified back panel, same outline, plain or vented' },
    { name: 'Side faces', kind: 'face', note: 'Side panels measured from the object depth; edges get the joining treatment' },
    { name: 'Slot / finger joins', kind: 'join', note: 'Joining pieces: slots or finger joints generated from material thickness so faces lock together' },
    { name: 'Base / stand', kind: 'base', note: 'Flat base the faces slot into; add feet or a hanging tab if needed' }
  ],
  'layered': [
    { name: 'Layer 1 (back)', kind: 'layer', note: 'Full silhouette — the solid back layer everything registers against' },
    { name: 'Layer 2 (mid)', kind: 'layer', note: 'Mid shapes cut as separate pieces, glued in registration' },
    { name: 'Layer 3 (detail)', kind: 'layer', note: 'Fine detail layer; engrave instead of cut if lines get thin' },
    { name: 'Registration marks', kind: 'detail', note: 'Hidden alignment holes/marks so layers stack exactly' }
  ],
  'pattern-shape': [
    { name: 'Main pattern', kind: 'pattern', note: 'Single flat outline traced from the photo and scaled to size' },
    { name: 'Detail engrave / score', kind: 'detail', note: 'Inner lines as engrave (laser) or score/draw (Cricut)' }
  ]
};
export async function proposeConversion(env: Record<string, string | undefined>, input: ConvertInput, client?: MetaClient) {
  const group = input.group ?? 'laser-cut';
  if (env.META_API_KEY) {
    try {
      const c = client ?? new MetaClient(env.META_API_KEY);
      const text = `Starting point: ${input.description || 'the attached photo'}. User comment: ${input.comment || 'none'}. Preferred fabrication group: ${group}. Propose the objective, 3 variations honouring the comment, and dissect into named pieces: for composite-3d extract each face plus joins and base; for layered extract each layer; for pattern-shape one pattern. Each piece needs a kind and a note on how it is extracted/built.`;
      const r = await c.sparkVision('You are Katachi, a workshop buddy who converts inspiration photos into buildable cut projects. Respect the user comment as the change request.', text, input.imageDataUrl, ConvertProposalSchema as unknown as Record<string, unknown>, 'ConvertProposal');
      const pieces: DissectPiece[] = Array.isArray(r.data.pieces) && r.data.pieces.length ? r.data.pieces : (FALLBACK_PIECES[r.data.conversionClass] ?? FALLBACK_PIECES['composite-3d']);
      return { subject: r.data.subject, group: r.data.group ?? group, conversionClass: r.data.conversionClass, objective: r.data.objective, variations: r.data.variations, pieces, piecesHint: pieces.map(p => p.name), source: 'live' as const, costUsd: r.costUsd };
    } catch (e) { console.error('convert live failed, using fallback:', e instanceof Error ? e.message : String(e)); }
  }
  const subject = input.description?.slice(0, 60) || 'your project';
  const conversionClass = 'composite-3d';
  const pieces = FALLBACK_PIECES[conversionClass];
  return { subject, group, conversionClass, objective: `Build ${subject} for ${group}`, variations: [{ title: 'As shown', change: 'Faithful to the starting point' }, { title: 'Simpler joins', change: 'Fewer pieces, slot joints, faster build' }, { title: 'With your comment', change: input.comment || 'Personalised detail added' }], pieces, piecesHint: pieces.map(p => p.name), source: 'fixture' as const, costUsd: 0 };
}

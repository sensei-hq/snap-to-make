import { buildBreakdown, objectFromPieces, type FabricationGroup, type BuildBreakdown } from '../domain/convert';
import { designSpecToObject } from '../domain/geometry';
export interface Variation { title: string; change: string }
export interface ChatMessage { role: 'katachi' | 'user'; text: string }
export interface DissectPiece { name: string; kind: string; note: string }
export interface Dissection { subject: string; conversionClass: string; piecesHint: string[]; pieces: DissectPiece[]; source: string }
export class ConvertState {
  imageUrl = $state<string | undefined>(undefined);
  dissection = $state<Dissection | null>(null);
  messages = $state<ChatMessage[]>([{ role: 'katachi', text: 'Show me a photo (or describe your idea) and I will dissect it into buildable pieces.' }]);
  group = $state<FabricationGroup>('laser-cut');
  description = $state('');
  comment = $state('');
  imageName = $state('');
  objective = $state('');
  conversionClass = $state('');
  variations = $state<Variation[]>([]);
  agreed = $state<Variation | null>(null);
  breakdown = $state<BuildBreakdown | null>(null);
  selectedPiece = $state<DissectPiece | null>(null);
  selectPiece(name: string) { this.selectedPiece = this.dissection?.pieces.find(p => p.name === name) ?? null; }
  overlayBoxes = $state<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  overlaySource = $state('');
  async segmentSelected() {
    if (!this.selectedPiece || !this.imageUrl) return;
    const r = await fetch('/api/segment', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imageDataUrl: this.imageUrl, prompt: this.selectedPiece.name }) }).then(x => x.json()).catch(() => ({ boxes: [] }));
    this.overlayBoxes = r.boxes ?? []; this.overlaySource = r.source ?? '';
  }
  status = $state('idle');
  async setImage(name: string, dataUrl: string) {
    this.imageName = name; this.imageUrl = dataUrl;
    this.messages = [...this.messages, { role: 'user', text: `Uploaded ${name}` }];
    await this.propose(dataUrl);
  }
  private lastProposalKey = '';
  private proposalKey(imageDataUrl?: string): string {
    return [this.imageName, this.description, this.comment, this.group, (imageDataUrl ?? this.imageUrl ?? '').slice(0, 64)].join('|');
  }
  async propose(imageDataUrl?: string) {
    const key = this.proposalKey(imageDataUrl);
    if (!this.imageUrl && !imageDataUrl && !this.description.trim()) {
      this.messages = [...this.messages, { role: 'katachi', text: 'Drop a photo above (or use the camera), or describe what you want to achieve — then I will dissect it.' }];
      this.status = 'idle';
      return;
    }
    if (key === this.lastProposalKey && this.variations.length > 0) return; // already dissected this exact input — don't repeat Katachi
    this.lastProposalKey = key;
    this.status = 'thinking';
    if (this.comment) this.messages = [...this.messages, { role: 'user', text: this.comment }];
    const r = await fetch('/api/convert', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imageDataUrl: imageDataUrl ?? this.imageUrl, description: this.description, comment: this.comment, group: this.group }) }).then(x => x.json());
    this.objective = r.objective ?? ''; this.conversionClass = r.conversionClass ?? ''; this.variations = r.variations ?? [];
    this.dissection = { subject: r.subject ?? this.objective ?? this.description ?? 'project', conversionClass: this.conversionClass, piecesHint: r.piecesHint ?? [], pieces: r.pieces ?? [], source: r.source ?? 'fixture' };
    this.selectedPiece = this.dissection.pieces[0] ?? null;
    // Proposal turns are NOT appended to the log — chatTurns derives them from dissection state (single source).
    this.status = 'proposed';
  }
  get chatTurns(): ChatMessage[] {
    const turns: ChatMessage[] = [...this.messages];
    if (this.dissection) {
      turns.push({ role: 'katachi', text: `Here's what I see: ${this.dissection.subject} — a ${this.conversionClass} build for ${this.group}. I can dissect it into: ${this.dissection.piecesHint.join(', ') || 'flat pieces with joins'}.` });
      turns.push({ role: 'katachi', text: `Objective: ${this.objective}. Here are ${this.variations.length} variations — pick one and I'll break it into pieces and assembly steps.` });
    }
    if (this.agreed) turns.push({ role: 'katachi', text: `Agreed — ${this.agreed.title}. Here's the breakdown: every piece, what to buy, and how it comes together.` });
    return turns;
  }
  agree(v: Variation) {
    this.agreed = v;
    this.messages = [...this.messages, { role: 'user', text: `Go with: ${v.title}` }];
    const obj = this.dissection?.pieces.length ? objectFromPieces(this.objective || 'Converted project', this.dissection.pieces, this.group) : designSpecToObject({ project: this.objective || 'Converted project', material: { id: 'birch', thicknessMm: 3 }, deviceId: 'longer-ray5-10w', sheet: { wMm: 300, hMm: 300 }, parts: [{ name: 'holder', qty: 1, template: 'finger_box_open', params: { innerWMm: 97, innerDMm: 14, innerHMm: 40 } }], kerfMm: 0.1, clearanceMm: 1, assumptions: [] });
    this.breakdown = buildBreakdown(obj, this.group);
    this.status = 'agreed';
  }
}

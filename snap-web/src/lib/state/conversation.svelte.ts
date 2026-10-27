// State only: slots + transcript. Presentation renders from this; no fetching here in P1 shell.
export interface Slots { intent?: string; qty?: number; material?: string; thicknessMm?: number; deviceId?: string; art?: string }
const NUMWORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
export class ConversationState {
  listening = $state(false);
  partial = $state('');
  listenSec = $state(0);
  private timer: ReturnType<typeof setInterval> | null = null;
  startListening() {
    this.listening = true; this.listenSec = 0;
    this.partial = 'I want to make coasters for my friend Maya…';
    this.timer = setInterval(() => { this.listenSec += 1; }, 1000);
  }
  stopListening() {
    this.listening = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.partial) this.ingestTranscript(this.partial.replace(/…$/, ''));
  }
  get listenLabel() { return `release to send · 0:${String(this.listenSec).padStart(2, '0')}`; }
  slots = $state<Slots>({});
  transcript = $state('');
  captions = $state<string[]>([]);
  ingestTranscript(text: string) {
    this.transcript = text;
    const t = text.toLowerCase();
    const qtyMatch = t.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/);
    const thickMatch = t.match(/(\d+(?:\.\d+)?)\s*mm/);
    const material = ['birch','basswood','plywood','walnut','acrylic'].find(m => t.includes(m));
    const intent = ['coaster','ornament','box','holder','stand','sign'].find(m => t.includes(m));
    this.slots = { ...this.slots,
      ...(qtyMatch ? { qty: NUMWORDS[qtyMatch[1]] ?? Number(qtyMatch[1]) } : {}),
      ...(thickMatch ? { thicknessMm: Number(thickMatch[1]) } : {}),
      ...(material ? { material } : {}),
      ...(intent ? { intent: intent === 'coaster' ? 'coasters' : intent } : {}) };
  }
  say(text: string) { this.captions = [...this.captions, text]; }
}

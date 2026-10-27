// Snap capture shell state. Mock API until the camera/SAM pipeline lands:
// capture() simulates the shutter + upload, analyze() simulates scene read.
export interface CaptureHint { ok: boolean; text: string }
const mockSnapApi = {
  async capture(): Promise<{ label: string }> { await new Promise(r => setTimeout(r, 30)); return { label: 'mock scene photo · sketch + mug + card' }; },
  async analyze(): Promise<{ objects: number }> { await new Promise(r => setTimeout(r, 30)); return { objects: 3 }; }
};
export class CaptureState {
  step = $state(1);
  hints = $state<CaptureHint[]>([
    { ok: true, text: "Credit card in frame — I'll size from it" },
    { ok: false, text: 'Shoot from straight above' }
  ]);
  captured = $state(false);
  analyzed = $state(false);
  photoLabel = $state('');
  busy = $state(false);
  async capture(api = mockSnapApi) {
    this.busy = true;
    const r = await api.capture();
    this.photoLabel = r.label; this.captured = true; this.busy = false;
  }
  async analyze(api = mockSnapApi) {
    this.busy = true;
    await api.analyze();
    this.analyzed = true; this.step = 2; this.busy = false;
  }
  retake() { this.captured = false; this.analyzed = false; this.step = 1; this.photoLabel = ''; }
}

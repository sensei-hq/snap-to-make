<script lang="ts">
import { Button, Toggle } from '@rokkit/ui';
// Capture · Sketch: draw it yourself. Pen and eraser on a paper pad; the drawing becomes the captured image
// (grab() returns a PNG data URL). Ink colour comes from the theme (the pad's text-ink), never a literal.
let { onDrawn }: { onDrawn?: (hasInk: boolean) => void } = $props();
let canvas = $state<HTMLCanvasElement | null>(null);
let tool = $state<'pen' | 'eraser'>('pen');
let size = $state(4);
let drawing = false;
let inked = $state(false);
const tools = [{ label: 'Pen', value: 'pen', icon: 'i-solar:pen-linear' }, { label: 'Eraser', value: 'eraser', icon: 'i-solar:eraser-linear' }];
const sizes = [{ label: 'Fine', value: 2 }, { label: 'Medium', value: 4 }, { label: 'Bold', value: 9 }];

function fit() {
  if (!canvas) return;
  const r = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width === Math.round(r.width * dpr) && canvas.height === Math.round(r.height * dpr)) return;
  const keep = inked ? canvas.toDataURL() : null;
  canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr); paper(ctx, r.width, r.height);
  if (keep) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height); img.src = keep; }
}
function paper(ctx: CanvasRenderingContext2D, w: number, h: number) { ctx.fillStyle = getComputedStyle(canvas!).backgroundColor; ctx.fillRect(0, 0, w, h); }
$effect(() => { fit(); const ro = new ResizeObserver(fit); if (canvas) ro.observe(canvas); return () => ro.disconnect(); });
function at(e: PointerEvent) { const r = canvas!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; }
function down(e: PointerEvent) {
  if (!canvas) return;
  drawing = true; canvas.setPointerCapture(e.pointerId);
  const ctx = canvas.getContext('2d')!; const [x, y] = at(e);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = tool === 'pen' ? getComputedStyle(canvas).color : getComputedStyle(canvas).backgroundColor;
  ctx.lineWidth = tool === 'pen' ? size : size * 4;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.01, y); ctx.stroke();
}
function move(e: PointerEvent) { if (!drawing || !canvas) return; const ctx = canvas.getContext('2d')!; const [x, y] = at(e); ctx.lineTo(x, y); ctx.stroke(); }
function up() { if (!drawing) return; drawing = false; if (tool === 'pen' && !inked) { inked = true; onDrawn?.(true); } }
export function clear() { if (!canvas) return; const r = canvas.getBoundingClientRect(); paper(canvas.getContext('2d')!, r.width, r.height); inked = false; onDrawn?.(false); }
/** the drawing as a PNG data URL, or null when nothing is drawn */
export function grab(): string | null { return inked && canvas ? canvas.toDataURL('image/png') : null; }
</script>
<div class="absolute inset-0 flex flex-col">
  <canvas bind:this={canvas} aria-label="Sketch pad: draw with a finger, pen or mouse" class="flex-1 w-full touch-none cursor-crosshair bg-paper text-ink"
    onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}></canvas>
  <div class="absolute left-2.5 bottom-2.5 right-2.5 flex flex-wrap items-center gap-2 rounded-md bg-paper-soft border border-paper-edge px-2 py-1.5">
    <Toggle options={tools} value={tool} showLabels label="Tool" onchange={(v) => (tool = v as 'pen' | 'eraser')} />
    <Toggle options={sizes} value={size} showLabels label="Line" onchange={(v) => (size = Number(v))} />
    <span class="flex-1"></span>
    <Button size="sm" style="ghost" icon="i-solar:trash-bin-minimalistic-linear" label="Clear" disabled={!inked} onclick={clear} />
  </div>
  {#if !inked}<p class="pointer-events-none absolute inset-x-0 top-[40%] text-center text-ui text-ink-faint">Draw it here — rough is fine</p>{/if}
</div>

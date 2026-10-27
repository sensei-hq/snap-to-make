<script lang="ts">
import { resolve } from '$app/paths';
import DropStage from '$lib/components/DropStage.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import ChatThread from '$lib/components/ChatThread.svelte';
import PieceGallery from '$lib/components/PieceGallery.svelte';
import PieceDetail from '$lib/components/PieceDetail.svelte';
import SegmentsStrip from '$lib/components/SegmentsStrip.svelte';
import { ConvertState } from '$lib/state/convert.svelte';
const flow = new ConvertState();
let videoEl = $state<HTMLVideoElement | null>(null);
let showCamera = $state(false);
async function downscale(dataUrl: string, maxDim = 1024): Promise<string> {
  const img = new Image(); img.src = dataUrl; await img.decode().catch(() => {});
  if (Math.max(img.width, img.height) <= maxDim) return dataUrl;
  const s = maxDim / Math.max(img.width, img.height);
  const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85);
}
async function onFile(f: File) {
  const raw = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); });
  await flow.setImage(f.name, await downscale(raw));
}
async function onCamera() {
  showCamera = true;
  const stream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);
  if (stream && videoEl) videoEl.srcObject = stream;
}
function snap() {
  if (!videoEl) return;
  const canvas = document.createElement('canvas'); canvas.width = videoEl.videoWidth; canvas.height = videoEl.videoHeight;
  canvas.getContext('2d')?.drawImage(videoEl, 0, 0);
  const url = canvas.toDataURL('image/jpeg', 0.85);
  (videoEl.srcObject as MediaStream | null)?.getTracks().forEach(t => t.stop()); showCamera = false;
  void flow.setImage('camera snap', url);
}
function onWindowDragOver(e: DragEvent) { e.preventDefault(); }
function onWindowDrop(e: DragEvent) {
  e.preventDefault();
  const f = e.dataTransfer?.files?.[0];
  if (f && f.type.startsWith('image/')) void onFile(f);
}
</script>
<svelte:window ondragover={onWindowDragOver} ondrop={onWindowDrop} />
<main class="bg-paper text-ink mx-auto max-w-6xl p-4 min-h-screen">
  <header class="flex items-center gap-3 mb-4">
    <span aria-hidden="true" class="w-8 h-8 rounded-full bg-accent"></span>
    <div><h1 class="font-display text-xl">Convert — from photo to build</h1><p class="mono text-xs text-ink-mute">snap → dissect → agree → pieces</p></div>
  </header>
  <AppNav current="convert" />
  <div class="grid gap-4 lg:grid-cols-[1fr_1.15fr] items-start">
    <div class="flex flex-col gap-3">
      <DropStage imageUrl={flow.imageUrl} imageName={flow.imageName} dissection={flow.dissection} group={flow.group} {onFile} {onCamera} selectedPiece={flow.selectedPiece?.name} overlayBoxes={flow.overlayBoxes} onSelectPiece={(n) => { flow.selectPiece(n); void flow.segmentSelected(); }} />
      {#if flow.selectedPiece}<PieceDetail piece={flow.selectedPiece} />{/if}
      {#if showCamera}<video bind:this={videoEl} autoplay playsinline class="rounded-xl w-full"></video><button type="button" onclick={snap}>Take snap</button>{/if}
    </div>
    <div class="flex flex-col gap-4">
      <ChatThread messages={flow.chatTurns} />
      <label>Or describe what you want to achieve <textarea bind:value={flow.description} class="rounded-lg px-3 py-2 w-full bg-paper-soft border border-paper-edge" placeholder="A layered autumn wreath for the front door"></textarea></label>
      <label>Comments — what is it, what should change? <textarea bind:value={flow.comment} class="rounded-lg px-3 py-2 w-full bg-paper-soft border border-paper-edge" placeholder="It's a lantern — make it smaller, add a cat silhouette"></textarea></label>
      <fieldset class="flex gap-3 flex-wrap"><legend>Fabrication</legend>
        {#each [['laser-cut','Laser cutting'],['cricut-paper','Cricut paper'],['shrink-plastic','Shrink plastic']] as [id,label] (id)}
          <label><input type="radio" name="group" value={id} checked={flow.group===id} onchange={() => { flow.group = id as typeof flow.group; }} /> {label}</label>{/each}
      </fieldset>
      {#if flow.group === 'shrink-plastic'}<p>Shrink plastic is cut/drawn larger than the final piece: at the typical 0.40 shrink ratio a 40 mm charm starts at 100 mm. Calibrate with a 100 mm test tile for your film.</p>{/if}
      <button type="button" class="rounded-lg px-4 py-2 self-start bg-primary text-on-primary" onclick={() => flow.propose()} disabled={flow.status==='thinking'}>{flow.status==='thinking' ? 'Burn-E is dissecting…' : flow.variations.length ? 'Re-dissect with my comments' : 'Ask Burn-E to dissect'}</button>
      {#if flow.objective}<section aria-label="Objective" class="rounded-xl p-3 bg-paper-soft border border-paper-edge"><h2 class="font-semibold">Objective: {flow.objective}</h2><p class="text-sm text-ink-mute">Class: {flow.conversionClass} · {flow.group}</p></section>{/if}
      {#if flow.variations.length}<section aria-label="Variations"><h2 class="font-semibold mb-2">Variations — agree one to build</h2>
        <div class="grid sm:grid-cols-3 gap-2">{#each flow.variations as v (v.title)}<button type="button" class="rounded-xl p-3 text-left bg-paper-soft border border-paper-edge" onclick={() => flow.agree(v)}><strong>{v.title}</strong><br /><span class="text-sm text-ink-mute">{v.change}</span></button>{/each}</div></section>{/if}
      {#if flow.breakdown}<section aria-label="Build breakdown" class="flex flex-col gap-3">
        <h2 class="font-semibold">What you need & how it comes together</h2>
        <SegmentsStrip imageUrl={flow.imageUrl} pieces={flow.breakdown.pieces} />
        <PieceGallery pieces={flow.breakdown.pieces} group={flow.group} />
        <div class="grid sm:grid-cols-2 gap-3">
          <div class="rounded-xl p-3 bg-paper-soft border border-paper-edge"><h3 class="font-semibold">Materials</h3><ul>{#each flow.breakdown.materials as m (m)}<li>{m}</li>{/each}</ul></div>
          <div class="rounded-xl p-3 bg-paper-soft border border-paper-edge"><h3 class="font-semibold">Tools</h3><ul>{#each flow.breakdown.tools as t (t)}<li>{t}</li>{/each}</ul></div>
        </div>
        <div class="rounded-xl p-3 bg-paper-soft border border-paper-edge"><h3 class="font-semibold">Assembly</h3><ol class="list-decimal ml-5">{#each flow.breakdown.assemblySteps as s (s)}<li>{s}</li>{/each}</ol></div>
        <p><a href={resolve('/snap')}>Open in Workshop → measure, simulate & make</a></p></section>{/if}
    </div>
  </div>
</main>

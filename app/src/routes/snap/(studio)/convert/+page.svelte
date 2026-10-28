<script lang="ts">
import { resolve } from '$app/paths';
import { Button, Card } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import DropStage from '$lib/components/DropStage.svelte';
import ChatThread from '$lib/components/ChatThread.svelte';
import PieceGallery from '$lib/components/PieceGallery.svelte';
import PieceDetail from '$lib/components/PieceDetail.svelte';
import SegmentsStrip from '$lib/components/SegmentsStrip.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.convert;
app.setScreen('Convert — from photo to build', 'snap → dissect → agree → pieces');
const groups = [{ label: 'Laser cutting', value: 'laser-cut' }, { label: 'Cricut paper', value: 'cricut-paper' }, { label: 'Shrink plastic', value: 'shrink-plastic' }];
const groupOption = $derived(groups.find((g) => g.value === flow.group));
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
<svelte:head><title>Katachi · Convert</title></svelte:head>
<svelte:window ondragover={onWindowDragOver} ondrop={onWindowDrop} />
<div class="mx-auto w-full max-w-6xl p-4 flex flex-col gap-4">
  <div class="grid gap-4 lg:grid-cols-[1fr_1.15fr] items-start">
    <div class="flex flex-col gap-3">
      <DropStage imageUrl={flow.imageUrl} imageName={flow.imageName} dissection={flow.dissection} group={flow.group} {onFile} {onCamera} selectedPiece={flow.selectedPiece?.name} overlayBoxes={flow.overlayBoxes} onSelectPiece={(n) => { flow.selectPiece(n); void flow.segmentSelected(); }} />
      {#if flow.selectedPiece}<PieceDetail piece={flow.selectedPiece} />{/if}
      {#if showCamera}<video bind:this={videoEl} autoplay playsinline class="rounded-lg w-full"></video><Button variant="primary" icon="i-solar:camera-linear" label="Take snap" onclick={snap} />{/if}
    </div>
    <div class="flex flex-col gap-4">
      <ChatThread messages={flow.chatTurns} label="Guided chat" />
      <InputField name="description" type="textarea" label="Or describe what you want to achieve" placeholder="A layered autumn wreath for the front door" bind:value={flow.description} />
      <InputField name="comment" type="textarea" label="Comments — what is it, what should change?" placeholder="It's a lantern — make it smaller, add a cat silhouette" bind:value={flow.comment} />
      <InputField name="group" type="radio" label="Fabrication" options={groups} value={groupOption} onchange={(g: any) => { flow.group = g.value as typeof flow.group; }} />
      {#if flow.group === 'shrink-plastic'}<p class="text-ui text-ink-mute">Shrink plastic is cut/drawn larger than the final piece: at the typical 0.40 shrink ratio a 40 mm charm starts at 100 mm. Calibrate with a 100 mm test tile for your film.</p>{/if}
      <Button variant="primary" size="lg" class="self-start" icon="i-solar:magic-stick-linear" loading={flow.status === 'thinking'} disabled={flow.status === 'thinking'} onclick={() => flow.propose()}
        label={flow.status === 'thinking' ? 'Katachi is dissecting…' : flow.variations.length ? 'Re-dissect with my comments' : 'Ask Katachi to dissect'} />
      {#if flow.objective}<section aria-label="Objective"><Card><h2 class="font-semibold">Objective: {flow.objective}</h2><p class="text-ui text-ink-mute">Class: {flow.conversionClass} · {flow.group}</p></Card></section>{/if}
      {#if flow.variations.length}<section aria-label="Variations" class="flex flex-col gap-2"><h2 class="font-semibold">Variations — agree one to build</h2>
        <div class="grid sm:grid-cols-3 gap-2">{#each flow.variations as v (v.title)}<Card onclick={() => flow.agree(v)}><strong>{v.title}</strong><p class="text-ui text-ink-mute">{v.change}</p></Card>{/each}</div></section>{/if}
      {#if flow.breakdown}<section aria-label="Build breakdown" class="flex flex-col gap-3">
        <h2 class="panel-title">What you need & how it comes together</h2>
        <SegmentsStrip imageUrl={flow.imageUrl} pieces={flow.breakdown.pieces} />
        <PieceGallery pieces={flow.breakdown.pieces} group={flow.group} />
        <div class="grid sm:grid-cols-2 gap-3">
          <Card>{#snippet header()}<h3 class="font-semibold">Materials</h3>{/snippet}<ul class="text-ui">{#each flow.breakdown.materials as m (m)}<li>{m}</li>{/each}</ul></Card>
          <Card>{#snippet header()}<h3 class="font-semibold">Tools</h3>{/snippet}<ul class="text-ui">{#each flow.breakdown.tools as t (t)}<li>{t}</li>{/each}</ul></Card>
        </div>
        <Card>{#snippet header()}<h3 class="font-semibold">Assembly</h3>{/snippet}<ol class="list-decimal ml-5 text-ui">{#each flow.breakdown.assemblySteps as s (s)}<li>{s}</li>{/each}</ol></Card>
        <Button style="outline" target="" href={resolve('/snap')} iconRight="i-solar:arrow-right-linear" label="Open in Workshop — measure, simulate & make" /></section>{/if}
    </div>
  </div>
</div>

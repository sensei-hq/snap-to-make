<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Toggle } from '@rokkit/ui';
import CameraView from '$lib/components/capture/CameraView.svelte';
import MediaStage from '$lib/components/capture/MediaStage.svelte';
import SlotStrip from '$lib/components/capture/SlotStrip.svelte';
import { captureModes, captureSources, demoFrame } from '$lib/content/capture';
import { useApp } from '$lib/state/context';
// The first step of a project: one shot, or six sides of an object, from the camera or uploads.
const app = useApp();
const c = $derived(app.capture);
$effect(() => app.setScreen(app.project?.name || 'New project', c.mode === 'single' ? 'capture · one photo, camera or upload' : 'capture · 3D object, 6 sides'));
let camera = $state<{ grab: () => string | null } | null>(null);
let files = $state<HTMLInputElement | null>(null);
let firstName = $state<string | undefined>(undefined);

function shoot() { const side = c.current?.label ?? 'photo'; c.capture(camera?.grab() ?? demoFrame(side.toLowerCase()), 'camera'); announce(); }
async function readAll(list: FileList | null) {
  const picked = [...(list ?? [])];
  firstName ??= picked[0]?.name;
  const urls = await Promise.all(picked.map((f) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); })));
  c.upload(urls); announce();
}
function announce() {
  if (!c.done) return;
  app.flow.conversation.say(c.mode === 'single' ? 'Got the photo. Continue and I’ll find the outline and the parts.' : 'All six sides are in. I can unfold it into flat parts now.');
}
/** A small copy of the first image for the saved project (Open shows it). */
async function thumbnail(url: string, max = 640): Promise<string> {
  const img = new Image(); img.src = url;
  try { await img.decode(); } catch { return url; }
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const cv = document.createElement('canvas'); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
  cv.getContext('2d')?.drawImage(img, 0, 0, cv.width, cv.height);
  return cv.toDataURL('image/jpeg', 0.8);
}
async function useThese() {
  const urls = c.media.map((m) => m.url);
  app.startFromCapture({ fileName: firstName, images: [await thumbnail(urls[0])], mode: c.mode });
  await goto(resolve(app.resumePath as '/workshop'));
}
</script>
<svelte:head><title>Katachi · Capture</title></svelte:head>
<input bind:this={files} type="file" accept="image/*" multiple class="hidden" aria-label="Upload images" onchange={(e) => void readAll(e.currentTarget.files)} />
<!-- fits the viewport: controls · the stage (fills) · shutter / continue · the captured slots as a footer -->
<div class="mx-auto w-full max-w-[480px] md:max-w-[960px] h-[calc(100dvh-7rem)] md:h-full p-4 md:p-6 flex flex-col gap-3">
  <div class="flex flex-wrap items-center gap-2">
    <Toggle options={captureModes} value={c.mode} showLabels label="Shots" onchange={(v) => c.setMode(v as 'single' | 'multi')} />
    <Toggle options={captureSources} value={c.source} showLabels label="Source" onchange={(v) => c.setSource(v as 'camera' | 'upload')} />
    <span class="flex-1"></span>
    <Button style={c.showGrid ? 'default' : 'ghost'} variant={c.showGrid ? 'primary' : 'default'} size="sm" icon="i-solar:hashtag-square-linear" aria-label="Toggle 3×3 grid" aria-pressed={c.showGrid} onclick={() => c.toggleGrid()} />
  </div>
  <div class="flex-1 min-h-0">
    <MediaStage url={c.viewing?.url ?? ''} alt={c.viewing ? `${c.viewing.label} view` : ''} prompt={c.viewing ? `${c.viewing.label} · tap Retake to shoot again` : c.prompt} showGrid={c.showGrid}>
      {#if c.source === 'camera'}<CameraView bind:this={camera} />
      {:else if !c.done}<div class="absolute inset-0 grid place-items-center"><Button size="lg" icon="i-solar:gallery-linear" label={c.mode === 'single' ? 'Choose a photo' : 'Choose images'} onclick={() => files?.click()} /></div>{/if}
    </MediaStage>
  </div>
  <div class="shrink-0 flex items-center justify-center gap-6 min-h-16">
    {#if c.source === 'camera' && !c.done}
      <button type="button" aria-label="Take photo" class="w-16 h-16 grid place-items-center rounded-full ring-3 ring-ink" onclick={shoot}><span class="w-12 h-12 rounded-full bg-ink"></span></button>
    {/if}
    {#if c.media.length}<Button variant="primary" size="lg" disabled={!c.done} iconRight="i-solar:arrow-right-linear" label={c.mode === 'single' ? 'Continue' : 'Unfold into parts'} onclick={() => void useThese()} />{/if}
  </div>
  <footer class="shrink-0 hair-t pt-2">
    <SlotStrip slots={c.slots} selected={c.viewingId} currentId={c.current?.id ?? null} onSelect={(id) => c.view(c.slots.find((s) => s.id === id)?.url ? id : null)} onRetake={(id) => c.retake(id)} />
  </footer>
</div>

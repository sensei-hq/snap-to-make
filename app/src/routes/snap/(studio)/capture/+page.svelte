<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Toggle } from '@rokkit/ui';
import CameraView from '$lib/components/capture/CameraView.svelte';
import MediaStage from '$lib/components/capture/MediaStage.svelte';
import SlotStrip from '$lib/components/capture/SlotStrip.svelte';
import { captureModes, captureSources, demoFrame } from '$lib/content/capture';
import { useApp } from '$lib/state/context';
const app = useApp();
const c = app.capture;
$effect(() => app.setScreen('Snap', c.mode === 'single' ? 'single shot · camera or upload' : '3D object · 6 sides'));
let camera = $state<{ grab: () => string | null } | null>(null);
let files = $state<HTMLInputElement | null>(null);

function shoot() { const side = c.current?.label ?? 'photo'; c.capture(camera?.grab() ?? demoFrame(side.toLowerCase()), 'camera'); announce(); }
async function readAll(list: FileList | null) {
  const urls = await Promise.all([...(list ?? [])].map((f) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); })));
  c.upload(urls); announce();
}
function announce() {
  if (!c.done) return;
  if (c.mode === 'single') app.flow.conversation.say('Got the photo. I’ll measure what’s in it next.', [{ label: 'Measure the scene', id: 'capture.measure' }]);
  else app.flow.conversation.say('All six sides are in. I can unfold it into flat parts now.', [{ label: 'Unfold into parts', href: '/snap/layers/views' }]);
}
async function useThese() {
  if (c.mode === 'single') { await app.flow.analyse(); await goto(resolve('/snap/scene')); }
  else await goto(resolve('/snap/layers/views'));
}
</script>
<svelte:head><title>Katachi · Snap</title></svelte:head>
<div class="mx-auto w-full max-w-[430px] md:max-w-[960px] p-4 md:p-6 flex flex-col gap-3">
  <div class="flex flex-wrap items-center gap-2">
    <Toggle options={captureModes} value={c.mode} showLabels label="Shots" onchange={(v) => c.setMode(v as 'single' | 'multi')} />
    <Toggle options={captureSources} value={c.source} showLabels label="Source" onchange={(v) => c.setSource(v as 'camera' | 'upload')} />
    <span class="flex-1"></span>
    <Button style={c.showGrid ? 'default' : 'ghost'} variant={c.showGrid ? 'primary' : 'default'} size="sm" icon="i-solar:hashtag-square-linear" aria-label="Toggle 3×3 grid" aria-pressed={c.showGrid} onclick={() => c.toggleGrid()} />
  </div>
  <MediaStage url={c.viewing?.url ?? ''} alt={c.viewing ? `${c.viewing.label} view` : ''} prompt={c.viewing ? `${c.viewing.label} · tap Retake to shoot again` : c.prompt} showGrid={c.showGrid}>
    {#if c.source === 'camera'}<CameraView bind:this={camera} />
    {:else}<div class="absolute inset-0 grid place-items-center"><Button size="lg" icon="i-solar:gallery-linear" label="Choose images" onclick={() => files?.click()} /></div>{/if}
  </MediaStage>
  <input bind:this={files} type="file" accept="image/*" multiple class="sr-only" tabindex="-1" aria-label="Upload images" onchange={(e) => void readAll(e.currentTarget.files)} />
  <div class="flex items-center justify-center gap-6">
    {#if c.source === 'camera' && !c.done}
      <button type="button" aria-label="Take photo" class="w-16 h-16 grid place-items-center rounded-full ring-3 ring-ink" onclick={shoot}><span class="w-12 h-12 rounded-full bg-ink"></span></button>
    {:else if !c.done}
      <Button size="lg" icon="i-solar:gallery-linear" label={c.mode === 'single' ? 'Choose a photo' : 'Choose images'} onclick={() => files?.click()} />
    {/if}
    {#if c.media.length}<Button variant="primary" size="lg" disabled={!c.done} label={c.mode === 'single' ? 'Measure this' : 'Unfold into parts'} onclick={() => void useThese()} />{/if}
  </div>
  <SlotStrip slots={c.slots} selected={c.viewingId} currentId={c.current?.id ?? null} onSelect={(id) => c.view(c.slots.find((s) => s.id === id)?.url ? id : null)} onRetake={(id) => c.retake(id)} />
</div>

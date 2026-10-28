<script lang="ts">
import { resolve } from '$app/paths';
import { Button, StatusList } from '@rokkit/ui';
import ViewfinderFeed from './illustrations/ViewfinderFeed.svelte';
let { step = 1, hints = [], captured = false, analyzed = false, photoLabel = '', busy = false, onCapture, onAnalyze, onRetake, onClose }: {
  step?: number; hints?: { ok: boolean; text: string }[]; captured?: boolean; analyzed?: boolean; photoLabel?: string; busy?: boolean;
  onCapture?: () => void; onAnalyze?: () => void; onRetake?: () => void; onClose?: () => void;
} = $props();
const tips = $derived(hints.map((h) => ({ text: h.text, status: h.ok ? 'pass' : 'warn' })));
</script>
<!-- The camera is always dark: it pins data-mode="dark" on its own subtree. -->
<section aria-label="Snap the scene" data-mode="dark" class="flex flex-col flex-1 min-h-dvh bg-camera text-ink">
  <header class="h-14 shrink-0 flex items-center gap-2 px-2">
    <Button style="ghost" icon="i-solar:close-circle-linear" aria-label="Close camera" onclick={() => onClose?.()} />
    <h1 class="flex-1 text-center font-heading text-lede font-normal">Snap the scene</h1>
    <span class="meta w-11 text-center">{step}/4</span>
  </header>
  <div class="relative flex-1 mx-3 rounded-lg overflow-hidden min-h-107" role="img" aria-label="Camera viewfinder">
    <ViewfinderFeed showScene={!captured} />
    {#if tips.length}<StatusList items={tips} class="absolute left-4 top-4 rounded-lg bg-paper px-3 py-2" />{/if}
    {#if captured}<p class="absolute left-4 bottom-4 rounded-full bg-paper px-3 py-1.5 meta text-ink">{photoLabel}</p>{/if}
  </div>
  <div class="h-37 shrink-0 flex items-center justify-between px-8 pb-4">
    <Button style="outline" icon="i-solar:gallery-linear" aria-label="Upload a photo" />
    {#if !captured}
      <button type="button" aria-label="Take photo" class="w-19 h-19 grid place-items-center rounded-full ring-3 ring-ink" onclick={() => onCapture?.()}><span class="w-15 h-15 rounded-full bg-ink"></span></button>
    {:else if !analyzed}
      <Button size="lg" variant="primary" label={busy ? 'Analyzing…' : 'Analyze scene'} loading={busy} onclick={() => onAnalyze?.()} />
    {:else}
      <Button size="lg" variant="primary" target="" href={resolve('/snap')} label="Open in Workshop" iconRight="i-solar:arrow-right-linear" />
    {/if}
    <Button style="outline" icon="i-solar:videocamera-linear" aria-label="Record a clip" />
  </div>
  {#if captured}<Button style="ghost" size="sm" class="self-center mb-4" label="Retake" onclick={() => onRetake?.()} />{/if}
</section>

<script lang="ts">
import { resolve } from '$app/paths';
let { step = 1, hints = [], captured = false, analyzed = false, photoLabel = '', busy = false, onCapture, onAnalyze, onRetake, onClose }: {
  step?: number; hints?: { ok: boolean; text: string }[]; captured?: boolean; analyzed?: boolean; photoLabel?: string; busy?: boolean;
  onCapture?: () => void; onAnalyze?: () => void; onRetake?: () => void; onClose?: () => void;
} = $props();
</script>
<section aria-label="Snap the scene" class="flex flex-col flex-1" style="background:#0B0D10;color:#F3EDE2;min-height:100dvh">
  <header class="flex items-center px-4 py-4">
    <button type="button" aria-label="Close camera" class="text-xl px-2" onclick={() => onClose?.()}>✕</button>
    <h1 class="font-display flex-1 text-center text-lg">Snap the scene</h1>
    <span class="mono text-sm" style="color:#A39A8A">{step}/4</span>
  </header>
  <div class="relative mx-3 rounded-xl overflow-hidden flex-1" style="background:#241B12;min-height:430px" role="img" aria-label="Camera viewfinder">
    <span class="absolute left-4 top-4 w-8 h-8" style="border-left:3px solid #F3EDE2;border-top:3px solid #F3EDE2"></span>
    <span class="absolute right-4 top-4 w-8 h-8" style="border-right:3px solid #F3EDE2;border-top:3px solid #F3EDE2"></span>
    <span class="absolute left-4 bottom-4 w-8 h-8" style="border-left:3px solid #F3EDE2;border-bottom:3px solid #F3EDE2"></span>
    <span class="absolute right-4 bottom-4 w-8 h-8" style="border-right:3px solid #F3EDE2;border-bottom:3px solid #F3EDE2"></span>
    <div class="absolute left-3 top-14 flex flex-col gap-2">
      {#each hints as h (h.text)}<span class="mono text-xs px-3 py-1.5 rounded-full" style="background:rgba(11,13,16,.85)"><span style="color:{h.ok ? '#7BD88F' : '#F5B83D'}">●</span> {h.text}</span>{/each}
    </div>
    {#if captured}
      <p class="mono absolute left-3 bottom-14 text-xs px-3 py-1.5 rounded-full" style="background:rgba(11,13,16,.85)">{photoLabel}</p>
    {:else}
      <div class="absolute rounded" style="left:12%;top:26%;width:36%;height:34%;background:#F1E7D3;transform:rotate(-4deg)"><span class="font-display" style="font-size:72px;color:#3A352C;padding-left:16%">M</span></div>
      <div class="absolute rounded-full" style="right:10%;top:34%;width:96px;height:96px;background:#6B4A2F;border:7px solid #D8C6A5"></div>
      <div class="absolute rounded" style="left:32%;bottom:14%;width:30%;height:13%;background:#31597F;transform:rotate(6deg)"></div>
    {/if}
  </div>
  <div class="flex items-center justify-between px-10 py-6">
    <span class="grid place-items-center w-12 h-12 rounded-lg" style="background:#1B1F24" aria-hidden="true">🖼</span>
    {#if !captured}
      <button type="button" aria-label="Take photo" class="rounded-full" style="width:72px;height:72px;background:#E8E4DA;border:5px solid #0B0D10;outline:3px solid #E8E4DA" onclick={() => onCapture?.()}></button>
    {:else if !analyzed}
      <button type="button" class="btn-ink" style="background:#F3EDE2;color:#16140F" onclick={() => onAnalyze?.()}>{busy ? 'Analyzing…' : 'Analyze scene'}</button>
    {:else}
      <a class="btn-ink" style="background:#F3EDE2;color:#16140F" href={resolve('/snap')}>Open in Workshop →</a>
    {/if}
    <span class="grid place-items-center w-12 h-12 rounded-lg" style="background:#1B1F24" aria-hidden="true">🎥</span>
  </div>
  {#if captured}<button type="button" class="mono text-xs pb-4" style="color:#A39A8A" onclick={() => onRetake?.()}>Retake</button>{/if}
</section>

<script lang="ts">
let { timeline, positionSec, currentLabel, playing, onPlay, onPause, onSeek, onSpeed }: any = $props();
</script>
<section aria-label="Simulate" class="card rounded-xl p-4 flex flex-col gap-3" style="background:var(--paper-soft)">
<h2 class="font-semibold">Simulate (no device needed)</h2>
<div class="h-40 rounded-lg relative" style="background:var(--paper-mute)" role="img" aria-label="Virtual bed">
  <div class="absolute w-4 h-4 rounded-full" style="background:var(--accent);left:{Math.min(90, positionSec*3)}%;top:40%"></div>
  <p class="absolute bottom-2 left-3 text-sm">{currentLabel}</p>
</div>
<div class="flex gap-2 items-center">
  {#if playing}<button type="button" onclick={onPause}>Pause</button>{:else}<button type="button" onclick={onPlay}>Play</button>{/if}
  <label>Seek <input type="range" min="0" max={timeline.totalSec} step="0.1" value={positionSec} oninput={(e)=>onSeek(Number(e.currentTarget.value))} /></label>
  {#each [1,4,16] as s (s)}<button type="button" onclick={()=>onSpeed(s)}>{s}×</button>{/each}
  <span>{positionSec.toFixed(1)} / {timeline.totalSec}s</span>
</div>
</section>

<script lang="ts">
let { variants, selected, onPick, onReroll, onOriginal }: { variants: string[]; selected: number; onPick: (i: number) => void; onReroll?: () => void; onOriginal?: () => void } = $props();
</script>
<section aria-label="Art picker" class="px-5 py-4 flex flex-col gap-3">
  <div class="flex gap-3">
    <span aria-hidden="true" class="grid place-items-center w-6 h-6 rounded-full shrink-0" style="background:var(--paper-mute)"><span class="w-2 h-2 rounded-full" style="background:var(--accent)"></span></span>
    <div><p class="mono text-xs tracking-widest" style="color:var(--ink-mute)">BURN-E</p>
    <p>Cleaned up your M — three takes, all single-line and laser friendly. Which one?</p></div>
  </div>
  <div class="flex items-center gap-3">
    <span class="card grid place-items-center font-display text-2xl" style="width:64px;height:64px">M</span>
    <span class="flex-1"><strong>Your sketch</strong><br /><span class="mono text-xs" style="color:var(--ink-mute)">62 × 58 mm · pencil</span></span>
    <span class="mono text-sm" style="color:var(--ink-mute)">→ 3 takes</span>
  </div>
  <div class="flex gap-3">
    {#each variants as v, i (v)}
      <button type="button" aria-label={`Variant ${i + 1}`} class="relative flex-1 rounded-lg grid place-items-center font-display text-3xl py-6"
        style="background:#EAD9B8;color:#4A2F1B;{selected === i ? 'outline:2px solid var(--accent)' : ''}" onclick={() => onPick(i)}>
        {v}{#if selected === i}<span class="absolute -top-2 -right-2 w-5 h-5 rounded-full grid place-items-center text-xs" style="background:var(--accent);color:var(--paper)">✓</span>{/if}
      </button>
    {/each}
  </div>
  <div class="relative rounded-xl grid place-items-center" style="background:#EAD9B8;min-height:230px">
    <span class="mono absolute right-3 top-3 text-xs px-2 py-1 rounded-full" style="background:var(--paper)">Muse Image</span>
    <span class="font-display" style="font-size:110px;color:#4A2F1B">{variants[selected] ?? 'M'}</span>
    <span class="mono absolute left-3 bottom-3 text-xs px-2 py-1 rounded-full" style="background:var(--paper)">Take {selected + 1} · 60 mm on each coaster</span>
  </div>
  <div class="flex gap-3 items-center">
    <button type="button" class="btn-line" onclick={() => onReroll?.()}>Re-roll</button>
    <button type="button" class="flex-1" onclick={() => onOriginal?.()}>Use original</button>
    <button type="button" class="btn-ink flex-1">Use take {selected + 1}</button>
  </div>
</section>

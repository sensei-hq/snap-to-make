<script lang="ts">
let { listening = false, partial = '', listenLabel = '', onMicDown, onMicUp }: {
  listening?: boolean; partial?: string; listenLabel?: string;
  onMicDown?: () => void; onMicUp?: () => void;
} = $props();
const chips = ['Coasters from my sketch', 'Box that fits this', 'Ornaments for 40 names'];
</script>
<section aria-label="Workshop intro" class="flex flex-col px-5 pt-2 pb-4">
  <div class="flex gap-3">
    <span aria-hidden="true" class="mt-1 grid place-items-center w-6 h-6 rounded-full shrink-0" style="background:var(--paper-mute)"><span class="w-2 h-2 rounded-full" style="background:var(--accent)"></span></span>
    <div>
      <p class="mono text-xs tracking-widest" style="color:var(--ink-mute)">BURN-E</p>
      <p class="text-base">Hi Dev — what are we making today?</p>
    </div>
  </div>
  {#if listening || partial}
    <div class="flex gap-3 mt-4">
      <span class="mono text-xs px-2 py-1 rounded-full shrink-0 h-fit" style="background:var(--paper-soft);color:var(--ink-mute)">you</span>
      <div>
        <p class="mono text-xs tracking-widest" style="color:var(--ink-mute)">{listening ? 'LISTENING…' : 'YOU'}</p>
        <p class="text-base">{partial}</p>
      </div>
    </div>
  {/if}

  <div class="flex flex-col items-center mt-8 mb-2">
    <button type="button" aria-label="Hold to talk" data-testid="mic"
      class="relative grid place-items-center rounded-full"
      style="width:176px;height:176px;background:{listening ? 'var(--paper-mute)' : 'var(--paper-soft)'}"
      onpointerdown={() => onMicDown?.()} onpointerup={() => onMicUp?.()}>
      <span class="grid place-items-center rounded-full text-3xl" style="width:104px;height:104px;background:var(--ink);color:var(--paper)">🎙</span>
    </button>
    <p class="mono text-xs mt-3" style="color:var(--ink-mute)">{listening ? listenLabel : 'hold to talk'}</p>
  </div>

  <div class="flex flex-wrap gap-2 mt-4">
    {#each chips as c (c)}<span class="chip">{c}</span>{/each}
  </div>
</section>

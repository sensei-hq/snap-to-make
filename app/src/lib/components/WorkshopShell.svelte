<script lang="ts">
import { Button } from '@rokkit/ui';
let { listening = false, partial = '', listenLabel = '', onMicDown, onMicUp, onPick }: {
  listening?: boolean; partial?: string; listenLabel?: string;
  onMicDown?: () => void; onMicUp?: () => void; onPick?: (text: string) => void;
} = $props();
const chips = ['Coasters from my sketch', 'Box that fits this', 'Ornaments for 40 names'];
</script>
<section aria-label="Workshop intro" class="flex flex-col px-5 pt-10 pb-4 gap-8" aria-live="polite">
  <div class="flex flex-col items-center gap-4">
    <!-- Push-to-talk disc: a bespoke control (like the camera shutter), drawn from named tokens -->
    <div class="w-46 h-46 grid place-items-center rounded-full {listening ? 'bg-paper-mute' : ''}">
      <div class="w-35 h-35 grid place-items-center rounded-full {listening ? 'bg-paper-edge' : ''}">
        <button type="button" aria-label="Hold to talk" aria-pressed={listening} data-testid="mic"
          class="w-24 h-24 grid place-items-center rounded-full bg-primary text-on-primary transition-opacity hover:opacity-90"
          onpointerdown={() => onMicDown?.()} onpointerup={() => onMicUp?.()}>
          <span class="i-solar:microphone-3-linear text-head" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <p class="meta">{listening ? listenLabel : 'hold to talk'}</p>
    {#if listening && partial}<p class="text-lede text-ink-mute text-center max-w-[32ch]">{partial}</p>{/if}
  </div>
  <div class="flex flex-wrap gap-2">
    {#each chips as c (c)}<Button style="outline" size="sm" class="rounded-full" label={c} onclick={() => onPick?.(c)} />{/each}
  </div>
</section>

<script lang="ts">
import { Pill } from '@rokkit/ui';
import ChatThread from './ChatThread.svelte';
let { listening = false, partial = '', listenLabel = '', onMicDown, onMicUp }: {
  listening?: boolean; partial?: string; listenLabel?: string;
  onMicDown?: () => void; onMicUp?: () => void;
} = $props();
const chips = ['Coasters from my sketch', 'Box that fits this', 'Ornaments for 40 names'];
const lines = $derived([
  { role: 'katachi', text: 'Hi Dev — what are we making today?' },
  ...(listening || partial ? [{ role: 'user', text: partial || 'Listening…' }] : [])
]);
</script>
<section aria-label="Workshop intro" class="flex flex-col px-5 pt-6 pb-4 gap-8" aria-live="polite">
  <ChatThread messages={lines} />
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
  </div>
  <div class="flex flex-wrap gap-2">
    {#each chips as c (c)}<Pill value={c} />{/each}
  </div>
</section>

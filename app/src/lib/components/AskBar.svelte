<script lang="ts">
import { Button, ChatComposer } from '@rokkit/ui';
let { placeholder = 'Ask Katachi — cut, engrave, change…', micLabel = 'Voice input', onSubmit, onMicDown, onMicUp, onCamera }: {
  placeholder?: string; micLabel?: string;
  onSubmit?: (v: string) => void; onMicDown?: () => void; onMicUp?: () => void; onCamera?: () => void;
} = $props();
</script>
<div class="shrink-0 flex items-end gap-2.5 px-4 pt-3 pb-6 bg-paper-soft hair-t" role="group" aria-label="Ask Katachi">
  <div class="flex-1 min-w-0"><ChatComposer {placeholder} onsubmit={(t) => onSubmit?.(t)} /></div>
  {#if onCamera}<Button style="outline" icon="i-solar:camera-linear" aria-label="Open camera" onclick={() => onCamera?.()} />{/if}
  <Button variant="primary" icon="i-solar:microphone-3-linear" aria-label={micLabel} onpointerdown={() => onMicDown?.()} onpointerup={() => onMicUp?.()} />
</div>

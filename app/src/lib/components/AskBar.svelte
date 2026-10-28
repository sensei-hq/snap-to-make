<script lang="ts">
import { Button, ChatComposer } from '@rokkit/ui';
// The Katachi composer: Rokkit ChatComposer with send (and voice / camera) in its toolbar.
let { placeholder = 'Ask Katachi…', micLabel = 'Voice input', onSubmit, onMicDown, onMicUp, onCamera }: {
  placeholder?: string; micLabel?: string;
  onSubmit?: (v: string) => void; onMicDown?: () => void; onMicUp?: () => void; onCamera?: () => void;
} = $props();
let value = $state('');
const send = (text: string) => { if (!text.trim()) return; onSubmit?.(text.trim()); value = ''; };
</script>
<div class="katachi-composer shrink-0" role="group" aria-label="Ask Katachi">
  <ChatComposer bind:value {placeholder} onsubmit={send}>
    {#snippet toolbar()}
      <span class="flex items-center gap-1">
        {#if onCamera}<Button style="ghost" size="sm" icon="i-solar:camera-linear" aria-label="Open camera" onclick={() => onCamera?.()} />{/if}
        {#if onMicDown}<Button style="ghost" size="sm" icon="i-solar:microphone-3-linear" aria-label={micLabel} onpointerdown={() => onMicDown?.()} onpointerup={() => onMicUp?.()} />{/if}
        <Button variant="primary" size="sm" icon="i-solar:arrow-up-linear" aria-label="Send" disabled={!value.trim()} onclick={() => send(value)} />
      </span>
    {/snippet}
  </ChatComposer>
</div>

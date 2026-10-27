<script lang="ts">
let { placeholder = 'Ask Burn-E — cut, engrave, change…', micLabel = 'Voice input', onSubmit, onMicDown, onMicUp, onCamera }: {
  placeholder?: string; micLabel?: string;
  onSubmit?: (v: string) => void; onMicDown?: () => void; onMicUp?: () => void; onCamera?: () => void;
} = $props();
let typed = $state('');
</script>
<div class="flex items-center gap-2 px-4 py-3" style="border-top:1px solid var(--paper-edge);background:var(--paper-soft)">
  <label class="sr-only" for="ask-input">Ask Burn-E</label>
  <input id="ask-input" bind:value={typed} placeholder={placeholder} class="flex-1 rounded-lg px-3 py-2.5 text-sm"
    style="background:var(--paper);border:1px solid var(--paper-edge);color:var(--ink)"
    onkeydown={(e) => { if (e.key === 'Enter') { onSubmit?.(typed); } }} />
  {#if onCamera}<button type="button" aria-label="Open camera" class="chip" onclick={() => onCamera?.()}>📷</button>{/if}
  <button type="button" aria-label={micLabel} class="grid place-items-center w-11 h-11 rounded-full shrink-0" style="background:var(--ink);color:var(--paper)"
    onpointerdown={() => onMicDown?.()} onpointerup={() => onMicUp?.()}>🎙</button>
</div>

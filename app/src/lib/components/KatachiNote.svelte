<script lang="ts">
import BotAvatar from './BotAvatar.svelte';
// Phones (mockups/mobile): Katachi's word on the current step, inline in the work column.
let { text }: { text: string } = $props();
</script>
<div role="note" aria-label="Katachi" class="flex gap-2.5 items-start">
  <BotAvatar />
  <p class="flex-1 text-ui text-ink-mute">{text}</p>
</div>

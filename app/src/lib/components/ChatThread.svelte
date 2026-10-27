<script lang="ts">
import { ChatMessage } from '@rokkit/ui';
import BurnEMark from './BurnEMark.svelte';
let { messages }: { messages: { role: string; text: string }[] } = $props();
const asChat = (m: { role: string; text: string }, i: number) => ({ id: String(i), role: m.role === 'user' ? 'user' as const : 'assistant' as const, text: m.text });
</script>
<section aria-label="Guided chat" class="flex flex-col gap-4">
  {#each messages as m, i (i)}
    <ChatMessage message={asChat(m, i)}>
      {#snippet avatar(msg)}{#if msg.role === 'assistant'}<BurnEMark size={24} class="text-ink" />{/if}{/snippet}
      {#snippet label(msg)}<span class="lane">{msg.role === 'assistant' ? 'Burn-E' : 'You'}</span>{/snippet}
    </ChatMessage>
  {/each}
</section>

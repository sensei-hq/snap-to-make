<script lang="ts">
import type { Snippet } from 'svelte';
import { Button } from '@rokkit/ui';
import ChatThread from '../ChatThread.svelte';
import type { ChatAction } from '$lib/state/conversation.svelte';
// The assistant column (mockups/desktop): the page's context card (inspector, rule, send-to) above the Katachi
// conversation, then the step's suggestions.
let { messages, info = null, suggestions = [], onAction, onSuggest }: {
  messages: { id: string; role: 'user' | 'assistant'; text: string; data?: { actions: ChatAction[] } }[];
  info?: { title: string; body: Snippet } | null; suggestions?: string[];
  onAction: (a: ChatAction) => void; onSuggest: (text: string) => void;
} = $props();
</script>
<div class="flex-1 min-h-0 overflow-auto flex flex-col gap-4 px-4 py-4">
  {#if info}<section aria-label={info.title} class="shrink-0">{@render info.body()}</section>{/if}
  <ChatThread {messages} {onAction} />
  {#if suggestions.length}
    <div class="flex flex-wrap gap-1.5 pl-8.5" aria-label="Suggestions" role="group">
      {#each suggestions as s (s)}<Button style="outline" size="sm" class="rounded-full" label={s} onclick={() => onSuggest(s)} />{/each}
    </div>
  {/if}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';
import { Button, Tabs } from '@rokkit/ui';
import ChatThread from '../ChatThread.svelte';
import type { ChatAction } from '$lib/state/conversation.svelte';
// The assistant's two views: the Katachi conversation, and the page's Info (step controls / inspector) when it has one.
let { messages, info = null, tab = 'chat', suggestions = [], onTab, onAction, onSuggest }: {
  messages: { id: string; role: 'user' | 'assistant'; text: string; data?: { actions: ChatAction[] } }[];
  info?: { title: string; body: Snippet } | null; tab?: 'chat' | 'info'; suggestions?: string[];
  onTab: (t: 'chat' | 'info') => void; onAction: (a: ChatAction) => void; onSuggest: (text: string) => void;
} = $props();
const tabs = $derived([{ label: 'Chat', value: 'chat' }, ...(info ? [{ label: info.title, value: 'info' }] : [])]);
</script>
{#if info}<div class="shrink-0 px-3 pt-2 hair-b"><Tabs options={tabs} value={tab} onchange={(v) => onTab(v as 'chat' | 'info')} /></div>{/if}
<div class="flex-1 min-h-0 overflow-auto px-4 py-4">
  {#if info && tab === 'info'}{@render info.body()}{:else}<ChatThread {messages} {onAction} />{/if}
</div>
{#if suggestions.length && !(info && tab === 'info')}
  <div class="shrink-0 flex flex-wrap gap-1.5 px-4 pb-2" aria-label="Suggestions" role="group">
    {#each suggestions as s (s)}<Button style="outline" size="sm" class="rounded-full" label={s} onclick={() => onSuggest(s)} />{/each}
  </div>
{/if}

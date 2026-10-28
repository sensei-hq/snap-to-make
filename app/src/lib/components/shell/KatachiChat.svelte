<script lang="ts">
import type { Snippet } from 'svelte';
import { Button, ChatMessage, ChatShell } from '@rokkit/ui';
import type { ChatAction } from '$lib/state/conversation.svelte';
// The Katachi assistant on Rokkit ChatShell: default ChatMessage rendering and theme styling; the step's
// suggestions and send / voice sit in the composer's own slots. A page's context card sits above the chat.
type Msg = { id: string; role: 'user' | 'assistant'; text: string; data?: { actions: ChatAction[] } };
let { messages, info = null, suggestions: suggestionList = [], onAsk, onAction, onMicDown, onMicUp }: {
  messages: Msg[]; info?: { title: string; body: Snippet } | null; suggestions?: string[];
  onAsk: (text: string) => void; onAction: (a: ChatAction) => void; onMicDown?: () => void; onMicUp?: () => void;
} = $props();
let value = $state('');
const send = (text: string) => { const t = text.trim(); if (!t) return; onAsk(t); value = ''; };
</script>
{#if info}<section aria-label={info.title} class="shrink-0 max-h-[60%] overflow-auto px-4 py-3 hair-b">{@render info.body()}</section>{/if}
<div role="log" aria-label="Katachi conversation" class="flex-1 min-h-0 flex flex-col [&>[data-chat-shell]]:flex-1">
  <ChatShell messages={messages as never} bind:value placeholder="Ask Katachi…" onsubmit={send}>
    {#snippet message(m)}
      <ChatMessage message={m} />
      {#if (m.data as Msg['data'])?.actions?.length}
        <div class="flex flex-wrap gap-1.5 -mt-3">
          {#each (m.data as Msg['data'])!.actions as a (a.label)}
            {#if a.href}<Button target="" href={a.href} size="sm" style="outline" label={a.label} />
            {:else}<Button size="sm" style="outline" label={a.label} onclick={() => onAction(a)} />{/if}
          {/each}
        </div>
      {/if}
    {/snippet}
    {#snippet suggestions()}
      {#if suggestionList.length}
        <div role="group" aria-label="Suggestions" class="flex flex-wrap gap-1.5">
          {#each suggestionList as s (s)}<Button size="sm" style="outline" label={s} onclick={() => send(s)} />{/each}
        </div>
      {/if}
    {/snippet}
    {#snippet toolbar()}
      <span class="flex justify-end gap-1">
        {#if onMicDown}<Button style="ghost" size="sm" icon="i-solar:microphone-3-linear" aria-label="Voice input" onpointerdown={() => onMicDown?.()} onpointerup={() => onMicUp?.()} />{/if}
        <Button variant="primary" size="sm" icon="i-solar:arrow-up-linear" aria-label="Send" disabled={!value.trim()} onclick={() => send(value)} />
      </span>
    {/snippet}
  </ChatShell>
</div>

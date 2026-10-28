<script lang="ts">
import type { Snippet } from 'svelte';
import { Button, ChatMessage, ChatShell } from '@rokkit/ui';
import type { ChatAction, ModelCall } from '$lib/state/conversation.svelte';
// The Katachi assistant on Rokkit ChatShell: default ChatMessage rendering and theme styling; the step's
// suggestions and send / voice sit in the composer's own slots. A page's context card sits above the chat.
type Msg = { id: string; role: 'user' | 'assistant'; text: string; data?: { actions?: ChatAction[]; call?: ModelCall } };
const usd = (n: number) => (n === 0 ? '$0' : n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(3)}`);
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
      {@const call = (m.data as Msg['data'])?.call}
      {#if call}
        <!-- a model call: which model, what it did, cost and time; placeholders show the typical cost as an estimate -->
        <div data-model-call class="flex items-start gap-2 rounded-md border border-paper-edge bg-paper px-2.5 py-1.5 text-ui">
          <span class="{call.status === 'failed' ? 'i-solar:danger-triangle-linear text-danger' : 'i-solar:cpu-bolt-linear text-accent'} mt-0.5 shrink-0" aria-hidden="true"></span>
          <span class="flex-1 min-w-0"><span class="meta text-ink">{call.model}</span><span class="block text-ink-mute">{call.action}</span></span>
          <span class="meta text-right whitespace-nowrap">{call.status === 'placeholder' ? 'est. ' : ''}{usd(call.costUsd)}<span class="block">{call.ms} ms{call.status === 'placeholder' ? ' · placeholder' : ''}</span></span>
        </div>
      {:else}
      <ChatMessage message={m} />
      {/if}
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

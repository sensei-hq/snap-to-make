<script lang="ts">
import { Button, ChatMessage, ChatTimeline } from '@rokkit/ui';
import BotAvatar from './BotAvatar.svelte';
import type { ChatAction } from '$lib/state/conversation.svelte';
// The Katachi conversation on Rokkit chat components. Assistant messages may carry actions (links or ids).
type Msg = { id: string; role: 'user' | 'assistant' | 'system'; text?: string; data?: { actions?: ChatAction[] } };
let { messages, label = 'Katachi conversation', onAction }: { messages: (Msg | { id?: string; role: string; text: string })[]; label?: string; onAction?: (a: ChatAction) => void } = $props();
// Any non-user role (katachi, burn-e, bot) is the assistant.
const normalised = $derived(messages.map((m, i): Msg => ({ ...(m as Msg), id: m.id ?? `c${i}`, role: m.role === 'user' ? 'user' : 'assistant' })));
</script>
<section aria-label={label} class="flex flex-col">
  <ChatTimeline messages={normalised as never} autoscroll>
    {#snippet message(m)}
      <ChatMessage message={m}>
        {#snippet avatar(msg)}{#if msg.role === 'assistant'}<BotAvatar />{/if}{/snippet}
        {#snippet label(msg)}<span class="lane">{msg.role === 'assistant' ? 'Katachi' : 'You'}</span>{/snippet}
        {#snippet body(msg)}
          <p class="text-body">{msg.text}</p>
          {#if (msg.data as Msg['data'])?.actions?.length}
            <div class="flex flex-wrap gap-1.5 mt-2">
              {#each (msg.data as Msg['data'])!.actions! as a (a.label)}
                {#if a.href}<Button target="" href={a.href} size="sm" style="outline" label={a.label} />
                {:else}<Button size="sm" style="outline" label={a.label} onclick={() => onAction?.(a)} />{/if}
              {/each}
            </div>
          {/if}
        {/snippet}
      </ChatMessage>
    {/snippet}
  </ChatTimeline>
</section>

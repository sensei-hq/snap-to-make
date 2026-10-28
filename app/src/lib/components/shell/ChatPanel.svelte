<script lang="ts">
import { Button } from '@rokkit/ui';
import BotAvatar from '../BotAvatar.svelte';
import type { ChatAction } from '$lib/state/conversation.svelte';
import ChatThread from '../ChatThread.svelte';
import AskBar from '../AskBar.svelte';
// Studio (≥ md) right panel: the Katachi conversation and its composer.
let { messages, onAsk, onMicDown, onMicUp, onClose, onAction }: {
  messages: { id: string; role: 'user' | 'assistant'; text: string; data?: { actions: ChatAction[] } }[]; onAction?: (a: ChatAction) => void;
  onAsk: (text: string) => void; onMicDown: () => void; onMicUp: () => void; onClose: () => void;
} = $props();
</script>
<aside aria-label="Katachi chat" class="w-84 shrink-0 flex flex-col min-h-0 bg-paper-soft border-l border-paper-edge">
  <header class="h-14 shrink-0 flex items-center gap-2.5 px-4 hair-b">
    <BotAvatar />
    <div class="flex-1"><p class="font-heading text-lede leading-tight">Katachi</p><p class="meta">Muse models · Meta Model API</p></div>
    <Button style="ghost" size="sm" icon="i-solar:close-circle-linear" aria-label="Close chat" onclick={onClose} />
  </header>
  <div class="flex-1 min-h-0 overflow-auto px-4 py-4"><ChatThread {messages} {onAction} /></div>
  <AskBar onSubmit={onAsk} {onMicDown} {onMicUp} />
</aside>

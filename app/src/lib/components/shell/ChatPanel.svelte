<script lang="ts">
import { Button } from '@rokkit/ui';
import type { Snippet } from 'svelte';
import type { ChatAction } from '$lib/state/conversation.svelte';
import KatachiChat from './KatachiChat.svelte';
// Studio (≥ md) right column: "Katachi · Muse on", then the assistant (page context above the chat).
let { messages, info = null, suggestions = [], onAsk, onMicDown, onMicUp, onClose, onAction }: {
  messages: { id: string; role: 'user' | 'assistant'; text: string; data?: { actions: ChatAction[] } }[]; onAction: (a: ChatAction) => void;
  info?: { title: string; body: Snippet } | null; suggestions?: string[];
  onAsk: (text: string) => void; onMicDown: () => void; onMicUp: () => void; onClose: () => void;
} = $props();
</script>
<aside aria-label="Katachi chat" class="w-[340px] shrink-0 flex flex-col min-h-0 bg-paper border-l border-paper-edge">
  <header class="h-11 shrink-0 flex items-center gap-2 pl-4 pr-2 hair-b">
    <span class="eyebrow flex-1">Katachi</span>
    <span class="meta">Muse · on</span>
    <Button style="ghost" size="sm" icon="i-solar:close-circle-linear" aria-label="Close chat" onclick={onClose} />
  </header>
  <KatachiChat {messages} {info} {suggestions} {onAsk} {onAction} {onMicDown} {onMicUp} />
</aside>

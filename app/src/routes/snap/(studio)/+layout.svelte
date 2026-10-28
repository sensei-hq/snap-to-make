<script lang="ts">
import { page } from '$app/state';
import { sections, sectionFor, tools } from '$lib/content/sections';
import { useApp } from '$lib/state/context';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import AskBar from '$lib/components/AskBar.svelte';
import NavRail from '$lib/components/shell/NavRail.svelte';
import ChatPanel from '$lib/components/shell/ChatPanel.svelte';
import AssistantBody from '$lib/components/shell/AssistantBody.svelte';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button } from '@rokkit/ui';
import type { ChatAction } from '$lib/state/conversation.svelte';
let { children } = $props();
const app = useApp();
const current = $derived(tools.find((t) => page.url.pathname === t.href)?.id ?? sectionFor(page.url.pathname));
const ask = (text: string) => void app.ask(text);
const act = (a: ChatAction) => {
  if (a.href) return void goto(resolve(a.href as '/snap'));
  if (a.id === 'capture.measure') void app.flow.analyse().then(() => goto(resolve('/snap/scene')));
};
</script>
<!-- Phone (< md): header, tabs, page, docked composer. Studio (≥ md, incl. tablet landscape): rail, header + page, chat panel. -->
<div class="min-h-dvh flex bg-paper text-ink font-sans text-body md:h-dvh md:overflow-hidden">
  <div class="lt-md:hidden flex"><NavRail {sections} {tools} {current} chatOpen={app.chatOpen} onToggleChat={() => app.toggleChat()} /></div>
  <div class="flex-1 min-w-0 flex flex-col md:min-h-0">
    <div class="lt-md:sticky lt-md:top-0 z-10"><ScreenHeader title={app.screen.title} subtitle={app.screen.subtitle} pill={app.costPill} onOpenChat={() => app.toggleSheet()} /></div>
    <div class="md:hidden"><AppNav {sections} current={current as never} /></div>
    <main class="flex-1 md:min-h-0 md:overflow-auto">{@render children()}</main>
    <div class="md:hidden sticky bottom-0"><AskBar onSubmit={ask} onMicDown={() => app.flow.startListen()} onMicUp={() => app.flow.stopListen()} onCamera={() => { location.href = '/snap/capture'; }} /></div>
  </div>
  {#if app.chatOpen}
    <div class="lt-md:hidden flex"><ChatPanel messages={app.messages} info={app.info} tab={app.panelTab} suggestions={app.suggestions} onTab={(t) => app.setPanelTab(t)} onAction={act} onAsk={ask} onMicDown={() => app.flow.startListen()} onMicUp={() => app.flow.stopListen()} onClose={() => app.toggleChat()} /></div>
  {/if}
</div>
{#if app.sheetOpen}
  <!-- Phones: the assistant as a sheet over the work area -->
  <div role="dialog" aria-modal="true" aria-label="Katachi chat" class="md:hidden fixed inset-x-0 bottom-0 top-14 z-20 flex flex-col bg-paper-soft border-t border-paper-edge rounded-t-lg shadow-lg">
    <header class="h-12 shrink-0 flex items-center justify-between px-4 hair-b"><span class="lane">Katachi</span><Button style="ghost" size="sm" icon="i-solar:close-circle-linear" aria-label="Close chat" onclick={() => app.toggleSheet()} /></header>
    <AssistantBody messages={app.messages} info={app.info} tab={app.panelTab} suggestions={app.suggestions} onTab={(t) => app.setPanelTab(t)}
      onAction={(a) => { app.toggleSheet(); act(a); }} onSuggest={(t) => { ask(t); }} />
  </div>
{/if}

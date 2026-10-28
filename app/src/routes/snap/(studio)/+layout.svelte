<script lang="ts">
import { page } from '$app/state';
import { sections, sectionFor, tools } from '$lib/content/sections';
import { useApp } from '$lib/state/context';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import AskBar from '$lib/components/AskBar.svelte';
import NavRail from '$lib/components/shell/NavRail.svelte';
import ChatPanel from '$lib/components/shell/ChatPanel.svelte';
let { children } = $props();
const app = useApp();
const current = $derived(tools.find((t) => page.url.pathname === t.href)?.id ?? sectionFor(page.url.pathname));
const ask = (text: string) => void app.ask(text);
</script>
<!-- Phone (< md): header, tabs, page, docked composer. Studio (≥ md, incl. tablet landscape): rail, header + page, chat panel. -->
<div class="min-h-dvh flex bg-paper text-ink font-sans text-body md:h-dvh md:overflow-hidden">
  <div class="lt-md:hidden flex"><NavRail {sections} {tools} {current} chatOpen={app.chatOpen} onToggleChat={() => app.toggleChat()} /></div>
  <div class="flex-1 min-w-0 flex flex-col md:min-h-0">
    <div class="lt-md:sticky lt-md:top-0 z-10"><ScreenHeader title={app.screen.title} subtitle={app.screen.subtitle} pill={app.costPill} /></div>
    <div class="md:hidden"><AppNav {sections} current={current as never} /></div>
    <main class="flex-1 md:min-h-0 md:overflow-auto">{@render children()}</main>
    <div class="md:hidden sticky bottom-0"><AskBar onSubmit={ask} onMicDown={() => app.flow.startListen()} onMicUp={() => app.flow.stopListen()} onCamera={() => { location.href = '/snap/capture'; }} /></div>
  </div>
  {#if app.chatOpen}
    <div class="lt-md:hidden flex"><ChatPanel messages={app.messages} onAsk={ask} onMicDown={() => app.flow.startListen()} onMicUp={() => app.flow.stopListen()} onClose={() => app.toggleChat()} /></div>
  {/if}
</div>

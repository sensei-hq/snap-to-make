<script lang="ts">
import { page } from '$app/state';
import { sections, sectionFor, tools } from '$lib/content/sections';
import { desktopStepFor, desktopSteps, phoneStep } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import StepTabs from '$lib/components/StepTabs.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import NavRail from '$lib/components/shell/NavRail.svelte';
import ChatPanel from '$lib/components/shell/ChatPanel.svelte';
import KatachiChat from '$lib/components/shell/KatachiChat.svelte';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button } from '@rokkit/ui';
import type { ChatAction } from '$lib/state/conversation.svelte';
import { untrack } from 'svelte';
let { children } = $props();
const app = useApp();
const path = $derived(page.url.pathname);
const current = $derived(tools.find((t) => path === t.href)?.id ?? sectionFor(path));
const step = $derived(desktopStepFor(path));
// Phone back chevron: the previous step; the branch screens (six views, reference) go back to the source.
const back = $derived(phoneStep(path)?.back ?? (/^\/make\/(views|reference)$/.test(path) ? '/make/import' : null));
const ask = (text: string) => void app.ask(text);
const act = (a: ChatAction) => {
  if (a.href) return void goto(resolve(a.href as '/workshop'));
  if (a.id === 'capture.measure') void app.flow.analyse().then(() => goto(resolve('/scene')));
  if (a.id?.startsWith('variation:')) app.chooseVariation(Number(a.id.split(':')[1]));
};
// Autosave: any change to the project or its flow choices is written to the saved project.
$effect(() => { void app.layers.snapshot(); if (app.project) void $state.snapshot(app.project); untrack(() => app.save()); });
const listen = { onMicDown: () => app.flow.startListen(), onMicUp: () => app.flow.stopListen() };
</script>
<!-- Studio (≥ md, incl. tablet landscape): icon rail · top bar + page · Katachi column (mockups/desktop).
     Phone (< md): top bar, page, icon nav docked at the bottom; Katachi opens as a sheet (mockups/mobile). -->
<div data-studio-frame class="min-h-dvh flex bg-paper text-ink font-sans text-body md:h-dvh md:overflow-hidden">
  <div class="lt-md:hidden flex"><NavRail {sections} {tools} {current} chatOpen={app.chatOpen} onToggleChat={() => app.toggleChat()} /></div>
  <div class="flex-1 min-w-0 flex flex-col md:min-h-0">
    <div class="lt-md:sticky lt-md:top-0 z-10">
      <ScreenHeader title={app.screen.title} subtitle={app.screen.subtitle} pill={app.costPill} {back}>
        {#snippet center()}{#if step}<StepTabs steps={desktopSteps} current={step} open={(id) => app.canVisit(id)} />{/if}{/snippet}
      </ScreenHeader>
    </div>
    <main class="flex-1 md:min-h-0 md:overflow-auto">{@render children()}</main>
    <div class="md:hidden sticky bottom-0 z-10"><AppNav {sections} current={current as never} chatOpen={app.sheetOpen} onOpenChat={() => app.toggleSheet()} /></div>
  </div>
  {#if app.chatOpen}
    <div class="lt-md:hidden flex"><ChatPanel messages={app.messages} info={app.info} suggestions={app.suggestions} onAction={act} onAsk={ask} {...listen} onClose={() => app.toggleChat()} /></div>
  {/if}
</div>
{#if app.sheetOpen}
  <!-- Phones: the assistant as a sheet over the work area, with the composer -->
  <div role="dialog" aria-modal="true" aria-label="Katachi chat" class="md:hidden fixed inset-x-0 bottom-0 top-14 z-20 flex flex-col bg-paper-soft border-t border-paper-edge rounded-t-lg shadow-lg">
    <header class="h-12 shrink-0 flex items-center gap-2 pl-4 pr-2 hair-b"><span class="eyebrow flex-1">Katachi</span><span class="meta">Muse · on</span><Button style="ghost" size="sm" icon="i-solar:close-circle-linear" aria-label="Close chat" onclick={() => app.toggleSheet()} /></header>
    <div class="flex-1 min-h-0 flex flex-col pb-[env(safe-area-inset-bottom)]">
      <KatachiChat messages={app.messages} suggestions={app.suggestions} onAsk={ask} onAction={(a) => { app.toggleSheet(); act(a); }} {...listen} />
    </div>
  </div>
{/if}

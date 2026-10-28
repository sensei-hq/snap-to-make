<script lang="ts">
import { page } from '$app/state';
import { sections, sectionFor, tools } from '$lib/content/sections';
import { journey, journeyPath, journeyStepFor } from '$lib/content/journey';
import { useApp } from '$lib/state/context';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import StepTabs from '$lib/components/StepTabs.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import NavRail from '$lib/components/shell/NavRail.svelte';
import AgentActivity from '$lib/components/AgentActivity.svelte';
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
// The craft journey's five steps: studio tabs in the top bar (phones get the strip in the page).
const step = $derived(journeyStepFor(path));
const kind = $derived(app.layers.kind);
const tabs = $derived(journey.map((j) => ({ id: j.id, label: j.label, path: journeyPath(j, kind) })));
const reachable = (id: string) => {
  const j = journey.find((x) => x.id === id);
  if (!j) return false;
  if (j.id === 'capture') return true;
  const route = journeyPath(j, kind).replace('/make/', '');
  return app.canVisit(route as never);
};
// Phone back chevron: the previous route in the journey (Capture goes back Home).
const routes = $derived(journey.flatMap((j) => j.routes.filter((r) => r !== (kind === '3d' ? '/make/layers' : '/make/views') && r !== '/make/reference' && !(kind === '3d' && r === '/make/gaps'))));
const back = $derived(step ? (path === '/make/reference' ? '/capture' : routes[routes.indexOf(path) - 1] ?? '/workshop') : null);
// Nav: "Current craft" resumes the open craft where it was left.
const nav = $derived(sections.map((s) => (s.id === 'craft' && app.project && app.project.reached >= 0 ? { ...s, href: app.resumePath } : s)));
const ask = (text: string) => void app.ask(text, path).then((to) => { if (to) void goto(resolve(to as '/workshop')); });
const act = (a: ChatAction) => {
  if (a.href) return void goto(resolve(a.href as '/workshop'));
  if (a.id?.startsWith('variation:')) app.chooseVariation(Number(a.id.split(':')[1]));
};
// Autosave: any change to the project or its flow choices is written to the saved project.
$effect(() => { void app.layers.snapshot(); if (app.project) void $state.snapshot(app.project); untrack(() => app.save()); });
const listen = { onMicDown: () => app.flow.startListen(), onMicUp: () => app.flow.stopListen() };
</script>
<!-- Studio (≥ md, incl. tablet landscape): icon rail · top bar + page · Katachi column (mockups/desktop).
     Phone (< md): top bar, page, icon nav docked at the bottom; Katachi opens as a sheet (mockups/mobile). -->
<div data-studio-frame class="min-h-dvh flex bg-paper text-ink font-sans text-body md:h-dvh md:overflow-hidden">
  <div class="lt-md:hidden flex"><NavRail sections={nav} {tools} {current} chatOpen={app.chatOpen} onToggleChat={() => app.toggleChat()} /></div>
  <div class="flex-1 min-w-0 flex flex-col md:min-h-0">
    <div class="lt-md:sticky lt-md:top-0 z-10">
      <ScreenHeader title={app.screen.title} subtitle={app.screen.subtitle} pill={app.costPill} {back}>
        {#snippet center()}{#if step}<StepTabs steps={tabs} current={step.id} open={reachable} />{/if}{/snippet}
      </ScreenHeader>
    </div>
    {#if step}<AgentActivity items={app.activity(step.id)} />{/if}
    <main class="flex-1 md:min-h-0 md:overflow-auto">{@render children()}</main>
    <div class="md:hidden sticky bottom-0 z-10"><AppNav sections={nav.filter((s) => s.phone !== false)} current={current as never} chatOpen={app.sheetOpen} onOpenChat={() => app.toggleSheet()} /></div>
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

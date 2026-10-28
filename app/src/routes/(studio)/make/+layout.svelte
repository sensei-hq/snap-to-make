<script lang="ts">
import { page } from '$app/state';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { onDestroy, untrack } from 'svelte';
import LayerSteps from '$lib/components/LayerSteps.svelte';
import { phoneStep, steps, type StepId } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
let { children } = $props();
const app = useApp();
const route = $derived(page.url.pathname.match(/^\/make\/([a-z]+)$/)?.[1] as StepId | 'views' | 'reference' | undefined);
const current = $derived(steps.find((s) => s.id === route)?.id ?? '');
const strip = $derived(phoneStep(page.url.pathname));
// The flow belongs to a project: no project → the start; a step not reached yet → where you left off.
const allowed = $derived(Boolean(route && app.canVisit(route)));
$effect(() => {
  const r = route;
  if (!allowed) { untrack(() => void goto(resolve(app.resumePath as '/workshop'), { replaceState: true })); return; }
  untrack(() => app.visit(r!));
});
// Katachi introduces each step in the chat (once), with Previous / Next.
$effect(() => { if (allowed && current) app.guideStep(current as StepId); });
onDestroy(() => { app.currentStep = null; });
</script>
<!-- the studio shows the step tabs in the top bar; phones get the step strip -->
{#if allowed}
  {#if strip}<div class="md:hidden"><LayerSteps step={strip} /></div>{/if}
  {@render children()}
{/if}

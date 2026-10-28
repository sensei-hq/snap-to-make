<script lang="ts">
import { page } from '$app/state';
import { onDestroy } from 'svelte';
import LayerSteps from '$lib/components/LayerSteps.svelte';
import { phoneStep, steps, type StepId } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
let { children } = $props();
const app = useApp();
const current = $derived(steps.find((s) => page.url.pathname === s.path)?.id ?? '');
const strip = $derived(phoneStep(page.url.pathname));
// Katachi introduces each step in the chat (once), with Previous / Next.
$effect(() => { if (current) app.guideStep(current as StepId); });
onDestroy(() => { app.currentStep = null; });
</script>
<!-- the studio shows the step tabs in the top bar; phones get the seven-step strip -->
{#if strip}<div class="md:hidden"><LayerSteps step={strip} /></div>{/if}
{@render children()}

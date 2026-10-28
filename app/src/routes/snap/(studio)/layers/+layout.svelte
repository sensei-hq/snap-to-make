<script lang="ts">
import { page } from '$app/state';
import { onDestroy } from 'svelte';
import LayerSteps from '$lib/components/LayerSteps.svelte';
import { steps, type StepId } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
let { children } = $props();
const app = useApp();
const current = $derived(steps.find((s) => page.url.pathname === s.path)?.id ?? '');
// Katachi introduces each step in the chat (once), with Previous / Next.
$effect(() => { if (current) app.guideStep(current as StepId); });
onDestroy(() => { app.currentStep = null; });
</script>
<LayerSteps {steps} {current} />
{@render children()}

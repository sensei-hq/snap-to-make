<script lang="ts">
import { page } from '$app/state';
import LayerSteps from '$lib/components/LayerSteps.svelte';
import { steps } from '$lib/content/layers';
let { children } = $props();
const current = $derived(steps.find((s) => page.url.pathname === s.path)?.id ?? '');
</script>
<LayerSteps {steps} {current} />
{@render children()}

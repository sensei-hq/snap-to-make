<script lang="ts">
import { Card, StatusList } from '@rokkit/ui';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
const layers = app.layers;
app.setScreen('Annotations', 'assumptions, checks and flags on this project');
const notes = $derived([
  ...flow.coasterSet.assumptions.map((text) => ({ text, status: 'info' })),
  ...flow.coasterSet.preflight.map((c) => ({ text: c.label, status: c.ok ? 'pass' : 'warn' })),
  ...layers.layers.filter((l) => l.flag).map((l) => ({ text: `${l.name}: ${l.flag}`, status: 'warn' }))
]);
</script>
<svelte:head><title>Katachi · Annotations</title></svelte:head>
<div class="stage gap-4 p-4">
  <section aria-label="Annotations"><Card><StatusList items={notes} /></Card></section>
</div>

<script lang="ts">
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import { Button } from '@rokkit/ui';
import PlanCard from '$lib/components/PlanCard.svelte';
import ImplPicker from '$lib/components/ImplPicker.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
$effect(() => app.setScreen('Coasters for Maya', `build plan · ${flow.coasterSet.partCount} parts`));
onMount(() => { if (!flow.design.impl) void flow.plan(); });
async function next() { void flow.loadArt(); await goto(resolve('/art')); }
</script>
<svelte:head><title>Katachi · Plan</title></svelte:head>
<div class="stage">
  {#if flow.design.impl}<PlanCard impl={flow.design.impl} objectName={flow.design.object?.project ?? 'Design'} assumptions={flow.coasterSet.assumptions} sheetUsePct={flow.coasterSet.sheetUsePct} />{/if}
  <ImplPicker value={flow.adapterId} onSelect={(id) => flow.selectAdapter(id)} />
  <div class="flex gap-2.5 px-5 py-4">
    <Button style="outline" size="lg" class="flex-1" label="Change something" href={resolve('/scene')} target="" />
    <Button variant="primary" size="lg" class="flex-1" label="Looks good" onclick={() => void next()} />
  </div>
</div>

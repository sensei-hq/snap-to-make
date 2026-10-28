<script lang="ts">
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import SceneCard from '$lib/components/SceneCard.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
app.setScreen('Coasters for Maya', 'scene · measured');
async function confirm() { await flow.plan(); await goto(resolve('/plan')); }
</script>
<svelte:head><title>Katachi · Scene</title></svelte:head>
<div class="stage">
  <SceneCard objects={flow.scene?.scene?.objects ?? []} measurements={flow.measurements} editing={flow.editing}
    onEdit={(id) => flow.startEdit(id)} onSet={(id, v) => flow.setMeasurement(id, v)} onConfirm={() => void confirm()} />
</div>

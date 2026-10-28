<script lang="ts">
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import ArtPicker from '$lib/components/ArtPicker.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
app.setScreen('Coasters for Maya', 'art · pick a take');
onMount(() => { if (!flow.artVariants.length) void flow.loadArt(); });
async function use() { void flow.loadPreview(); await goto(resolve('/snap/preview')); }
</script>
<svelte:head><title>Katachi · Art</title></svelte:head>
<div class="stage">
  <ArtPicker variants={flow.artVariants.length ? flow.artVariants : ['M', 'M', 'M']} selected={flow.artSelected} rerolls={flow.artRerolls} usesOriginal={flow.artUsesOriginal}
    onPick={(i) => flow.pickArt(i)} onReroll={() => { flow.reroll(); void flow.loadArt(); }} onOriginal={() => flow.useOriginalArt()} onUse={() => void use()} />
</div>

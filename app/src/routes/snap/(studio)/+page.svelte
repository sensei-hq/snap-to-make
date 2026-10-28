<script lang="ts">
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import { Button, Card } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import WorkshopShell from '$lib/components/WorkshopShell.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const flow = app.flow;
let typed = $state('');
let photoInput = $state<HTMLInputElement | null>(null);
async function measure() { if (typed) flow.conversation.ingestTranscript(typed); await flow.analyse(); await goto(resolve('/snap/scene')); }
function onWindowDrop(e: DragEvent) { e.preventDefault(); if (e.dataTransfer?.files?.length) void measure(); }
$effect(() => app.setScreen('Workshop', flow.measureLabel ? 'scene · measured' : 'new project'));
</script>
<svelte:head><title>Katachi · Workshop</title></svelte:head>
<svelte:window ondragover={(e) => e.preventDefault()} ondrop={onWindowDrop} />
<div class="stage">
  <WorkshopShell listening={flow.conversation.listening} partial={flow.conversation.partial} listenLabel={flow.conversation.listenLabel}
    onMicDown={() => flow.startListen()} onMicUp={() => flow.stopListen()} />
  <div class="px-5 flex flex-col gap-2.5">
    <InputField name="typed" type="text" label="What are we making" placeholder="make four coasters 3 mm birch" bind:value={typed}
      onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') void measure(); }} />
    <div class="flex gap-2.5">
      <Button style="outline" class="flex-1" icon="i-solar:ruler-linear" label="Snap & measure" onclick={() => void measure()} />
      <Button style="outline" class="flex-1" icon="i-solar:camera-linear" label="Snap a photo" onclick={() => photoInput?.click()} />
      <input bind:this={photoInput} type="file" accept="image/*" aria-label="Snap a photo" class="sr-only" tabindex="-1" onchange={() => void measure()} />
    </div>
  </div>
  <section aria-label="Convert a photo" class="mx-5 my-4">
    <Card href={resolve('/snap/convert')}>
      <h2 class="font-semibold">Have a photo of something you want to make?</h2>
      <p class="text-ui text-ink-mute">Drop it in Convert — Katachi dissects it into layers or joined faces, suggests variations, and breaks it into pieces with assembly steps.</p>
      {#snippet footer()}<span class="text-ui text-accent">Convert a photo →</span>{/snippet}
    </Card>
  </section>
</div>

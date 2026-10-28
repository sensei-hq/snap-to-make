<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { Button, Card } from '@rokkit/ui';
import { InputCheckbox } from '@rokkit/forms';
import StepScreen from '$lib/components/StepScreen.svelte';
import LayeredScene from '$lib/components/illustrations/LayeredScene.svelte';
import { copy } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
// 09 · Reference + changes (phone); the studio shows the same with the changes on the left
const app = useApp();
const f = app.layers;
$effect(() => app.setScreen(app.title, copy.reference.sub));
</script>
{#snippet aside()}
  <p class="md:hidden self-end max-w-[88%] rounded-lg bg-paper-mute px-3 py-2 text-ui">{copy.reference.ask}</p>
  <p class="lt-md:hidden eyebrow">Changes</p>
  <section aria-label="Changes">
    <Card>
      <ul class="divide-y divide-paper-edge -my-1">
        {#each f.changes as c (c.n)}
          <li><label class="flex items-center gap-3 min-h-12 cursor-pointer">
            <span class="w-5 h-5 shrink-0 grid place-items-center rounded-full bg-accent text-on-accent text-micro font-medium">{c.n}</span>
            <span class="flex-1">{c.label}</span><span class="meta">{c.where}</span>
            <InputCheckbox variant="default" name={`change-${c.n}`} value={c.on} onchange={() => f.toggleChange(c.n)} />
          </label></li>
        {/each}
      </ul>
    </Card>
  </section>
{/snippet}
{#snippet actions()}
  <span class="flex-1 grid md:flex-none"><Button style="outline" size="lg" label={copy.reference.next} onclick={() => void goto(resolve('/make/layers'))} /></span>
  <span class="flex-[1.3] grid md:flex-none"><Button variant="primary" size="lg" label={`Apply ${f.activeChanges} changes`} onclick={() => void goto(resolve('/make/layers'))} /></span>
{/snippet}
<svelte:head><title>Katachi · Reference + changes</title></svelte:head>
<StepScreen {aside} {actions} note={copy.reference.reply}>
  <figure class="relative m-0 w-full max-w-[640px] mx-auto aspect-square rounded-lg overflow-hidden border border-paper-edge">
    <LayeredScene layers={f.layers} mode="full" label="The reference: layered mountain sunset" />
    <span class="absolute left-[62%] top-[30%] w-6 h-6 grid place-items-center rounded-full bg-accent text-on-accent text-micro font-medium" aria-hidden="true">1</span>
    <span class="absolute left-[22%] top-[66%] w-6 h-6 grid place-items-center rounded-full bg-accent text-on-accent text-micro font-medium" aria-hidden="true">2</span>
    <span class="absolute right-2.5 bottom-2.5 meta rounded-sm bg-paper px-2 py-0.5 border border-paper-edge">{f.layers.length} layers found · same as original</span>
  </figure>
</StepScreen>

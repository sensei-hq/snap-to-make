<script lang="ts">
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { onDestroy } from 'svelte';
import LayersWork from '$lib/components/LayersWork.svelte';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
onDestroy(() => app.clearInfo(info));
import { Button, StatusList } from '@rokkit/ui';
import { copy } from '$lib/content/layers';
app.setScreen(copy.views.title, copy.views.sub);
app.setInfo('Views', info);
</script>
{#snippet info()}
  <div class="flex flex-col gap-3">
    <StatusList items={f.views.map((v) => ({ text: `${v.label} · ${v.ok ? 'matched' : 'needed'}`, status: v.ok ? 'pass' : 'unknown' }))} />
    <p class="text-ui text-ink-mute">{f.nextView ? `Next: ${f.nextView.label}. Sides ${f.sidesKnown ? 'known' : 'waiting for a side'}.` : copy.views.allIn}</p>
  </div>
{/snippet}
<svelte:head><title>Katachi · Six views</title></svelte:head>
<LayersWork prev={{ href: '/snap/capture', label: 'Capture' }} nextLabel={f.nextView ? `${copy.views.shutter} · ${f.nextView.label}` : 'Unfold into parts'} onNext={() => (f.nextView ? f.shoot() : void goto(resolve('/snap/layers/cut')))}>
  <section aria-label="Views" class="grid grid-cols-3 gap-2">
    {#each f.views as v (v.id)}
      <Button style={v.ok ? 'default' : 'outline'} variant={v.ok ? 'primary' : 'default'} aria-pressed={v.ok} icon={v.ok ? 'i-solar:check-circle-linear' : 'i-solar:camera-linear'} label={v.label} onclick={() => f.toggleView(v.id)} />
    {/each}
  </section>
</LayersWork>

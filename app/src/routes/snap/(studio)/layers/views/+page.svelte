<script lang="ts">
import { Button, Card, StatusList } from '@rokkit/ui';
import { copy } from '$lib/content/layers';
import { useApp } from '$lib/state/context';
const app = useApp();
const f = app.layers;
app.setScreen(copy.views.title, copy.views.sub);
</script>
<svelte:head><title>Katachi · Six views</title></svelte:head>
<div class="layers-grid">
  <section aria-label="Views">
    <Card>
      <div class="grid grid-cols-3 gap-2">
        {#each f.views as v (v.id)}
          <Button style={v.ok ? 'default' : 'outline'} variant={v.ok ? 'primary' : 'default'} aria-pressed={v.ok} icon={v.ok ? 'i-solar:check-circle-linear' : 'i-solar:camera-linear'} label={v.label} onclick={() => f.toggleView(v.id)} />
        {/each}
      </div>
    </Card>
  </section>
  <div class="flex flex-col gap-4">
    <StatusList items={f.views.map((v) => ({ text: `${v.label} · ${v.ok ? 'matched' : 'needed'}`, status: v.ok ? 'pass' : 'unknown' }))} />
    <p class="text-ui text-ink-mute">{f.nextView ? `Next: ${f.nextView.label}. Sides ${f.sidesKnown ? 'known' : 'waiting for a side'}.` : copy.views.allIn}</p>
    <Button variant="primary" size="lg" icon="i-solar:camera-linear" disabled={!f.nextView} label={f.nextView ? `${copy.views.shutter} · ${f.nextView.label}` : copy.views.done} onclick={() => f.shoot()} />
  </div>
</div>

<script lang="ts">
import { onMount } from 'svelte';
import { Button, Card, List, Message } from '@rokkit/ui';
import { useApp } from '$lib/state/context';
import WatchFeed from '$lib/components/illustrations/WatchFeed.svelte';
const app = useApp();
const watch = app.watch;
app.setScreen('Burn Watch', 'recorded clip · 0:58');
onMount(() => watch.load());
const mmss = (s: number) => `0:${String(Math.floor(s)).padStart(2, '0')}`;
const tone = (e: { kind: string; note: string }) => /flare/i.test(e.kind + e.note) ? 'bg-danger' : /smoke/i.test(e.kind + e.note) ? 'bg-warning' : 'bg-success';
const items = $derived(watch.events.map(e => ({ label: e.note, value: String(e.atSec), at: mmss(e.atSec), tone: tone(e) })));
</script>
<svelte:head><title>Katachi · Burn Watch</title></svelte:head>
<div class="stage">
  {#if watch.alert}
    <Message type="error" class="mx-5 mt-4" text={`${watch.alert.note} · ${mmss(watch.alert.atSec)} — pause and check the air assist.`} />
  {/if}
  <section aria-label="Watch stage" class="mx-5 mt-4 relative rounded-lg overflow-hidden min-h-57" data-mode="dark">
    <WatchFeed />
    <span class="meta absolute left-3 top-3 text-ink">Workpiece · tracked</span>
    <span class="meta absolute right-3 bottom-3 text-ink">SAM 3.1 + Spark · {mmss(watch.positionSec)}</span>
  </section>
  <div class="mx-5 mt-4">
    <div class="relative h-1 rounded-full bg-paper-mute">
      {#each items as e (e.value)}<span class="absolute w-3 h-3 rounded-full -top-1 {e.tone}" style="left:{(Number(e.value) / 58) * 100}%"></span>{/each}
    </div>
    <p class="meta flex justify-between mt-2"><span>0:00</span><span>0:58</span></p>
  </div>
  <section aria-label="Event timeline" class="mx-5 mt-2">
    <Card>
      <List {items}>
        {#snippet itemContent(proxy)}<span class="w-1.5 h-1.5 rounded-full shrink-0 {proxy.get('tone')}"></span><span class="flex-1">{proxy.label}</span><span class="readout">{proxy.get('at')}</span>{/snippet}
      </List>
    </Card>
  </section>
  <div class="flex-1"></div>
  <div class="px-5 pb-2 flex gap-2.5">
    <Button style="outline" size="lg" class="flex-1" icon="i-solar:refresh-linear" label={`Replay ${watch.alert ? mmss(watch.alert.atSec) : '0:42'}`} onclick={() => watch.replay()} />
    <Button size="lg" variant="primary" class="flex-1" icon={watch.checked ? 'i-solar:check-circle-linear' : undefined} label={watch.checked ? 'Checked' : 'I checked it'} onclick={() => watch.acknowledge()} />
  </div>
  <p class="meta text-center pb-4">Advisory only — never leave your laser unattended</p>
</div>

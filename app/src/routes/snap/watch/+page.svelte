<script lang="ts">
import { onMount } from 'svelte';
import { WatchState } from '$lib/state/watch.svelte';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import AppNav from '$lib/components/AppNav.svelte';
import { UiState } from '$lib/state/ui.svelte';
import { List } from '@rokkit/ui';
const watch = new WatchState();
const ui = new UiState();
onMount(() => watch.load());
const mmss = (s: number) => `0:${String(Math.floor(s)).padStart(2, '0')}`;
const items = $derived(watch.events.map(e => ({ label: e.note, value: String(e.atSec), at: mmss(e.atSec), kind: e.kind })));
</script>
<div class="phone-col">
  <ScreenHeader title="Burn Watch" subtitle="recorded clip · 0:58" pill="● watching" onToggleMode={() => ui.toggleMode()} />
  <AppNav current="watch" />
  {#if watch.alert}
    <p class="mx-5 mt-4 rounded-xl px-4 py-3" style="background:color-mix(in oklch, var(--danger) 12%, var(--paper));border:1px solid var(--danger)">
      <strong style="color:var(--danger)">⚠ {watch.alert.note} · {mmss(watch.alert.atSec)}</strong><br />
      <span class="text-sm">Pause and check the air assist.</span>
    </p>
  {/if}
  <section aria-label="Watch stage" class="mx-5 mt-4 relative rounded-xl overflow-hidden" style="background:#10151C;min-height:230px" >
    <span class="mono absolute left-3 top-3 text-xs" style="color:#F3EDE2">Workpiece · tracked</span>
    <div class="absolute rounded" style="left:16%;top:16%;width:62%;height:64%;background:#C9B18A;transform:rotate(-3deg)">
      <span class="absolute rounded-full" style="left:12%;top:14%;width:56px;height:56px;border:2px solid #7A5A34"></span>
      <span class="absolute rounded-full" style="right:12%;top:14%;width:56px;height:56px;border:2px solid #7A5A34"></span>
      <span class="absolute rounded-full" style="left:12%;bottom:12%;width:56px;height:56px;border:2px solid var(--accent);background:rgba(255,120,40,.35)"></span>
      <span class="absolute rounded-full" style="right:12%;bottom:12%;width:56px;height:56px;border:2px solid #7A5A34"></span>
    </div>
    <span class="mono absolute right-3 bottom-3 text-xs" style="color:#F3EDE2">SAM 3.1 + Spark · {mmss(watch.positionSec)}</span>
  </section>
  <div class="mx-5 mt-4">
    <div class="relative h-1 rounded-full" style="background:var(--paper-mute)">
      {#each watch.events as e (e.atSec)}<span class="absolute w-3 h-3 rounded-full -top-1" style="left:{(e.atSec / 58) * 100}%;background:{/flare/i.test(e.kind + e.note) ? 'var(--danger)' : /smoke/i.test(e.kind + e.note) ? 'var(--warning)' : 'var(--success)'}"></span>{/each}
    </div>
    <p class="mono text-xs flex justify-between mt-2" style="color:var(--ink-mute)"><span>0:00</span><span>0:58</span></p>
  </div>
  <section aria-label="Event timeline" class="mx-5 mt-2 card px-2">
    <List {items}>
      {#snippet itemContent(proxy)}<span class="flex-1">{proxy.label}</span><span class="mono text-sm" style="color:var(--ink-mute)">{proxy.get('at')}</span>{/snippet}
    </List>
  </section>
  <div class="flex-1"></div>
  <div class="px-5 pb-2 flex gap-3">
    <button type="button" class="btn-line flex-1" onclick={() => watch.replay()}>Replay {watch.alert ? mmss(watch.alert.atSec) : '0:42'}</button>
    <button type="button" class="btn-ink flex-1" onclick={() => watch.acknowledge()}>{watch.checked ? 'Checked ✓' : 'I checked it'}</button>
  </div>
  <p class="mono text-xs text-center pb-4" style="color:var(--ink-mute)">Advisory only — never leave your laser unattended</p>
</div>

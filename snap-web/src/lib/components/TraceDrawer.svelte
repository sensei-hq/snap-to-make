<script lang="ts">
import { List } from '@rokkit/ui';
let { entries, label, onExport }: { entries: any[]; label: string; onExport?: () => void } = $props();
const total = $derived(entries.reduce((s, e) => s + e.costUsd, 0));
const secs = $derived(Math.round(entries.reduce((s, e) => s + e.latencyMs, 0) / 1000));
const models = $derived(entries.reduce<string[]>((a, e) => a.includes(e.model) ? a : [...a, e.model], []));
const items = $derived(entries.map(e => ({ label: `${e.model} · ${e.purpose}`, value: e.model + e.purpose, sub: `${(e.latencyMs / 1000).toFixed(1)} s`, cost: `$${e.costUsd.toFixed(3)}` })));
</script>
<aside aria-label="Under the hood" class="px-5 py-4 flex flex-col gap-3">
  <p class="mono text-xs tracking-widest" style="color:var(--ink-mute)">SESSION TRACE</p>
  <h2 class="font-display text-2xl">Under the hood</h2>
  <div class="grid grid-cols-3 gap-2 text-center">
    <p class="card py-3"><strong class="mono text-lg">${total.toFixed(2)}</strong><br /><span class="mono text-xs" style="color:var(--ink-mute)">total</span></p>
    <p class="card py-3"><strong class="mono text-lg">{entries.length}</strong><br /><span class="mono text-xs" style="color:var(--ink-mute)">calls · {models.length} models</span></p>
    <p class="card py-3"><strong class="mono text-lg">{secs} s</strong><br /><span class="mono text-xs" style="color:var(--ink-mute)">AI time</span></p>
  </div>
  <div class="flex h-2 rounded-full overflow-hidden" aria-hidden="true"><span style="width:45%;background:var(--ink)"></span><span style="width:30%;background:var(--ink-mute)"></span><span style="width:25%;background:var(--accent)"></span></div>
  <p class="mono text-xs" style="color:var(--ink-mute)">{label}</p>
  <div class="card px-2">
    <List {items}>
      {#snippet itemContent(proxy)}<span class="flex-1"><span class="block">{proxy.label}</span><span class="mono text-xs" style="color:var(--ink-mute)">{proxy.get('sub')}</span></span><span class="mono text-sm">{proxy.get('cost')}</span>{/snippet}
    </List>
  </div>
  <div class="flex items-center gap-3"><span class="mono text-xs flex-1" style="color:var(--ink-mute)">sample values · live session</span><button type="button" class="btn-line" onclick={() => onExport?.()}>Export trace</button></div>
</aside>

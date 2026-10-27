<script lang="ts">
import { Button, Card, List } from '@rokkit/ui';
let { entries, label, onExport }: { entries: any[]; label: string; onExport?: () => void } = $props();
const total = $derived(entries.reduce((s, e) => s + e.costUsd, 0));
const secs = $derived(Math.round(entries.reduce((s, e) => s + e.latencyMs, 0) / 1000));
const models = $derived(entries.reduce<string[]>((a, e) => a.includes(e.model) ? a : [...a, e.model], []));
const items = $derived(entries.map(e => ({ label: `${e.model} · ${e.purpose}`, value: e.model + e.purpose, sub: `${(e.latencyMs / 1000).toFixed(1)} s`, cost: `$${e.costUsd.toFixed(3)}` })));
const stats = $derived([
  { value: `$${total.toFixed(2)}`, label: 'total' },
  { value: String(entries.length), label: `calls · ${models.length} models` },
  { value: `${secs} s`, label: 'AI time' }
]);
</script>
<aside aria-label="Under the hood" class="px-5 py-4 flex flex-col gap-3">
  <p class="eyebrow">Session trace</p>
  <h2 class="section-title">Under the hood</h2>
  <div class="grid grid-cols-3 gap-2 text-center">
    {#each stats as s (s.label)}<Card><p class="readout text-lede text-ink">{s.value}</p><p class="meta">{s.label}</p></Card>{/each}
  </div>
  <div class="flex h-2 rounded-full overflow-hidden" aria-hidden="true"><span class="w-[45%] bg-ink"></span><span class="w-[30%] bg-ink-soft"></span><span class="w-[25%] bg-accent"></span></div>
  <p class="meta">{label}</p>
  <Card>
    <List {items}>
      {#snippet itemContent(proxy)}<span class="flex-1"><span class="block">{proxy.label}</span><span class="meta">{proxy.get('sub')}</span></span><span class="readout">{proxy.get('cost')}</span>{/snippet}
    </List>
  </Card>
  <div class="flex items-center gap-3"><span class="meta flex-1">sample values · live session</span><Button style="outline" icon="i-solar:export-linear" label="Export trace" onclick={() => onExport?.()} /></div>
</aside>

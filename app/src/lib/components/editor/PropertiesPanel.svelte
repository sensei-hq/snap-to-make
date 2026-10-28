<script lang="ts">
import { Button, List, StatusList, Tabs, Toggle } from '@rokkit/ui';
import { InputCheckbox, InputField } from '@rokkit/forms';
import type { Op, OpParams, Tab } from '$lib/state/editor.svelte';
import type { CanvasPiece } from '$lib/domain/canvas';
// Studio right panel for the canvas: Properties / Layers / Job (one right panel at a time with the chat).
let { tab, op, params, airAssist, pieces, preflight, estimateMinutes, deviceLabel = 'Ray 5 · birch_3mm · GRBL',
  onTab, onOp, onParam, onToggleAir, onClose, onDownloadGcode }: {
  tab: Tab; op: Op; params: OpParams; airAssist: boolean; pieces: CanvasPiece[]; preflight: { label: string; ok: boolean }[];
  estimateMinutes: number; deviceLabel?: string;
  onTab: (t: Tab) => void; onOp: (o: Op) => void; onParam: (k: keyof OpParams, v: number) => void; onToggleAir: () => void;
  onClose: () => void; onDownloadGcode: () => void;
} = $props();
const tabs = [{ label: 'Properties', value: 'properties' }, { label: 'Layers', value: 'layers' }, { label: 'Job', value: 'job' }];
const ops = [{ label: 'Cut', value: 'cut' }, { label: 'Engrave', value: 'engrave' }, { label: 'Score', value: 'score' }];
const items = $derived(pieces.map((p) => ({ label: p.id, value: p.id, op: p.label ? 'engrave + cut' : 'cut' })));
</script>
<aside aria-label="Properties" class="w-84 shrink-0 flex flex-col min-h-0 bg-paper-soft border-l border-paper-edge">
  <header class="h-12 shrink-0 flex items-center gap-2 px-3 hair-b">
    <div class="flex-1"><Tabs options={tabs} value={tab} onchange={(v) => onTab(v as Tab)} /></div>
    <Button style="ghost" size="sm" icon="i-solar:close-circle-linear" aria-label="Close properties" onclick={onClose} />
  </header>
  <div class="flex-1 min-h-0 overflow-auto p-4 flex flex-col gap-4">
    {#if tab === 'properties'}
      <Toggle options={ops} value={op} showLabels onchange={(v) => onOp(v as Op)} />
      <InputField type="range" name="power" label={`Power · ${params.power}%`} min={1} max={100} value={params.power} onchange={(v) => onParam('power', Number(v))} />
      <InputField type="range" name="speed" label={`Speed · ${params.speed} mm/s`} min={1} max={300} value={params.speed} onchange={(v) => onParam('speed', Number(v))} />
      <InputField type="range" name="passes" label={`Passes · ${params.passes}`} min={1} max={10} value={params.passes} onchange={(v) => onParam('passes', Number(v))} />
      <label class="flex items-center gap-3 cursor-pointer"><InputCheckbox variant="default" name="air" value={airAssist} onchange={onToggleAir} /><span>Air assist</span></label>
    {:else if tab === 'layers'}
      <List {items}>{#snippet itemContent(proxy)}<span class="flex-1">{proxy.label}</span><span class="meta">{proxy.get('op')}</span>{/snippet}</List>
    {:else}
      <p class="flex justify-between"><span class="eyebrow">Estimate</span><span class="readout text-ink">{estimateMinutes} min</span></p>
      <StatusList items={preflight.map((c) => ({ text: c.label, status: c.ok ? 'pass' : 'warn' }))} />
      <p class="meta">{deviceLabel}</p>
      <Button variant="primary" size="lg" icon="i-solar:download-linear" label="Download G-code" onclick={onDownloadGcode} />
    {/if}
  </div>
</aside>

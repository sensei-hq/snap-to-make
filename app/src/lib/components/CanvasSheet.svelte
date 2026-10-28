<script lang="ts">
import { Button, Card, StatusList } from '@rokkit/ui';
import KatachiMark from './KatachiMark.svelte';
import type { CanvasPiece } from '$lib/domain/canvas';
let { pieces, preflight, estimateMinutes, deviceLabel = 'Ray 5 · birch_3mm · GRBL', message, lid, zoom = 100, showGrid = true, onAddLid, onDeclineLid, onExportSvg, onDownloadGcode }: {
  pieces: CanvasPiece[]; preflight: { label: string; ok: boolean }[]; estimateMinutes: number; deviceLabel?: string; zoom?: number; showGrid?: boolean;
  message: string; lid: 'offered' | 'added' | 'declined';
  onAddLid?: () => void; onDeclineLid?: () => void; onExportSvg?: () => void; onDownloadGcode?: () => void;
} = $props();
const checks = $derived(preflight.map((c) => ({ text: c.label, status: c.ok ? 'pass' : 'warn' })));
const legend = [{ label: 'cut', swatch: 'bg-cut' }, { label: 'engrave', swatch: 'bg-engrave' }];
</script>
<section aria-label="Canvas" class="px-4 py-4 flex flex-col gap-3.5">
  <div class="relative rounded-lg bg-paper-soft border border-paper-edge overflow-auto {showGrid ? 'grid-bed' : ''}" role="img" aria-label="Nested sheet layout 300 by 300 millimetres">
    <svg viewBox="0 0 300 300" class="block origin-top-left" style="width:{zoom}%" fill="none" stroke-width="1.4">
      <rect x="6" y="6" width="288" height="288" stroke="var(--paper-edge)" stroke-width="1" />
      {#each pieces as p (p.id)}
        {#if p.kind === 'circle'}<circle cx={p.xMm + p.wMm / 2} cy={p.yMm + p.hMm / 2} r={p.wMm / 2} stroke="var(--cut)" />{#if p.label}<text x={p.xMm + p.wMm / 2} y={p.yMm + p.hMm / 2 + 7} text-anchor="middle" font-size="22" fill="var(--engrave)" stroke="none">{p.label}</text>{/if}
        {:else}<rect x={p.xMm} y={p.yMm} width={p.wMm} height={p.hMm} stroke="var(--cut)" />{/if}
      {/each}
    </svg>
    <ul class="absolute right-2 top-2 flex gap-1.5">
      {#each legend as l (l.label)}<li class="meta inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-paper-soft border border-paper-edge"><span class="w-2.5 h-0.5 {l.swatch}"></span>{l.label}</li>{/each}
    </ul>
    <span class="meta absolute right-2 bottom-2">300 × 300 mm</span>
  </div>
  <div class="flex items-center gap-2.5 text-ui" aria-live="polite">
    <KatachiMark size={20} class="text-ink shrink-0" />
    <span class="flex-1">{message}</span>
    {#if lid === 'offered'}<Button style="outline" size="sm" label="Add lid" onclick={() => onAddLid?.()} /><Button size="sm" style="ghost" label="No" onclick={() => onDeclineLid?.()} />{/if}
  </div>
  <Card>
    {#snippet header()}<p class="flex justify-between items-baseline"><span class="eyebrow">Preflight</span><span class="readout text-ink">est. {estimateMinutes} min</span></p>{/snippet}
    <StatusList items={checks} />
    {#snippet footer()}<p class="meta">{deviceLabel}</p>{/snippet}
  </Card>
  <div class="flex gap-2.5">
    <Button style="outline" size="lg" class="flex-1" icon="i-solar:export-linear" label="Export SVG" onclick={() => onExportSvg?.()} />
    <Button size="lg" variant="primary" class="flex-1" icon="i-solar:download-linear" label="Download G-code" onclick={() => onDownloadGcode?.()} />
  </div>
</section>

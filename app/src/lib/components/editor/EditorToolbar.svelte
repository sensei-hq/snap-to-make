<script lang="ts">
import { Button, Toggle } from '@rokkit/ui';
import type { Tool } from '$lib/state/editor.svelte';
// Studio canvas toolbar (≥ md): tools, zoom, grid, status, properties toggle.
let { tool, zoomLabel, showGrid, statusLine, propsOpen, onTool, onZoomIn, onZoomOut, onToggleGrid, onToggleProps }: {
  tool: Tool; zoomLabel: string; showGrid: boolean; statusLine: string; propsOpen: boolean;
  onTool: (t: Tool) => void; onZoomIn: () => void; onZoomOut: () => void; onToggleGrid: () => void; onToggleProps: () => void;
} = $props();
const tools: { label: string; value: Tool }[] = [
  { label: 'Select', value: 'select' }, { label: 'Rect', value: 'rect' }, { label: 'Ellipse', value: 'ellipse' },
  { label: 'Pen', value: 'pen' }, { label: 'Text', value: 'text' }, { label: 'Measure', value: 'measure' }
];
</script>
<div role="toolbar" aria-label="Editor" class="flex flex-wrap items-center gap-2 px-6 py-2.5 hair-b bg-paper">
  <Button style="ghost" size="sm" icon="i-solar:undo-left-linear" aria-label="Undo" disabled />
  <Button style="ghost" size="sm" icon="i-solar:undo-right-linear" aria-label="Redo" disabled />
  <Toggle options={tools} value={tool} showLabels size="sm" onchange={(v) => onTool(v as Tool)} />
  <span class="flex-1"></span>
  <span class="meta lt-lg:hidden">{statusLine}</span>
  <Button style="ghost" size="sm" icon="i-solar:minus-circle-linear" aria-label="Zoom out" onclick={onZoomOut} />
  <span class="readout w-12 text-center">{zoomLabel}</span>
  <Button style="ghost" size="sm" icon="i-solar:add-circle-linear" aria-label="Zoom in" onclick={onZoomIn} />
  <Button style={showGrid ? 'default' : 'ghost'} variant={showGrid ? 'primary' : 'default'} size="sm" icon="i-solar:hashtag-square-linear" aria-label="Toggle grid" aria-pressed={showGrid} onclick={onToggleGrid} />
  <Button style={propsOpen ? 'default' : 'ghost'} variant={propsOpen ? 'primary' : 'default'} size="sm" icon="i-solar:tuning-2-linear" aria-label="Toggle properties panel" aria-pressed={propsOpen} onclick={onToggleProps} />
</div>

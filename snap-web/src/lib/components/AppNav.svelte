<script lang="ts">
import { resolve } from '$app/paths';
let { current }: { current: 'workshop' | 'convert' | 'watch' | 'batch' | 'capture' | 'canvas' } = $props();
const cls = (id: string) => current === id ? 'bg-primary text-on-primary' : 'bg-paper-soft text-ink';
</script>
<nav aria-label="Snap sections" class="bg-paper flex gap-2 flex-wrap px-4 py-2 mono text-xs">
  <a href={resolve('/snap')} aria-current={current === 'workshop' ? 'page' : undefined} class="rounded-full px-3 py-1 text-sm" style={cls('workshop')}>Workshop</a>
  <a href={resolve('/snap/convert')} aria-current={current === 'convert' ? 'page' : undefined} class="rounded-full px-3 py-1 text-sm" style={cls('convert')}>Convert a photo</a>
  <a href={resolve('/snap/watch')} aria-current={current === 'watch' ? 'page' : undefined} class="rounded-full px-3 py-1 text-sm" style={cls('watch')}>Burn Watch</a>
  <a href={resolve('/snap/batch')} aria-current={current === 'batch' ? 'page' : undefined} class="rounded-full px-3 py-1 text-sm" style={cls('batch')}>Batch</a>
  <a href={resolve('/snap/capture')} aria-current={current === 'capture' ? 'page' : undefined} class="rounded-full px-3 py-1 text-sm" style={cls('capture')}>Snap</a>
  <a href={resolve('/snap/canvas')} aria-current={current === 'canvas' ? 'page' : undefined} class="rounded-full px-3 py-1 text-sm" style={cls('canvas')}>Canvas</a>
</nav>

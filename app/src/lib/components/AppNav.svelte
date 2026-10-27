<script lang="ts">
import { resolve } from '$app/paths';
import { Button } from '@rokkit/ui';
type Section = 'workshop' | 'convert' | 'watch' | 'batch' | 'capture' | 'canvas';
let { current }: { current: Section } = $props();
const links: { id: Section; href: string; label: string }[] = [
  { id: 'workshop', href: resolve('/snap'), label: 'Workshop' },
  { id: 'convert', href: resolve('/snap/convert'), label: 'Convert a photo' },
  { id: 'watch', href: resolve('/snap/watch'), label: 'Burn Watch' },
  { id: 'batch', href: resolve('/snap/batch'), label: 'Batch' },
  { id: 'capture', href: resolve('/snap/capture'), label: 'Snap' },
  { id: 'canvas', href: resolve('/snap/canvas'), label: 'Canvas' }
];
</script>
<nav aria-label="Snap sections" class="flex gap-1.5 flex-wrap px-4 py-2.5 hair-b">
  {#each links as l (l.id)}
    <Button href={l.href} size="sm" variant={current === l.id ? 'primary' : 'default'} style={current === l.id ? 'default' : 'ghost'} aria-current={current === l.id ? 'page' : undefined} label={l.label} />
  {/each}
</nav>

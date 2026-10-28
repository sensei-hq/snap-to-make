<script lang="ts">
import { Button } from '@rokkit/ui';
// Numbered step strip for the image → layers flow (phone scrolls sideways; studio shows all).
let { steps, current }: { steps: readonly { id: string; label: string; path: string }[]; current: string } = $props();
</script>
<nav aria-label="Image to layers steps" class="flex gap-1 overflow-x-auto px-4 py-2 hair-b">
  {#each steps as s, i (s.id)}
    <Button target="" href={s.path} size="sm" style={s.id === current ? 'default' : 'ghost'} variant={s.id === current ? 'primary' : 'default'}
      aria-current={s.id === current ? 'step' : undefined} label={`${String(i + 1).padStart(2, '0')} ${s.label}`} />
  {/each}
</nav>

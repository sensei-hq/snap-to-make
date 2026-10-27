<script lang="ts">
import { Card } from '@rokkit/ui';
let { imageUrl, pieces }: { imageUrl?: string; pieces: { name: string; kind: string }[] } = $props();
const offset = ['-translate-y-1', 'translate-y-0', 'translate-y-1'];
</script>
<!-- How the photo splits: source, then pieces front-to-back as an exploded stack -->
<section aria-label="How the photo splits">
  <Card>
    {#snippet header()}<h3 class="font-semibold">How the photo splits into segments</h3>{/snippet}
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      {#if imageUrl}<img src={imageUrl} alt="Source" class="w-20 h-20 object-cover rounded shrink-0" />{/if}
      {#each pieces as p, i (p.name)}
        <span aria-hidden="true" class="text-ink-faint shrink-0">→</span>
        <div class="rounded px-3 py-2 shrink-0 text-center bg-paper-mute {offset[i % 3]}"><p class="meta">{p.kind}</p><p class="text-ui">{p.name}</p></div>
      {/each}
    </div>
    {#snippet footer()}<p class="text-ui text-ink-mute">Front pieces first, joins and base last — the order you will cut and stack them.</p>{/snippet}
  </Card>
</section>

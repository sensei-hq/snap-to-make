<script lang="ts">
import { Button } from '@rokkit/ui';
import KatachiMark from './KatachiMark.svelte';
import type { Section, SectionId } from '$lib/content/sections';
// Phone (< md) section tabs. The studio uses NavRail with the same list.
let { sections, current }: { sections: Section[]; current: SectionId | '' } = $props();
</script>
<nav aria-label="Snap sections" class="flex items-center gap-1.5 flex-wrap px-4 py-2.5 bg-paper hair-b">
  <KatachiMark size={22} class="text-ink mr-1" />
  {#each sections as s (s.id)}
    <Button target="" href={s.href} size="sm" variant={current === s.id ? 'primary' : 'default'} style={current === s.id ? 'default' : 'ghost'} aria-current={current === s.id ? 'page' : undefined} label={s.label} />
  {/each}
</nav>

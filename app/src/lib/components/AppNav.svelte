<script lang="ts">
import { Button } from '@rokkit/ui';
import KatachiMark from './KatachiMark.svelte';
import type { Section, SectionId } from '$lib/content/sections';
// Phone (< md) section tabs. The studio uses NavRail with the same list.
let { sections, current }: { sections: Section[]; current: SectionId | '' } = $props();
</script>
<nav aria-label="Snap sections" class="flex items-center gap-1.5 flex-wrap px-4 py-2.5 bg-paper hair-b">
  <span class="mr-1 grid place-items-center w-8 h-8 rounded-md bg-brand-tile"><KatachiMark size={20} /></span>
  {#each sections as s (s.id)}
    <Button target="" href={s.href} size="sm" variant={current === s.id ? 'primary' : 'default'} style={current === s.id ? 'default' : 'ghost'} aria-current={current === s.id ? 'page' : undefined} label={s.label} />
  {/each}
</nav>

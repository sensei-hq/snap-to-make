<script lang="ts">
import { resolve } from '$app/paths';
// Studio step tabs in the top bar: the craft journey's five steps; mono number, label; the current one is filled.
// Steps not reached yet show but are not links.
let { steps, current, open = () => true }: { steps: readonly { id: string; label: string; path: string }[]; current: string; open?: (id: string) => boolean } = $props();
</script>
<nav aria-label="Craft steps" class="flex gap-0.5">
  {#each steps as s, i (s.id)}
    {#if s.id === current || open(s.id)}
      <a href={resolve(s.path as '/workshop')} aria-current={s.id === current ? 'step' : undefined}
        class="h-8 inline-flex items-center gap-1.75 px-3 rounded-md text-ui font-medium no-underline hover:no-underline {s.id === current ? 'bg-paper-mute text-ink' : 'text-ink-soft hover:text-ink'}">
        <span class="font-mono text-micro {s.id === current ? 'text-accent' : 'text-ink-faint'}">{i + 1}</span>{s.label}
      </a>
    {:else}
      <span aria-disabled="true" title="Not reached yet" class="h-8 inline-flex items-center gap-1.75 px-3 text-ui font-medium text-ink-faint cursor-default"><span class="font-mono text-micro">{i + 1}</span>{s.label}</span>
    {/if}
  {/each}
</nav>

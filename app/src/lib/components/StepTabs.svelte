<script lang="ts">
import { resolve } from '$app/paths';
// Studio step tabs in the top bar (mockups/desktop D1–D6): mono number, label; the current one is filled.
let { steps, current }: { steps: readonly { id: string; label: string; path: string }[]; current: string } = $props();
</script>
<nav aria-label="Image to layers steps" class="flex gap-0.5">
  {#each steps as s, i (s.id)}
    <a href={resolve(s.path as '/workshop')} aria-current={s.id === current ? 'step' : undefined}
      class="h-8 inline-flex items-center gap-1.75 px-3 rounded-md text-ui font-medium no-underline hover:no-underline {s.id === current ? 'bg-paper-mute text-ink' : 'text-ink-soft hover:text-ink'}">
      <span class="font-mono text-micro {s.id === current ? 'text-accent' : 'text-ink-faint'}">{i + 1}</span>{s.label}
    </a>
  {/each}
</nav>

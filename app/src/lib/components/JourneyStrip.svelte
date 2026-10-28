<script lang="ts">
// Phone step strip for the craft journey: one bar per step, then "02 / 05 · Shape · outline" and "next · layers".
let { step }: { step: { n: number; total: number; label: string; sub: string; next: string | null } } = $props();
const pad = (n: number) => String(n).padStart(2, '0');
</script>
<nav aria-label="Craft steps" class="px-4 pt-2.5">
  <div class="flex gap-1" aria-hidden="true">
    {#each Array.from({ length: step.total }, (_, i) => i + 1) as i (i)}
      <span class="flex-1 h-[3px] rounded-sm {i < step.n ? 'bg-ink-soft' : i === step.n ? 'bg-accent' : 'bg-paper-edge'}"></span>
    {/each}
  </div>
  <p class="flex justify-between mt-1.75"><span class="meta text-ink">{pad(step.n)} / {pad(step.total)} · {step.label}{step.sub ? ` · ${step.sub}` : ''}</span><span class="meta">{step.next ? `next · ${step.next}` : 'last step'}</span></p>
</nav>

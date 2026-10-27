<script lang="ts">
import { Button, Card, Pill, StatusList } from '@rokkit/ui';
import ScenePhoto from './illustrations/ScenePhoto.svelte';
let { scene, measureLabel, onFix, onConfirm }: { scene: any; measureLabel: string; onFix?: () => void; onConfirm?: () => void } = $props();
const objects = $derived<any[]>(scene?.scene?.objects ?? []);
const shown = $derived(objects.length ? objects : [{ role: 'art' }, { role: 'fitTarget' }, { role: 'reference' }]);
const roles: Record<string, { label: string; tone: string }> = {
  art: { label: 'Sketch · art', tone: '' },
  fitTarget: { label: 'Mug · fit', tone: 'bg-accent-soft text-accent' },
  reference: { label: 'Card · ref', tone: 'bg-warning-soft text-warning-ink' }
};
const role = (o: any) => roles[o.role] ?? roles.reference;
const rows = $derived([{ label: 'Mug base', value: measureLabel || 'Ø 82 mm' }, { label: 'Logo sketch', value: '62 × 58 mm' }]);
</script>
<section aria-label="Scene" class="px-4 pt-4 flex flex-col gap-3.5">
  <ScenePhoto masks={objects.length || 3} />
  <div class="flex flex-wrap gap-2">
    {#each shown as o (o.role ?? o.id)}<Pill value={role(o).label} class={role(o).tone} />{/each}
  </div>
  <Card>
    <dl class="divide-y divide-paper-edge">
      {#each rows as r (r.label)}
        <div class="flex items-center gap-3 min-h-12 px-3.5"><dt class="flex-1">{r.label}</dt><dd class="readout text-ink">{r.value}</dd>
          <Button style="ghost" size="sm" icon="i-solar:pen-linear" aria-label={`Edit ${r.label}`} onclick={() => onFix?.()} /></div>
      {/each}
    </dl>
    {#snippet footer()}<StatusList items={[{ text: 'Scale from credit card · confidence high', status: 'pass' }]} />{/snippet}
  </Card>
  <div class="flex gap-2.5">
    <Button style="outline" size="lg" class="flex-1" label="Fix a number" onclick={() => onFix?.()} />
    <Button size="lg" variant="primary" class="flex-1" label="Looks right" onclick={() => onConfirm?.()} />
  </div>
</section>

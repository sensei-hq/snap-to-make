<script lang="ts">
import { Button, Card, Pill, StatusList } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import ScenePhoto from './illustrations/ScenePhoto.svelte';
import type { Measurement } from '$lib/state/flow.svelte';
let { objects = [], measurements, editing = null, onEdit, onSet, onConfirm }: {
  objects?: any[]; measurements: Measurement[]; editing?: string | null;
  onEdit?: (id: Measurement['id']) => void; onSet?: (id: Measurement['id'], value: number) => void; onConfirm?: () => void;
} = $props();
const shown = $derived(objects.length ? objects : [{ role: 'art' }, { role: 'fitTarget' }, { role: 'reference' }]);
const roles: Record<string, { label: string; tone: string }> = {
  art: { label: 'Sketch · art', tone: '' },
  fitTarget: { label: 'Mug · fit', tone: 'bg-accent-soft text-accent' },
  reference: { label: 'Card · ref', tone: 'bg-warning-soft text-warning-ink' }
};
const role = (o: any) => roles[o.role] ?? roles.reference;
const show = (m: Measurement) => (m.kind === 'diameter' ? `Ø ${m.value} mm` : `${m.value} × ${m.value2} mm`);
const mug = $derived(measurements.find((m) => m.id === 'mug')!);
</script>
<section aria-label="Scene" class="px-4 pt-4 flex flex-col gap-3.5">
  <ScenePhoto masks={objects.length || 3} diameterLabel={`Ø ${mug.value} mm ±${mug.tolerance}`} />
  <div class="flex flex-wrap gap-2">
    {#each shown as o (o.role ?? o.id)}<Pill value={role(o).label} class={role(o).tone} />{/each}
  </div>
  <Card>
    <dl class="divide-y divide-paper-edge">
      {#each measurements as m (m.id)}
        <div class="flex items-center gap-3 min-h-12 px-3.5">
          <dt class="flex-1">{m.label}</dt>
          {#if editing === m.id && m.kind === 'diameter'}
            <dd class="w-32"><InputField type="number" name={m.id} label={`${m.label} in millimetres`} nolabel aria-label={`${m.label} in millimetres`} min={1} step={0.1} value={m.value} onchange={(v) => onSet?.(m.id, Number(v))} /></dd>
          {:else}
            <dd class="readout text-ink">{show(m)}</dd>
            <Button style="ghost" size="sm" icon="i-solar:pen-linear" aria-label={`Edit ${m.label}`} onclick={() => onEdit?.(m.id)} />
          {/if}
        </div>
      {/each}
    </dl>
    {#snippet footer()}<StatusList items={[{ text: 'Scale from credit card · confidence high', status: 'pass' }]} />{/snippet}
  </Card>
  <div class="flex gap-2.5">
    <Button style="outline" size="lg" class="flex-1" label="Fix a number" onclick={() => onEdit?.('mug')} />
    <Button size="lg" variant="primary" class="flex-1" label="Looks right" onclick={() => onConfirm?.()} />
  </div>
</section>

<script lang="ts">
import { Badge, Button, Card, Toggle } from '@rokkit/ui';
import ChatThread from './ChatThread.svelte';
import ArtTake from './illustrations/ArtTake.svelte';
let { variants, selected, onPick, onReroll, onOriginal }: { variants: string[]; selected: number; onPick: (i: number) => void; onReroll?: () => void; onOriginal?: () => void } = $props();
const takes = ['take-1', 'take-2', 'take-3'] as const;
const take = (i: number) => takes[i % takes.length];
const options = $derived(variants.map((v, i) => ({ label: `Variant ${i + 1}`, value: i, title: v })));
</script>
<section aria-label="Art picker" class="px-4 py-4 flex flex-col gap-3.5">
  <ChatThread messages={[{ role: 'katachi', text: 'Cleaned up your M — three takes, all single-line and laser friendly. Which one?' }]} />
  <div class="flex items-center gap-3">
    <Card class="w-16 h-16 grid place-items-center"><ArtTake variant="original" size={44} /></Card>
    <span class="flex-1"><strong class="font-medium">Your sketch</strong><br /><span class="meta">62 × 58 mm · pencil</span></span>
    <span class="readout">→ 3 takes</span>
  </div>
  <Toggle {options} value={selected} onchange={(v) => onPick(Number(v))} class="w-full">
    {#snippet item(proxy)}<span class="grid place-items-center py-2 swatch-birch rounded" aria-label={proxy.label}><ArtTake variant={take(Number(proxy.value))} size={48} /></span>{/snippet}
  </Toggle>
  <div class="relative rounded-lg grid place-items-center swatch-birch border border-paper-edge min-h-57">
    <Badge variant="primary" class="absolute right-3 top-3">Muse Image</Badge>
    <ArtTake variant={take(selected)} size={150} />
    <span class="absolute left-3 bottom-3 meta px-2 py-1 rounded-full bg-paper">Take {selected + 1} · 60 mm on each coaster</span>
  </div>
  <div class="flex gap-2.5 items-center">
    <Button style="outline" size="lg" icon="i-solar:refresh-linear" label="Re-roll" onclick={() => onReroll?.()} />
    <Button size="lg" style="ghost" class="flex-1" label="Use original" onclick={() => onOriginal?.()} />
    <Button size="lg" variant="primary" class="flex-1" label={`Use take ${selected + 1}`} />
  </div>
</section>

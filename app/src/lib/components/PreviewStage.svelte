<script lang="ts">
import { Badge, Button, Card } from '@rokkit/ui';
import PreviewRender from './illustrations/PreviewRender.svelte';
let { label, darker = false, onNextScene, onToggleEngraving, onMake }: {
  label: string; darker?: boolean; onNextScene?: () => void; onToggleEngraving?: () => void; onMake?: () => void;
} = $props();
</script>
<section aria-label="Preview" class="relative flex flex-col">
  <div class="relative h-105 overflow-hidden">
    <PreviewRender />
    <Badge variant="primary" class="absolute left-4 top-4">AI preview · Muse Image</Badge>
    <Badge class="absolute right-4 top-4">render placeholder</Badge>
  </div>
  <Card class="m-3 -mt-16 relative">
    <div class="flex flex-col gap-3">
      <p>{label}</p>
      <div class="flex flex-wrap gap-2">
        <Button style="outline" size="sm" icon="i-solar:refresh-linear" label="Try another scene" onclick={() => onNextScene?.()} />
        <Button style="outline" size="sm" label={darker ? 'Lighter engraving' : 'Darker engraving'} aria-pressed={darker} onclick={() => onToggleEngraving?.()} />
      </div>
      <Button size="lg" variant="primary" class="w-full" label="Make it" onclick={() => onMake?.()} />
    </div>
  </Card>
</section>

<script lang="ts">
import { Badge, Button, Card, Pill } from '@rokkit/ui';
import PreviewRender from './illustrations/PreviewRender.svelte';
let { label, onMake }: { label: string; onMake?: () => void } = $props();
</script>
<section aria-label="Preview" class="relative flex flex-col">
  <div class="relative h-105 overflow-hidden">
    <PreviewRender />
    <Badge variant="primary" class="absolute left-4 top-4">AI preview · Muse Image</Badge>
    <Badge class="absolute right-4 top-4">render placeholder</Badge>
  </div>
  <Card class="m-3 -mt-16 relative">
    <div class="flex flex-col gap-3">
      <p>{label || "Here's how it'll look in birch. Four Ø 95 mm coasters, M engraved at 60 mm."}</p>
      <div class="flex gap-2"><Pill value="Try another scene" /><Pill value="Darker engraving" /></div>
      <Button size="lg" variant="primary" class="w-full" label="Make it" onclick={() => onMake?.()} />
    </div>
  </Card>
</section>

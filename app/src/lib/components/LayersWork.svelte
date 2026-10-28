<script lang="ts">
import type { Snippet } from 'svelte';
import { Button } from '@rokkit/ui';
// Work area for an image → layers step: the image (or the collection), an optional strip, and Previous / Next.
let { children, strip, prev = null, nextLabel, onNext }: {
  children: Snippet; strip?: Snippet; prev?: { href: string; label: string } | null; nextLabel: string; onNext: () => void;
} = $props();
</script>
<div class="mx-auto w-full max-w-[430px] md:max-w-[920px] p-4 md:p-6 flex flex-col gap-4">
  <div class="grid-bed rounded-lg border border-paper-edge p-3 md:p-6">{@render children()}</div>
  {#if strip}{@render strip()}{/if}
  <div class="flex items-center justify-between gap-2.5">
    {#if prev}<Button target="" href={prev.href} style="ghost" icon="i-solar:arrow-left-linear" label={prev.label} />{:else}<span></span>{/if}
    <Button variant="primary" size="lg" iconRight="i-solar:arrow-right-linear" label={nextLabel} onclick={onNext} />
  </div>
</div>

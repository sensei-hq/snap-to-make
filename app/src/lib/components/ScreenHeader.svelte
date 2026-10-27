<script lang="ts">
import { Pill } from '@rokkit/ui';
import { ThemeSwitcherToggle } from '@rokkit/app';
import BurnEMark from './BurnEMark.svelte';
let { title, subtitle = '', pill = '' }: { title: string; subtitle?: string; pill?: string } = $props();
</script>
<header class="h-14 shrink-0 flex items-center gap-2.5 pl-4 pr-2 bg-paper-soft hair-b">
  <BurnEMark class="text-ink shrink-0" />
  <div class="flex-1 min-w-0">
    <h1 class="font-heading text-lede font-normal leading-tight truncate">{title}</h1>
    {#if subtitle}<p class="meta truncate">{subtitle}</p>{/if}
  </div>
  {#if pill}<Pill value={pill} class="meta" />{/if}
  <ThemeSwitcherToggle variant="single" />
</header>

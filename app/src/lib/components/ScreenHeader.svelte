<script lang="ts">
import { resolve } from '$app/paths';
import { Pill } from '@rokkit/ui';
import { ThemeSwitcherToggle } from '@rokkit/app';
import KatachiMark from './KatachiMark.svelte';
let { title, subtitle = '', pill = '' }: { title: string; subtitle?: string; pill?: string } = $props();
</script>
<header class="h-14 shrink-0 flex items-center gap-2.5 pl-4 pr-2 bg-paper-soft hair-b">
  <KatachiMark class="text-ink shrink-0" />
  <div class="flex-1 min-w-0">
    <h1 class="font-heading text-lede font-normal leading-tight truncate">{title}</h1>
    {#if subtitle}<p class="meta truncate">{subtitle}</p>{/if}
  </div>
  {#if pill}<a href={resolve('/snap/hood')} title="Under the hood" class="no-underline hover:no-underline"><Pill value={pill} class="meta" /></a>{/if}
  <ThemeSwitcherToggle variant="single" />
</header>

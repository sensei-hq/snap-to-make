<script lang="ts">
import { resolve } from '$app/paths';
import { Button, Pill } from '@rokkit/ui';
import { ThemeSwitcherToggle } from '@rokkit/app';
let { title, subtitle = '', pill = '', onOpenChat }: { title: string; subtitle?: string; pill?: string; onOpenChat?: () => void } = $props();
</script>
<header class="h-14 shrink-0 flex items-center gap-2.5 pl-5 pr-2 bg-paper-soft hair-b">
  <div class="flex-1 min-w-0">
    <h1 class="font-heading text-lede font-normal leading-tight truncate">{title}</h1>
    {#if subtitle}<p class="meta truncate">{subtitle}</p>{/if}
  </div>
  {#if pill}<a href={resolve('/snap/hood')} title="Under the hood" class="no-underline hover:no-underline"><Pill value={pill} class="meta" /></a>{/if}
  {#if onOpenChat}<span class="md:hidden"><Button style="ghost" icon="i-solar:stars-minimalistic-linear" aria-label="Open Katachi chat" onclick={onOpenChat} /></span>{/if}
  <span class="md:hidden"><ThemeSwitcherToggle variant="single" /></span>
</header>

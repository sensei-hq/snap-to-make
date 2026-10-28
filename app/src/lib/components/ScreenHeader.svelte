<script lang="ts">
import type { Snippet } from 'svelte';
import { resolve } from '$app/paths';
import { Pill } from '@rokkit/ui';
import { ThemeSwitcherToggle } from '@rokkit/app';
import KatachiMark from './KatachiMark.svelte';
// Top bar (mockups D1–D6, 01–09): title + mono subtitle, the step tabs (studio), the cost pill.
// Phones get a back chevron (or the mark) and the theme toggle; the studio keeps both in the rail.
let { title, subtitle = '', pill = '', back = null, center }: { title: string; subtitle?: string; pill?: string; back?: string | null; center?: Snippet } = $props();
</script>
<header class="h-14 md:h-[54px] shrink-0 flex items-center gap-2.5 pl-4 pr-2 md:pl-5 bg-paper-soft hair-b">
  <span class="md:hidden -ml-1">
    {#if back}<a href={resolve(back as '/workshop')} aria-label="Back" class="grid place-items-center w-9 h-11 text-ink hover:no-underline"><span class="i-solar:alt-arrow-left-linear text-lede" aria-hidden="true"></span></a>
    {:else}<a href={resolve('/')} aria-label="About Katachi" class="grid place-items-center w-8 h-8 rounded-md bg-brand-tile"><KatachiMark size={20} /></a>{/if}
  </span>
  <div class="min-w-0 flex-1 md:flex-none md:w-[220px]">
    <h1 class="font-heading text-lede md:text-body font-normal leading-tight truncate">{title}</h1>
    {#if subtitle}<p class="meta truncate mt-0.5">{subtitle}</p>{/if}
  </div>
  <div class="lt-md:hidden flex-1 flex justify-center">{#if center}{@render center()}{/if}</div>
  {#if pill}<a href={resolve('/hood')} title="Under the hood" class="no-underline hover:no-underline"><Pill value={pill} class="meta" /></a>{/if}
  <a href={resolve('/settings')} aria-label="Settings" title="Settings" class="md:hidden grid place-items-center w-9 h-9 text-ink-soft hover:text-ink hover:no-underline"><span class="i-solar:settings-linear text-lede" aria-hidden="true"></span></a>
  <span class="md:hidden"><ThemeSwitcherToggle variant="single" /></span>
</header>

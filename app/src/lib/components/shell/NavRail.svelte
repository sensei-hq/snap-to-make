<script lang="ts">
import { resolve } from '$app/paths';
import { Button } from '@rokkit/ui';
import { ThemeSwitcherToggle } from '@rokkit/app';
import KatachiMark from '../KatachiMark.svelte';
import type { Section, Tool } from '$lib/content/sections';
// Studio (≥ md) section rail. Phone layouts use AppNav instead.
let { sections, tools = [], current, chatOpen, onToggleChat }: { sections: Section[]; tools?: Tool[]; current: string; chatOpen: boolean; onToggleChat: () => void } = $props();
</script>
<nav aria-label="Studio sections" class="w-14 shrink-0 flex flex-col items-center gap-1.5 py-3 bg-paper-soft border-r border-paper-edge">
  <a href={resolve('/')} aria-label="About Katachi" class="mb-2 grid place-items-center w-10 h-10 rounded-md bg-brand-tile"><KatachiMark size={26} /></a>
  {#each sections as s (s.id)}
    <Button target="" href={s.href} icon={s.icon} title={s.label} aria-label={s.label} aria-current={current === s.id ? 'page' : undefined}
      variant={current === s.id ? 'primary' : 'default'} style={current === s.id ? 'default' : 'ghost'} />
  {/each}
  <span class="w-5 h-px my-1.5 bg-paper-edge"></span>
  <Button style={chatOpen ? 'default' : 'ghost'} variant={chatOpen ? 'primary' : 'default'} icon="i-solar:chat-round-line-linear" title="Toggle Katachi chat" aria-label="Toggle Katachi chat" aria-pressed={chatOpen} onclick={onToggleChat} />
  <span class="flex-1"></span>
  {#each tools as t (t.id)}
    <Button target="" href={t.href} icon={t.icon} title={t.label} aria-label={t.label} aria-current={current === t.id ? 'page' : undefined}
      variant={current === t.id ? 'primary' : 'default'} style={current === t.id ? 'default' : 'ghost'} />
  {/each}
  <ThemeSwitcherToggle variant="single" />
</nav>

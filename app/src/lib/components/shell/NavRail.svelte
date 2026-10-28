<script lang="ts">
import { resolve } from '$app/paths';
import { Button } from '@rokkit/ui';
import { ThemeSwitcherToggle } from '@rokkit/app';
import KatachiMark from '../KatachiMark.svelte';
import type { Section, SectionId } from '$lib/content/sections';
// Studio (≥ md) section rail. Phone layouts use AppNav instead.
let { sections, current, chatOpen, onToggleChat }: { sections: Section[]; current: SectionId | ''; chatOpen: boolean; onToggleChat: () => void } = $props();
</script>
<nav aria-label="Studio sections" class="w-14 shrink-0 flex flex-col items-center gap-1.5 py-3 bg-paper-soft border-r border-paper-edge">
  <a href={resolve('/snap')} aria-label="Katachi home" class="mb-2"><KatachiMark size={26} class="text-ink" /></a>
  {#each sections as s (s.id)}
    <Button target="" href={s.href} icon={s.icon} title={s.label} aria-label={s.label} aria-current={current === s.id ? 'page' : undefined}
      variant={current === s.id ? 'primary' : 'default'} style={current === s.id ? 'default' : 'ghost'} />
  {/each}
  <span class="w-5 h-px my-1.5 bg-paper-edge"></span>
  <Button style={chatOpen ? 'default' : 'ghost'} variant={chatOpen ? 'primary' : 'default'} icon="i-solar:chat-round-line-linear" title="Toggle Katachi chat" aria-label="Toggle Katachi chat" aria-pressed={chatOpen} onclick={onToggleChat} />
  <span class="flex-1"></span>
  <ThemeSwitcherToggle variant="single" />
</nav>

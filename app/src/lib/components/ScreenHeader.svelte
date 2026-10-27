<script lang="ts">
let { title, subtitle = '', pill = '', onToggleMode }: { title: string; subtitle?: string; pill?: string; onToggleMode?: () => void } = $props();
</script>
<header class="flex items-start gap-3 px-5 pt-5 pb-4" style="border-bottom:1px solid var(--paper-edge)">
  <span aria-hidden="true" class="mt-1 grid place-items-center w-6 h-6 rounded-full shrink-0" style="border:1.5px solid var(--ink)"><span class="w-2 h-2 rounded-full" style="background:var(--accent)"></span></span>
  <div class="flex-1 min-w-0">
    <h1 class="font-display text-xl leading-tight">{title}</h1>
    {#if subtitle}<p class="mono text-xs" style="color:var(--ink-mute)">{subtitle}</p>{/if}
  </div>
  {#if pill}<span class="pill mono">{pill}</span>{/if}
  <button type="button" aria-label="Toggle dark mode" class="text-lg leading-none px-1" onclick={() => onToggleMode?.()}>☾</button>
</header>

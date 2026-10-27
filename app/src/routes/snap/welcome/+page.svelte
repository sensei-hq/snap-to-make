<script lang="ts">
import { SessionState } from '$lib/state/session.svelte';
import { UiState } from '$lib/state/ui.svelte';
const session = new SessionState();
const ui = new UiState();
async function enter() { if (await session.enterFromForm()) location.href = '/snap'; }
</script>
<div class="phone-col px-6 py-6">
  <div class="flex items-start justify-between">
    <span aria-hidden="true" class="grid place-items-center w-8 h-8 rounded-full" style="border:2px solid var(--ink)"><span class="w-2.5 h-2.5 rounded-full" style="background:var(--accent)"></span></span>
    <button type="button" aria-label="Toggle dark mode" class="text-xl" onclick={() => ui.toggleMode()}>☾</button>
  </div>
  <p class="font-display text-2xl mt-4">Burn-E</p>
  <p class="mono text-xs tracking-widest mt-8" style="color:var(--ink-mute)">SNAP → MAKE · DEMO</p>
  <h1 class="font-display mt-3" style="font-size:44px;line-height:1.08">Show it. Say it.<br />Burn it.</h1>
  <p class="mt-4 text-base" style="color:var(--ink-soft)">Point your phone at a sketch and the thing it must fit. Burn-E measures, designs and writes the cut file.</p>

  <label class="mono text-xs tracking-widest mt-8" for="invite" style="color:var(--ink-mute)">INVITE CODE</label>
  <input id="invite" aria-label="Invite code" bind:value={session.code} placeholder="MAKER-2026"
    class="mono mt-2 rounded-lg px-4 py-3.5 w-full" style="background:var(--paper);border:1px solid var(--accent);color:var(--ink)" />

  <div class="mt-6 flex flex-col">
    <label class="flex gap-3 py-3" style="border-top:1px solid var(--paper-edge)">
      <input type="checkbox" bind:checked={session.attested} class="mt-1 w-4 h-4" />
      <span><strong>I confirm I am 18+</strong><br /><span class="text-sm" style="color:var(--ink-mute)">Required by the Meta model terms.</span></span>
    </label>
    <label class="flex gap-3 py-3" style="border-top:1px solid var(--paper-edge)">
      <input type="checkbox" bind:checked={session.safetyAck} class="mt-1 w-4 h-4" />
      <span><strong>I'll never leave my laser unattended</strong><br /><span class="text-sm" style="color:var(--ink-mute)">Burn Watch is advisory — it can't stop a fire.</span></span>
    </label>
    <label class="flex gap-3 py-3" style="border-top:1px solid var(--paper-edge)">
      <input type="checkbox" bind:checked={session.noPersonalAck} class="mt-1 w-4 h-4" />
      <span><strong>No personal photos</strong><br /><span class="text-sm" style="color:var(--ink-mute)">The demo runs on free credits, so uploads may be used by Meta.</span></span>
    </label>
  </div>

  <div class="flex-1"></div>
  {#if session.msg}<p role="status">{session.msg}</p>{/if}
  <button type="button" class="btn-ink w-full mt-4" onclick={enter}>Enter the workshop</button>
  <p class="mono text-xs text-center mt-3" style="color:var(--ink-mute)">Muse models · on the Meta Model API</p>
</div>

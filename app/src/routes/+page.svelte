<script lang="ts">
import { Button } from '@rokkit/ui';
import { InputCheckbox, InputField } from '@rokkit/forms';
import { ThemeSwitcherToggle } from '@rokkit/app';
import KatachiMark from '$lib/components/KatachiMark.svelte';
import { useApp } from '$lib/state/context';
const session = useApp().session;
const consents = [
  { key: 'attested', label: 'I confirm I am 18+', hint: 'Required by the Meta model terms.' },
  { key: 'safetyAck', label: "I'll never leave my laser unattended", hint: "Burn Watch is advisory — it can't stop a fire." },
  { key: 'noPersonalAck', label: 'No personal photos', hint: 'The demo runs on free credits, so uploads may be used by Meta.' }
] as const;
async function enter() { if (await session.enterFromForm()) location.href = '/workshop'; }
</script>
<svelte:head><title>Katachi · Welcome</title></svelte:head>
<div class="phone-col relative">
  <ThemeSwitcherToggle variant="single" class="absolute top-2 right-2" />
  <div class="flex-1 flex flex-col px-6 pt-14">
    <p class="flex items-center gap-2.5"><span class="grid place-items-center w-10 h-10 rounded-md bg-brand-tile"><KatachiMark size={28} /></span><span class="font-heading text-title">Katachi</span></p>
    <p class="eyebrow mt-10">Snap → Make · demo</p>
    <h1 class="font-heading text-display font-normal tracking-display mt-3">Show it. Say it.<br />Burn it.</h1>
    <p class="mt-3.5 text-ink-mute">Point your phone at a sketch and the thing it must fit. Katachi measures, designs and writes the cut file.</p>
    <div class="mt-8 flex flex-col gap-5">
      <InputField name="invite" type="text" label="Invite code" placeholder="MAKER-2026" autocomplete="off" bind:value={session.code} />
      <div class="flex flex-col divide-y divide-paper-edge">
        {#each consents as c (c.key)}
          <label class="flex gap-3 items-start py-2.5 cursor-pointer">
            <InputCheckbox variant="default" name={c.key} bind:value={session[c.key]} />
            <span><span class="block font-medium">{c.label}</span><span class="block text-ui text-ink-mute">{c.hint}</span></span>
          </label>
        {/each}
      </div>
    </div>
  </div>
  <div class="px-6 pt-4 pb-8 flex flex-col gap-2.5">
    {#if session.msg}<p role="status" class="text-ui text-danger">{session.msg}</p>{/if}
    <Button size="lg" variant="primary" class="w-full" label="Enter the workshop" iconRight="i-solar:arrow-right-linear" onclick={enter} />
    <p class="meta text-center">Muse models · on the Meta Model API</p>
  </div>
</div>

<script lang="ts">
import { Button, Card, Timeline } from '@rokkit/ui';
import { InputField } from '@rokkit/forms';
import { BatchState } from '$lib/state/batch.svelte';
import ScreenHeader from '$lib/components/ScreenHeader.svelte';
import AppNav from '$lib/components/AppNav.svelte';
const batch = new BatchState();
let names = $state('Maya, Leo, Priya');
const steps = $derived((batch.job?.steps ?? []).map((s: string) => ({ label: s })));
</script>
<div class="phone-col">
  <ScreenHeader title="Batch project" subtitle="star ornaments · Muse Wonder" pill="background" />
  <AppNav current="batch" />
  <main class="px-5 py-4 flex flex-col gap-4">
    <p>Star ornaments, 3 inch, birch 3 mm — runs in the background, never blocks the workshop.</p>
    <InputField name="names" type="text" label="Names (comma separated)" bind:value={names} />
    <Button size="lg" variant="primary" icon="i-solar:play-linear" label="Start batch job" onclick={() => batch.start(names)} />
    {#if batch.job}<section aria-label="Production plan">
      <Card>
        {#snippet header()}<h2 class="panel-title">Production plan</h2>{/snippet}
        <Timeline items={steps} />
        {#snippet footer()}<p class="text-ui text-ink-mute">{batch.job?.plan}</p>{/snippet}
      </Card>
    </section>{/if}
  </main>
</div>

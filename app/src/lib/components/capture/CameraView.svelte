<script lang="ts">
import { onMount } from 'svelte';
import ViewfinderFeed from '../illustrations/ViewfinderFeed.svelte';
// Live camera via getUserMedia; a labelled drawn backdrop when there is no camera (or permission is refused).
let video = $state<HTMLVideoElement | null>(null);
let live = $state(false);
onMount(() => {
  let stream: MediaStream | null = null;
  navigator.mediaDevices?.getUserMedia?.({ video: { facingMode: 'environment' } })
    .then((s) => { stream = s; if (video) { video.srcObject = s; live = true; } })
    .catch(() => { live = false; });
  return () => stream?.getTracks().forEach((t) => t.stop());
});
/** The current frame as a JPEG data URL, or null when there is no live camera. */
export function grab(): string | null {
  if (!live || !video || !video.videoWidth) return null;
  const c = document.createElement('canvas');
  const scale = Math.min(1, 1600 / Math.max(video.videoWidth, video.videoHeight));
  c.width = Math.round(video.videoWidth * scale); c.height = Math.round(video.videoHeight * scale);
  c.getContext('2d')?.drawImage(video, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85);
}
</script>
<div class="absolute inset-0 bg-camera">
  <video bind:this={video} autoplay playsinline muted class="absolute inset-0 w-full h-full object-cover {live ? '' : 'hidden'}"></video>
  {#if !live}
    <ViewfinderFeed />
    <span class="absolute left-3 bottom-3 meta rounded-full bg-paper px-2.5 py-1">No camera · demo frames</span>
  {/if}
</div>

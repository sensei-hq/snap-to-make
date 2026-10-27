// Wraps the SvelteKit worker (adapter-cloudflare) — extension point for cron/scheduled handlers.
import worker from './.svelte-kit/cloudflare/_worker.js';
export default worker;

import adapterAuto from '@sveltejs/adapter-auto';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
const onCloudflare = Boolean(process.env.WORKERS_CI) || Boolean(process.env.CF_PAGES);
const adapter = onCloudflare ? adapterCloudflare({ config: 'wrangler.sveltekit.jsonc' }) : adapterAuto();
export default {
  kit: { adapter },
  vitePlugin: { dynamicCompileOptions: ({ filename }) => filename.includes('node_modules') ? undefined : { runes: true } }
};

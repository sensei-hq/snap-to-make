import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import UnoCSS from '@unocss/vite';
export default defineConfig({
  plugins: [UnoCSS(), sveltekit()],
  test: { include: ['src/**/*.{test,spec}.{ts,js}'], environment: 'jsdom', coverage: { provider: 'v8', include: ['src/lib/domain/**','src/lib/devices/**','src/lib/state/**'], thresholds: { lines: 90, functions: 85 } } }
});

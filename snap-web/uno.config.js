import { defineConfig } from 'unocss';
import { presetRokkit } from '@rokkit/unocss';
import config from './rokkit.config.js';
export default defineConfig({
  presets: [presetRokkit(config)],
  theme: {
    fontSize: { xs: ['11px','1.4'], sm: ['13px','1.5'], base: ['15px','1.6'], lg: ['17px','1.5'], xl: ['22px','1.2'], '2xl': ['28px','1.2'] },
    borderRadius: { sm: '4px', DEFAULT: '6px', lg: '10px', full: '9999px' }
  }
});

import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', timeout: 60000, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5174', trace: 'retain-on-failure', video: 'retain-on-failure', launchOptions: { args: ['--no-sandbox', '--disable-gpu'] } },
  webServer: { command: 'bun run dev', url: 'http://127.0.0.1:5174/', reuseExistingServer: true, timeout: 120000 }
});

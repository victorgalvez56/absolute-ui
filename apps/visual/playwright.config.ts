import { defineConfig } from '@playwright/test';

/**
 * Visual regression config.
 *
 * The webServer boots Ladle's static preview against the pre-built
 * `apps/ladle/build/` directory. Tests then hit each story URL in
 * ?mode=preview so the Ladle chrome is stripped — only the rendered
 * component is captured.
 *
 * Baselines live next to the spec file under
 * `tests/stories.spec.ts-snapshots/` and MUST be checked in.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm --dir ../ladle preview --port 4175',
    port: 4175,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

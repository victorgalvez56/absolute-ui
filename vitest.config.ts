import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Resolve react-native-web to its absolute entry point so the alias
// works from every importer regardless of cwd. Mirrors the approach in
// apps/ladle/.ladle/vite.config.mjs.
const rnwEntry = require.resolve('react-native-web');
const rnwRoot = dirname(require.resolve('react-native-web/package.json'));

// Reanimated stub: instant transitions for deterministic tests, same
// contract as the Ladle stub in apps/ladle/src/mocks/reanimated.ts.
const reanimatedStub = resolve(__dirname, 'packages/core/src/test-utils/reanimated.ts');

export default defineConfig({
  resolve: {
    alias: [
      // Exact entry: import {...} from 'react-native'
      { find: /^react-native$/, replacement: rnwEntry },
      // Sub-path: import x from 'react-native/Libraries/…'
      { find: /^react-native\//, replacement: `${rnwRoot}/` },
      // Reanimated stub — no Babel worklet plugin in Vitest.
      { find: /^react-native-reanimated$/, replacement: reanimatedStub },
    ],
  },
  test: {
    globals: false,
    environment: 'node',
    // .test.tsx files run in jsdom so @testing-library/react can render.
    // Existing .test.ts files stay in node — zero overhead change.
    environmentMatchGlobs: [['packages/*/src/**/*.test.tsx', 'jsdom']],
    include: ['packages/*/src/**/*.test.{ts,tsx}'],
    passWithNoTests: false,
  },
});

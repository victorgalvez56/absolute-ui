/**
 * Ladle auto-loads this file and merges it into its own Vite config.
 *
 * We alias `react-native` -> `react-native-web` so components from
 * `@absolute-ui/core` that import from `'react-native'` render in the
 * browser. `react-native` is excluded from `optimizeDeps` because
 * Vite's dep pre-bundler would otherwise try to parse the real
 * package (which ships Flow syntax) before the alias is applied.
 * `react-native-web` is explicitly included so it's still pre-bundled.
 *
 * `react-native-reanimated` is aliased to a local stub. Reanimated
 * requires a Babel/Metro worklet plugin that is unavailable in Vite.
 * The stub provides instant-transition equivalents of every Reanimated
 * API used by the motion layer so stories always show the correct final
 * visual state without needing the native worklet runtime.
 *
 * `__DEV__` is stamped because RN's runtime assumes the global exists.
 */
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve react-native-web to its absolute package path so both the
// dev server AND the Rollup production build can find it from every
// file in the monorepo. With pnpm workspaces, `react-native-web`
// lives at apps/ladle/node_modules — a bare-name replacement relies
// on Rollup walking up from each importer's directory, which works
// for dev but silently drops out during production builds. Pinning
// the replacement to the absolute package root sidesteps that.
const require = createRequire(import.meta.url);
const reactNativeWebRoot = dirname(require.resolve('react-native-web/package.json'));
// The package's "main" field points to the CJS build, which makes Vite
// pre-bundle a UMD shape that doesn't surface named exports (`View`,
// `Text`, etc.). The ESM build at `dist/index.js` exports them cleanly.
const reactNativeWebEntry = `${reactNativeWebRoot}/dist/index.js`;

// Absolute path to the Reanimated web stub — resolved from the config
// file location so it works regardless of where Vite is invoked from.
const reanimatedStub = resolve(__dirname, '../src/mocks/reanimated.ts');

export default {
  resolve: {
    alias: [
      // Exact-match entry import: import {...} from 'react-native'
      { find: /^react-native$/, replacement: reactNativeWebEntry },
      // Sub-path imports: import x from 'react-native/Libraries/…'
      { find: /^react-native\//, replacement: `${reactNativeWebRoot}/` },
      // Reanimated stub — must come after the react-native aliases so
      // the regex for react-native/ doesn't eat this package name.
      { find: /^react-native-reanimated$/, replacement: reanimatedStub },
    ],
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  optimizeDeps: {
    exclude: ['react-native', 'react-native-reanimated'],
    include: ['react-native-web', 'msw', 'msw/browser'],
  },
  define: {
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
};

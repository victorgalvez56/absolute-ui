import { defineConfig } from 'vite';

/**
 * Ladle uses Vite under the hood. We alias `react-native` to
 * `react-native-web` so components from `@absolute-ui/core` — which
 * import from `'react-native'` — render correctly in the browser
 * without any component-level platform branching.
 *
 * Also sets `__DEV__` because React Native's runtime assumes it exists
 * as a global; Vite's `define` stamps it into the bundle at build time.
 */
export default defineConfig({
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  define: {
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
});

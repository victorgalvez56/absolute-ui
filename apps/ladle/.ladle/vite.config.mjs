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
 * `__DEV__` is stamped because RN's runtime assumes the global exists.
 */
export default {
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  optimizeDeps: {
    exclude: ['react-native'],
    include: ['react-native-web'],
  },
  define: {
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
};

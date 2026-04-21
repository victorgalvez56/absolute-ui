/**
 * Storybook 8 web config for Absolute UI.
 *
 * The React Native primitives in `@absolute-ui/core` import from
 * `'react-native'`, which doesn't resolve in a browser. We alias
 * it to `react-native-web` so the real component tree renders in
 * the Storybook iframe (same trick the previous Ladle setup used).
 *
 * `__DEV__` is stamped into the bundle because RN's runtime
 * assumes the global exists; without it, some internal code paths
 * throw on first render.
 */
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  staticDirs: ['../public'],
  typescript: {
    reactDocgen: 'react-docgen',
  },
  async viteFinal(baseConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(baseConfig, {
      resolve: {
        // Alias `react-native` to `react-native-web` as a bare specifier
        // so Vite pre-bundles it through esbuild (which handles the CJS
        // transitive deps like `@react-native/normalize-colors`).
        alias: [
          { find: /^react-native$/, replacement: 'react-native-web' },
          { find: /^react-native\//, replacement: 'react-native-web/' },
        ],
        extensions: [
          '.web.tsx',
          '.web.ts',
          '.web.jsx',
          '.web.js',
          '.tsx',
          '.ts',
          '.jsx',
          '.js',
        ],
      },
      optimizeDeps: {
        include: [
          'react-native-web',
          '@react-native/normalize-colors',
          'styleq',
          'inline-style-prefixer',
          'memoize-one',
          'nullthrows',
          'postcss-value-parser',
          'fbjs',
        ],
      },
      define: {
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV ?? 'development',
        ),
      },
      esbuild: {
        // Force the automatic JSX runtime so story files don't need to
        // import React manually (and so Storybook's jsxDecorator doesn't
        // hit `React is not defined` when it re-renders a story).
        jsx: 'automatic',
      },
    });
  },
};

export default config;

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: { resolve: false },
  tsconfig: 'tsconfig.build.json',
  sourcemap: true,
  clean: true,
  target: 'es2022',
  treeshake: true,
  outDir: 'dist',
  // React, React Native, and sibling Absolute UI packages must stay as
  // runtime peer/sibling imports so consumers' bundlers dedupe them.
  external: ['react', 'react-native', '@absolute-ui/tokens', '@absolute-ui/a11y'],
});

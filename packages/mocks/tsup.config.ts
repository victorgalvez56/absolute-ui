import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    node: 'src/node.ts',
    browser: 'src/browser.ts',
    handlers: 'src/handlers.ts',
  },
  format: ['esm', 'cjs'],
  dts: { resolve: false },
  tsconfig: 'tsconfig.build.json',
  sourcemap: true,
  clean: true,
  target: 'es2022',
  treeshake: true,
  outDir: 'dist',
  external: ['msw', 'msw/node', 'msw/browser'],
});

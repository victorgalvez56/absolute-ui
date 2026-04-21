import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: { resolve: true },
  tsconfig: 'tsconfig.build.json',
  sourcemap: true,
  clean: true,
  target: 'es2022',
  treeshake: true,
  outDir: 'dist',
});

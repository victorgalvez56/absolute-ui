import type { NextConfig } from 'next';

/**
 * Next.js config for the Absolute UI documentation site.
 *
 * `transpilePackages` lets Next's bundler transpile the workspace
 * `@absolute-ui/tokens` package directly. The package ships ESM
 * from `dist/` so this is a belt-and-suspenders guard in case a
 * consumer imports it before its tsc build has run.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@absolute-ui/tokens'],
};

export default nextConfig;

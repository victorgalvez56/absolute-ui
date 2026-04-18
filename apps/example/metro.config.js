const path = require('node:path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Monorepo-aware Metro configuration.
 *
 * Two must-dos so Metro sees the whole pnpm workspace:
 *
 * 1. `watchFolders`: Metro only watches the app's own cwd by default, so
 *    edits inside ../../packages/core/src/* would never trigger an HMR
 *    reload. Pointing it at the repo root fixes that for every sibling.
 *
 * 2. `nodeModulesPaths`: pnpm hoists shared deps (react, react-native,
 *    react-native-safe-area-context, etc.) into the repo's root
 *    node_modules and keeps this app's own copies as symlinks. Metro's
 *    resolver defaults to walking up from the app's node_modules only —
 *    explicitly listing both paths avoids "Unable to resolve module"
 *    errors when a transitive import lands on the root-hoisted copy.
 */
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/** @type {import('@react-native/metro-config').MetroConfig} */
const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    // Don't let the resolver accidentally follow symlinks outside the
    // workspace (e.g. pnpm's .pnpm store) and load duplicate React
    // copies — that's the top cause of "Invalid hook call" on RN.
    disableHierarchicalLookup: false,
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);

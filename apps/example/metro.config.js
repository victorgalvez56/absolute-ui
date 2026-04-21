const path = require('node:path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

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
    // Pin every single-instance dep to the app's copy so the workspace
    // packages (@absolute-ui/core etc.) and the app render against the
    // same React — the top cause of "dispatcher.useContext is null"
    // and "Invalid hook call" in a pnpm monorepo.
    extraNodeModules: new Proxy(
      {},
      {
        // Proxy every bare-specifier lookup into apps/example/node_modules.
        // pnpm's nested .pnpm/<pkg>@<ver>/node_modules layout means a
        // library deep inside the store can't walk up the tree to reach
        // the app's hoisted copies of react, hoist-non-react-statics,
        // etc. The proxy defaults every miss to the app's node_modules
        // so any bare specifier resolves there first.
        get: (_target, name) => {
          return path.resolve(projectRoot, 'node_modules', String(name));
        },
      },
    ),
    // Block every react copy outside apps/example/node_modules so the
    // hierarchical lookup never lands on packages/core's own react@18
    // symlink. Without this block, Metro's default resolver walks up
    // from each file and finds core/node_modules/react before the
    // extraNodeModules alias kicks in, producing two React instances
    // in the same bundle → dispatcher.useContext is null.
    blockList: [
      new RegExp(`${path.resolve(workspaceRoot, 'packages')}/[^/]+/node_modules/react/.*`),
      new RegExp(`${path.resolve(workspaceRoot, 'packages')}/[^/]+/node_modules/react-native/.*`),
    ],
    disableHierarchicalLookup: false,
  },
};

/**
 * Storybook on-device uses `require.context` inside
 * `.storybook/storybook.requires.ts` to discover story files. Metro
 * doesn't support that out of the box — the wrapper below teaches
 * it by adding a custom resolver. The wrapper is a no-op when
 * STORYBOOK isn't set in the env, so the normal app build stays
 * lean and unaffected.
 */
module.exports = withStorybook(mergeConfig(getDefaultConfig(projectRoot), config), {
  enabled: process.env.STORYBOOK === '1',
  configPath: path.resolve(projectRoot, '.storybook'),
});

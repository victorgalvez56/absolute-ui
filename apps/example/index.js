/**
 * @format
 *
 * Conditional entry point. When Metro is started with `STORYBOOK=1`
 * (via `pnpm storybook` / `pnpm storybook:ios` / `pnpm storybook:android`)
 * we register the on-device Storybook root; otherwise we register
 * the normal Showcase app. Using `require(...)` (rather than a
 * top-level import) means the storybook bundle is not pulled into
 * the normal app's tree — each mode stays tree-shakable on its own.
 */

// Must load before AppRegistry. react-native-gesture-handler patches
// the native gesture-manager registration; Storybook React Native's
// on-device UI shell swipes between story list and preview, so it
// needs the handler ready before any RN root mounts.
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

const STORYBOOK_ENABLED = process.env.STORYBOOK === '1';

AppRegistry.registerComponent(appName, () =>
  STORYBOOK_ENABLED ? require('./.storybook').default : require('./App').default,
);

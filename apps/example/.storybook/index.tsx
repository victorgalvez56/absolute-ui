/**
 * On-device Storybook root.
 *
 * In Storybook React Native 8, `view.getStorybookUI(...)` returns
 * the full React component tree Storybook needs to mount — including
 * its own SafeArea / StatusBar handling. Wrapping it in additional
 * providers at this layer was the source of the "Element type is
 * invalid" render error: the provider chain went around a module
 * object instead of a pure function component.
 *
 * The theme + a11y preferences that each story renders against are
 * instead injected via a preview decorator (see ./preview.tsx) so
 * SB's own lifecycle stays the outermost thing React mounts.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  shouldPersistSelection: true,
});

export default StorybookUIRoot;

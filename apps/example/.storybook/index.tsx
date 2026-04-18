/**
 * On-device Storybook root.
 *
 * Mirrors the provider stack of `App.tsx` (SafeAreaProvider +
 * AbsoluteUIContext.Provider) so every story renders with the same
 * theme + a11y contract the real app uses. Swapping the `themes.*`
 * default here is the quickest way to audit a story against a
 * different personality without touching the story code.
 *
 * Storybook React Native 8 exposes `getStorybookUI` through the
 * `view` returned by `start(...)` (see `./storybook.requires.ts`),
 * not as a top-level export — so we import `view` and delegate.
 * Persists the last-selected story across reloads via AsyncStorage,
 * which is why `@react-native-async-storage/async-storage` is a
 * hard dependency of the storybook mode.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { view } from './storybook.requires';

const StorybookUI = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  shouldPersistSelection: true,
});

function StorybookUIRoot() {
  const theme = themes.aurora;
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
        <StorybookUI />
      </AbsoluteUIContext.Provider>
    </SafeAreaProvider>
  );
}

export default StorybookUIRoot;

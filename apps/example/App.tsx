/**
 * Absolute UI example app — entry point.
 *
 * Wraps the Showcase tour in an AbsoluteUIContext so every primitive
 * resolves its theme + a11y preferences, plus a tiny theme-cycler
 * state driver so the trailing button in the nav bar can rotate
 * through aurora / obsidian / frost / sunset at runtime. That's the
 * on-device validation loop: tap, scroll, toggle, see each theme.
 */
import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext } from '@absolute-ui/core';
import { type ThemeName, themes } from '@absolute-ui/tokens';
import { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShowcaseScreen, themeCycleOrder } from './src/ShowcaseScreen';

function App() {
  const [themeName, setThemeName] = useState<ThemeName>('aurora');
  const theme = useMemo(() => themes[themeName], [themeName]);

  const cycleTheme = useCallback(() => {
    setThemeName((current) => {
      const index = themeCycleOrder.indexOf(current);
      const next = themeCycleOrder[(index + 1) % themeCycleOrder.length];
      return next ?? themeCycleOrder[0] ?? 'aurora';
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
        <ShowcaseScreen theme={theme} onCycleTheme={cycleTheme} />
      </AbsoluteUIContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;

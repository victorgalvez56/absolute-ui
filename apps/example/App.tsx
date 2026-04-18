/**
 * Absolute UI example app — entry point.
 *
 * Minimal scaffold: wraps the tree in an AbsoluteUIContext so the
 * primitives resolve their theme + a11y preferences, and renders a
 * GlassSurface smoke test to confirm the monorepo symlink to
 * @absolute-ui/core actually resolves under Metro's bundler.
 *
 * The richer "Showcase" screen that exercises every primitive +
 * theme switcher lives in ./src/screens/Showcase.tsx (added in the
 * next commit). Keeping App.tsx tiny here so hydration errors
 * surface as import failures instead of layout bugs.
 */
import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import { StatusBar, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function App() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? themes.obsidian : themes.frost;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
        <AppContent />
      </AbsoluteUIContext.Provider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <Text style={styles.title}>Absolute UI</Text>
      <Text style={styles.subtitle}>Liquid glass design system — example app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#0b0b12',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9aa0b4',
    fontSize: 14,
    marginTop: 4,
  },
});

export default App;

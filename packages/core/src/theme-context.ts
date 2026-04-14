import { type AccessibilityPreferences, defaultPreferences } from '@absolute-ui/a11y';
import { type Theme, defaultTheme } from '@absolute-ui/tokens';
import { createContext, useContext } from 'react';

/**
 * Runtime theme bundle. A `ThemeProvider` (added later) supplies the
 * resolved `Theme` plus the user's current `AccessibilityPreferences`.
 * Primitives never read from React Native's `AccessibilityInfo`
 * directly — they read from this context so web stories, unit tests,
 * and the eventual native app can all inject preferences the same way.
 */
export type AbsoluteUIContextValue = {
  theme: Theme;
  preferences: AccessibilityPreferences;
};

export const defaultContextValue: AbsoluteUIContextValue = {
  theme: defaultTheme,
  preferences: defaultPreferences,
};

export const AbsoluteUIContext = createContext<AbsoluteUIContextValue>(defaultContextValue);

export function useAbsoluteUI(): AbsoluteUIContextValue {
  return useContext(AbsoluteUIContext);
}

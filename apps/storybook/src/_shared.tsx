/**
 * Shared bits for Storybook stories: a theme-aware backdrop card
 * plus a `Swatch` that renders one demo against each of the four
 * personalities so designers can eyeball the full matrix without
 * flipping the toolbar between every story.
 */
import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import type { ReactNode } from 'react';

export function Backdrop({
  theme,
  minHeight = 240,
  children,
}: {
  theme: Theme;
  minHeight?: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 32,
        borderRadius: 20,
        minHeight,
        background: theme.dark
          ? 'radial-gradient(1200px at 20% 10%, #7a5cff 0%, #0f1020 60%)'
          : 'radial-gradient(1200px at 20% 10%, #ffc36b 0%, #f6eede 60%)',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}

export function ThemedProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: ReactNode;
}) {
  return (
    <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
      {children}
    </AbsoluteUIContext.Provider>
  );
}

export function PersonalitiesGrid({
  minHeight,
  columns = 2,
  minColumnWidth = 320,
  render,
}: {
  minHeight?: number;
  columns?: number;
  minColumnWidth?: number;
  render: (theme: Theme) => ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(${minColumnWidth}px, 1fr))`,
        gap: 24,
      }}
    >
      {Object.values(themes).map((theme) => (
        <ThemedProvider key={theme.name} theme={theme}>
          <Backdrop theme={theme} minHeight={minHeight}>
            <div
              style={{
                color: theme.colors.textPrimary,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
                marginBottom: 16,
                opacity: 0.7,
              }}
            >
              {theme.label}
            </div>
            {render(theme)}
          </Backdrop>
        </ThemedProvider>
      ))}
    </div>
  );
}

export { themes };

/**
 * Global preview config — one decorator wraps every story so each
 * one gets:
 *   1. An AbsoluteUIContext with the personality chosen from the
 *      toolbar (Aurora / Obsidian / Frost / Sunset).
 *   2. A theme-aware photographic backdrop so glass recipes are
 *      actually visible (otherwise the blur has nothing to blur).
 *   3. The MSW worker, booted once so stories that fetch from
 *      `https://api.absolute-ui.dev/v1/*` hit deterministic mocks.
 *
 * Individual stories can still mount their own provider (the
 * "AllPersonalities" grids do), which cleanly overrides this one.
 */
import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { worker } from '@absolute-ui/mocks/browser';
import type { Decorator, Preview } from '@storybook/react';
import React, { useEffect, useState } from 'react';

let workerStartPromise: Promise<unknown> | null = null;

function startWorkerOnce(): Promise<unknown> {
  if (workerStartPromise) return workerStartPromise;
  workerStartPromise = worker
    .start({
      serviceWorker: { url: './mockServiceWorker.js' },
      onUnhandledRequest: 'bypass',
    })
    .catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.warn('[absolute-ui/mocks] worker failed to start', err);
    });
  return workerStartPromise;
}

const IS_DEV =
  (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV ?? false;

function themeGradient(theme: Theme): string {
  switch (theme.name) {
    case 'aurora':
      return 'radial-gradient(1200px at 20% 10%, #7a5cff 0%, #0f1020 60%)';
    case 'obsidian':
      return 'radial-gradient(1200px at 20% 10%, #5b2ea8 0%, #05050a 70%)';
    case 'frost':
      return 'radial-gradient(1200px at 20% 10%, #cfe7ff 0%, #f3f8ff 60%)';
    case 'sunset':
      return 'radial-gradient(1200px at 20% 10%, #ffc36b 0%, #f6eede 60%)';
    default:
      return theme.colors.background;
  }
}

function MockReady({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!IS_DEV);
  useEffect(() => {
    if (!IS_DEV) return;
    let cancelled = false;
    startWorkerOnce().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (!ready) return null;
  return <>{children}</>;
}

const withThemeAndBackdrop: Decorator = (Story, context) => {
  const personality = (context.globals.personality as keyof typeof themes) ?? 'aurora';
  const background = (context.globals.background as 'themed' | 'flat' | 'none') ?? 'themed';
  const theme = themes[personality] ?? themes.aurora;

  const style: React.CSSProperties = {
    minHeight: '100vh',
    padding: 24,
    boxSizing: 'border-box',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif',
    color: theme.colors.textPrimary,
    background:
      background === 'none'
        ? 'transparent'
        : background === 'flat'
          ? theme.colors.background
          : themeGradient(theme),
  };

  return (
    <MockReady>
      <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
        <div data-personality={theme.name} style={style}>
          <Story />
        </div>
      </AbsoluteUIContext.Provider>
    </MockReady>
  );
};

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Welcome',
          'Tokens',
          ['Themes'],
          'Primitives',
          ['GlassSurface', 'GlassButton', 'GlassInput', 'GlassCard'],
          'Screens',
        ],
      },
    },
    backgrounds: { disable: true },
  },
  globalTypes: {
    personality: {
      name: 'Personality',
      description: 'Active Absolute UI theme personality',
      defaultValue: 'aurora',
      toolbar: {
        icon: 'paintbrush',
        title: 'Personality',
        items: [
          { value: 'aurora', title: 'Aurora', right: '🌌' },
          { value: 'obsidian', title: 'Obsidian', right: '🪨' },
          { value: 'frost', title: 'Frost', right: '❄️' },
          { value: 'sunset', title: 'Sunset', right: '🌇' },
        ],
        dynamicTitle: true,
      },
    },
    background: {
      name: 'Backdrop',
      description: 'Backdrop used behind the component',
      defaultValue: 'themed',
      toolbar: {
        icon: 'photo',
        title: 'Backdrop',
        items: [
          { value: 'themed', title: 'Photographic gradient' },
          { value: 'flat', title: 'Flat theme background' },
          { value: 'none', title: 'Transparent' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withThemeAndBackdrop],
};

export default preview;

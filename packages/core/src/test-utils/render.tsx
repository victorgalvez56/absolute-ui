/**
 * Render helpers for @testing-library/react tests in packages/core.
 *
 * All Phase 2 components read from AbsoluteUIContext, so every render
 * must be wrapped. The `wrapper` option makes rerender() calls automatic
 * re-wrap for free.
 */
import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { AbsoluteUIContext, defaultContextValue } from '../theme-context.js';
import type { AbsoluteUIContextValue } from '../theme-context.js';

type ThemeRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  /** Override the context value — useful for reducedMotion / reducedTransparency tests. */
  contextValue?: AbsoluteUIContextValue;
};

export function renderWithTheme(
  ui: React.ReactElement,
  { contextValue = defaultContextValue, ...options }: ThemeRenderOptions = {},
): RenderResult {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AbsoluteUIContext.Provider value={contextValue}>
        {children}
      </AbsoluteUIContext.Provider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}

export { fireEvent, screen, act, cleanup } from '@testing-library/react';
export { defaultContextValue };
export type { AbsoluteUIContextValue };

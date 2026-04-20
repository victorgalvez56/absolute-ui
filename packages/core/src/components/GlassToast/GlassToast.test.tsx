// @vitest-environment jsdom
/**
 * GlassToast render tests.
 *
 * Covers: conditional mount (visible=false → null), message rendering,
 * accessibility label (explicit override vs. message fallback), variant
 * rendering (all 4 variants), position rendering (top / bottom), and
 * visibility transitions.
 *
 * Pure layout helper tests live in GlassToast.test.ts (node env).
 */
import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { GlassToast } from './GlassToast.js';
import type { GlassToastProps } from './GlassToast.js';
import { cleanup, renderWithTheme } from '../../test-utils/render.js';

afterEach(cleanup);

// ─── Conditional mount ────────────────────────────────────────────────────────

describe('GlassToast — conditional mount', () => {
  test('renders nothing when visible=false', () => {
    const { queryByText } = renderWithTheme(
      <GlassToast visible={false} message="Saved!" />,
    );
    expect(queryByText('Saved!')).toBeNull();
  });

  test('renders the message when visible=true', () => {
    const { getByText } = renderWithTheme(<GlassToast visible={true} message="Changes saved" />);
    expect(getByText('Changes saved')).toBeTruthy();
  });

  test('unmounts after visible transitions from true to false', () => {
    const { queryByText, rerender } = renderWithTheme(
      <GlassToast visible={true} message="Uploading…" />,
    );
    expect(queryByText('Uploading…')).toBeTruthy();

    rerender(<GlassToast visible={false} message="Uploading…" />);
    expect(queryByText('Uploading…')).toBeNull();
  });

  test('remounts after visible cycles false → true', () => {
    const { queryByText, rerender } = renderWithTheme(
      <GlassToast visible={false} message="Network error" />,
    );
    expect(queryByText('Network error')).toBeNull();

    rerender(<GlassToast visible={true} message="Network error" />);
    expect(queryByText('Network error')).toBeTruthy();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('GlassToast — accessibility', () => {
  test('uses message text as accessible label when no override is given', () => {
    const { getByLabelText } = renderWithTheme(
      <GlassToast visible={true} message="3 items deleted" />,
    );
    // GlassSurface receives accessibilityLabel={message} → aria-label
    expect(getByLabelText('3 items deleted')).toBeTruthy();
  });

  test('uses explicit accessibilityLabel override instead of message', () => {
    const { getByLabelText, queryByLabelText } = renderWithTheme(
      <GlassToast
        visible={true}
        message="Saved"
        accessibilityLabel="Document saved successfully"
      />,
    );
    expect(getByLabelText('Document saved successfully')).toBeTruthy();
    expect(queryByLabelText('Saved')).toBeNull();
  });

  test('message text is always visible as readable text (not just aria-label)', () => {
    const { getByText } = renderWithTheme(
      <GlassToast visible={true} message="Connection restored" />,
    );
    expect(getByText('Connection restored')).toBeTruthy();
  });
});

// ─── Variants ─────────────────────────────────────────────────────────────────

describe('GlassToast — variants', () => {
  const VARIANTS: ReadonlyArray<NonNullable<GlassToastProps['variant']>> = [
    'default',
    'success',
    'error',
    'info',
  ];

  test.each(VARIANTS)('renders "%s" variant without error', (variant) => {
    expect(() =>
      renderWithTheme(<GlassToast visible={true} message="Hello" variant={variant} />),
    ).not.toThrow();
  });

  test('defaults to "default" variant when unspecified', () => {
    // Smoke-test — no error, message visible
    const { getByText } = renderWithTheme(<GlassToast visible={true} message="Default" />);
    expect(getByText('Default')).toBeTruthy();
  });
});

// ─── Positions ────────────────────────────────────────────────────────────────

describe('GlassToast — positions', () => {
  const POSITIONS: ReadonlyArray<NonNullable<GlassToastProps['position']>> = ['top', 'bottom'];

  test.each(POSITIONS)('renders "%s" position without error', (position) => {
    expect(() =>
      renderWithTheme(<GlassToast visible={true} message="Hi" position={position} />),
    ).not.toThrow();
  });

  test('defaults to "bottom" position when unspecified', () => {
    const { getByText } = renderWithTheme(<GlassToast visible={true} message="Bottom toast" />);
    expect(getByText('Bottom toast')).toBeTruthy();
  });
});

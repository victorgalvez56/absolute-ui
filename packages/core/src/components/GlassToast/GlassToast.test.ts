/**
 * GlassToast unit tests.
 *
 * Pure-helper split (same pattern as GlassButton / GlassSurface): the
 * workspace vitest runs in plain node against `*.test.ts` only, so we
 * cover the layout math here and leave JSX wiring to Ladle play tests.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  TOAST_BOTTOM_INSET,
  TOAST_OUTER_PADDING,
  TOAST_PILL_GAP,
  TOAST_PILL_MAX_WIDTH,
  TOAST_PILL_PADDING_HORIZONTAL,
  TOAST_PILL_PADDING_VERTICAL,
  TOAST_STRIPE_HEIGHT,
  TOAST_STRIPE_WIDTH,
  TOAST_TOP_INSET,
  type ToastVariant,
  buildToastContainerStyle,
  buildToastMessageStyle,
  buildToastPillStyle,
  buildToastStripeStyle,
  resolveToastStripeColor,
} from './style.js';

describe('buildToastContainerStyle', () => {
  test("position 'top' sets top inset and omits bottom", () => {
    const style = buildToastContainerStyle('top');
    expect(style.top).toBe(TOAST_TOP_INSET);
    expect(style.top).toBe(24);
    expect(style.bottom).toBeUndefined();
    expect('bottom' in style).toBe(false);
  });

  test("position 'bottom' sets bottom inset and omits top", () => {
    const style = buildToastContainerStyle('bottom');
    expect(style.bottom).toBe(TOAST_BOTTOM_INSET);
    expect(style.bottom).toBe(32);
    expect(style.top).toBeUndefined();
    expect('top' in style).toBe(false);
  });

  test('shared layout fields are stable across positions', () => {
    for (const pos of ['top', 'bottom'] as const) {
      const style = buildToastContainerStyle(pos);
      expect(style.position).toBe('absolute');
      expect(style.left).toBe(0);
      expect(style.right).toBe(0);
      expect(style.alignItems).toBe('center');
      expect(style.paddingHorizontal).toBe(TOAST_OUTER_PADDING);
    }
  });
});

describe('buildToastPillStyle', () => {
  test('pill is a horizontally-laid, centered, capped row', () => {
    const style = buildToastPillStyle();
    expect(style.flexDirection).toBe('row');
    expect(style.alignItems).toBe('center');
    expect(style.gap).toBe(TOAST_PILL_GAP);
    expect(style.gap).toBe(12);
    expect(style.paddingHorizontal).toBe(TOAST_PILL_PADDING_HORIZONTAL);
    expect(style.paddingHorizontal).toBe(16);
    expect(style.paddingVertical).toBe(TOAST_PILL_PADDING_VERTICAL);
    expect(style.paddingVertical).toBe(12);
    expect(style.maxWidth).toBe(TOAST_PILL_MAX_WIDTH);
    expect(style.maxWidth).toBe(480);
  });
});

describe('buildToastStripeStyle', () => {
  test('renders a 4x24 fully-rounded pill in the supplied color', () => {
    const style = buildToastStripeStyle('#2FB26B');
    expect(style.width).toBe(TOAST_STRIPE_WIDTH);
    expect(style.width).toBe(4);
    expect(style.height).toBe(TOAST_STRIPE_HEIGHT);
    expect(style.height).toBe(24);
    expect(style.borderRadius).toBe(style.width / 2);
    expect(style.borderRadius).toBe(2);
    expect(style.backgroundColor).toBe('#2FB26B');
  });

  test('forwards the color verbatim (no normalization)', () => {
    expect(buildToastStripeStyle('rgba(0,0,0,0.5)').backgroundColor).toBe('rgba(0,0,0,0.5)');
    expect(buildToastStripeStyle('#ABC').backgroundColor).toBe('#ABC');
  });
});

describe('buildToastMessageStyle across personality themes', () => {
  const themes = [
    ['aurora', aurora],
    ['obsidian', obsidian],
    ['frost', frost],
    ['sunset', sunset],
  ] as const;

  test.each(themes)('uses the %s theme textPrimary color', (_name, theme) => {
    const style = buildToastMessageStyle(theme.colors.textPrimary);
    expect(style.color).toBe(theme.colors.textPrimary);
    expect(style.fontSize).toBe(14);
    expect(style.fontWeight).toBe('500');
    expect(style.flexShrink).toBe(1);
  });
});

describe('resolveToastStripeColor', () => {
  const ACCENT = '#A6F0E0';
  const cases: ReadonlyArray<readonly [ToastVariant, string]> = [
    ['success', '#2FB26B'],
    ['error', '#E05A3B'],
    ['info', '#4A8EE0'],
    ['default', ACCENT],
  ];

  test.each(cases)('variant %s resolves to %s', (variant, expected) => {
    expect(resolveToastStripeColor(variant, ACCENT)).toBe(expected);
  });

  test('semantic variants ignore the theme accent', () => {
    expect(resolveToastStripeColor('success', '#000000')).toBe('#2FB26B');
    expect(resolveToastStripeColor('error', '#000000')).toBe('#E05A3B');
    expect(resolveToastStripeColor('info', '#000000')).toBe('#4A8EE0');
  });
});

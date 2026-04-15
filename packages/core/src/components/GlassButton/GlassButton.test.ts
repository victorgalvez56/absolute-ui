import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
/**
 * GlassButton unit tests.
 *
 * Path chosen: OPTION 1 — extract pure helpers, test them in node.
 *
 * Why: the workspace vitest runs in a plain node environment against
 * `*.test.ts` files only. Adding `.test.tsx` would require jsdom +
 * @testing-library/react (new deps + env config) which the task
 * forbids without approval. Skipping tests entirely would leave the
 * hit-target floor, disabled-wins-over-pressed rule, and a11y label
 * fallback untested until Ladle interaction tests land — all three
 * are regressions waiting to happen, so a pure-function split is the
 * pragmatic middle ground and mirrors the GlassSurface pattern.
 *
 * The JSX render itself (Pressable wiring, GlassSurface composition)
 * is covered later by Ladle `play()` tests in a follow-up phase.
 */
import { describe, expect, test } from 'vitest';
import {
  MIN_HIT_TARGET,
  buildGlassButtonPressableStyle,
  buildGlassButtonTextStyle,
  isGlassButtonInteractive,
  resolveGlassButtonAccessibilityLabel,
  shouldWrapChildInText,
} from './style.js';

describe('buildGlassButtonPressableStyle', () => {
  test('enforces the 44x44 minimum hit target', () => {
    const style = buildGlassButtonPressableStyle({ pressed: false, disabled: false });
    expect(style.minWidth).toBe(MIN_HIT_TARGET);
    expect(style.minHeight).toBe(MIN_HIT_TARGET);
    expect(MIN_HIT_TARGET).toBe(44);
  });

  test('idle state is fully opaque', () => {
    expect(buildGlassButtonPressableStyle({ pressed: false, disabled: false }).opacity).toBe(1);
  });

  test('pressed state dims to 0.7', () => {
    expect(buildGlassButtonPressableStyle({ pressed: true, disabled: false }).opacity).toBe(0.7);
  });

  test('disabled dims to 0.4 regardless of pressed', () => {
    expect(buildGlassButtonPressableStyle({ pressed: false, disabled: true }).opacity).toBe(0.4);
    expect(buildGlassButtonPressableStyle({ pressed: true, disabled: true }).opacity).toBe(0.4);
  });

  test('centers content on both axes', () => {
    const style = buildGlassButtonPressableStyle({ pressed: false, disabled: false });
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('center');
  });
});

describe('buildGlassButtonTextStyle across personality themes', () => {
  const themes = [
    ['aurora', aurora],
    ['obsidian', obsidian],
    ['frost', frost],
    ['sunset', sunset],
  ] as const;

  test.each(themes)('uses the %s theme textPrimary color', (_name, theme) => {
    const style = buildGlassButtonTextStyle(theme.colors.textPrimary);
    expect(style.color).toBe(theme.colors.textPrimary);
    expect(style.fontSize).toBe(16);
    expect(style.fontWeight).toBe('600');
    expect(style.textAlign).toBe('center');
  });
});

describe('shouldWrapChildInText', () => {
  test('true for strings', () => {
    expect(shouldWrapChildInText('Save')).toBe(true);
    expect(shouldWrapChildInText('')).toBe(true);
  });

  test('false for non-strings', () => {
    expect(shouldWrapChildInText(42)).toBe(false);
    expect(shouldWrapChildInText(null)).toBe(false);
    expect(shouldWrapChildInText(undefined)).toBe(false);
    expect(shouldWrapChildInText({ type: 'Icon' })).toBe(false);
    expect(shouldWrapChildInText(['a', 'b'])).toBe(false);
  });
});

describe('isGlassButtonInteractive', () => {
  test('requires both a handler and non-disabled', () => {
    expect(isGlassButtonInteractive({ disabled: false, hasOnPress: true })).toBe(true);
    expect(isGlassButtonInteractive({ disabled: true, hasOnPress: true })).toBe(false);
    expect(isGlassButtonInteractive({ disabled: false, hasOnPress: false })).toBe(false);
    expect(isGlassButtonInteractive({ disabled: true, hasOnPress: false })).toBe(false);
  });
});

describe('resolveGlassButtonAccessibilityLabel', () => {
  test('explicit label wins over string child', () => {
    expect(
      resolveGlassButtonAccessibilityLabel({ accessibilityLabel: 'Share post', child: 'Share' }),
    ).toBe('Share post');
  });

  test('falls back to string child when label is omitted', () => {
    expect(
      resolveGlassButtonAccessibilityLabel({ accessibilityLabel: undefined, child: 'Share' }),
    ).toBe('Share');
  });

  test('returns undefined for node children without explicit label', () => {
    expect(
      resolveGlassButtonAccessibilityLabel({
        accessibilityLabel: undefined,
        child: { type: 'Icon' },
      }),
    ).toBeUndefined();
  });

  test('empty string label is respected (not treated as missing)', () => {
    expect(resolveGlassButtonAccessibilityLabel({ accessibilityLabel: '', child: 'Share' })).toBe(
      '',
    );
  });
});

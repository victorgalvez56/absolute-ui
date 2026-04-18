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
  FOCUS_RING_OFFSET,
  FOCUS_RING_WIDTH,
  MIN_HIT_TARGET,
  OUTLINE_BORDER_WIDTH,
  buildGlassButtonPressableStyle,
  buildGlassButtonTextStyle,
  isGlassButtonInteractive,
  resolveGlassButtonAccessibilityLabel,
  resolveGlassButtonColors,
  resolveGlassButtonSize,
  shouldWrapChildInText,
} from './style.js';

const FOCUS = '#A6F0E0';

describe('buildGlassButtonPressableStyle', () => {
  test('enforces the 44x44 minimum hit target', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: false,
      focusRingColor: FOCUS,
    });
    expect(style.minWidth).toBe(MIN_HIT_TARGET);
    expect(style.minHeight).toBe(MIN_HIT_TARGET);
    expect(MIN_HIT_TARGET).toBe(44);
  });

  test('idle state is fully opaque', () => {
    expect(
      buildGlassButtonPressableStyle({ pressed: false, disabled: false, focusRingColor: FOCUS })
        .opacity,
    ).toBe(1);
  });

  test('pressed state dims to 0.7', () => {
    expect(
      buildGlassButtonPressableStyle({ pressed: true, disabled: false, focusRingColor: FOCUS })
        .opacity,
    ).toBe(0.7);
  });

  test('disabled dims to 0.4 regardless of pressed', () => {
    expect(
      buildGlassButtonPressableStyle({ pressed: false, disabled: true, focusRingColor: FOCUS })
        .opacity,
    ).toBe(0.4);
    expect(
      buildGlassButtonPressableStyle({ pressed: true, disabled: true, focusRingColor: FOCUS })
        .opacity,
    ).toBe(0.4);
  });

  test('centers content on both axes', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: false,
      focusRingColor: FOCUS,
    });
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('center');
  });
});

describe('focus ring', () => {
  test('idle button has no outline', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: false,
      focused: false,
      focusRingColor: FOCUS,
    });
    expect(style.outlineStyle).toBe('none');
    expect(style.outlineWidth).toBe(0);
  });

  test('focused button renders the themed outline', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: false,
      focused: true,
      focusRingColor: FOCUS,
    });
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineWidth).toBe(FOCUS_RING_WIDTH);
    expect(style.outlineColor).toBe(FOCUS);
    expect(style.outlineOffset).toBe(FOCUS_RING_OFFSET);
  });

  test('disabled button suppresses the focus ring', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: true,
      focused: true,
      focusRingColor: FOCUS,
    });
    expect(style.outlineStyle).toBe('none');
    expect(style.outlineWidth).toBe(0);
  });

  test('focus ring still shows while the button is being pressed', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: true,
      disabled: false,
      focused: true,
      focusRingColor: FOCUS,
    });
    expect(style.outlineStyle).toBe('solid');
    expect(style.opacity).toBe(0.7);
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

  test('loading suppresses interaction even with a handler', () => {
    expect(isGlassButtonInteractive({ disabled: false, hasOnPress: true, loading: true })).toBe(
      false,
    );
    expect(isGlassButtonInteractive({ disabled: false, hasOnPress: true, loading: false })).toBe(
      true,
    );
  });
});

describe('resolveGlassButtonSize', () => {
  test('md defaults match the Phase 1 baseline', () => {
    const md = resolveGlassButtonSize('md');
    expect(md.paddingHorizontal).toBe(20);
    expect(md.paddingVertical).toBe(12);
    expect(md.fontSize).toBe(16);
  });

  test('sm shrinks padding and font but pressable keeps 44pt floor', () => {
    const sm = resolveGlassButtonSize('sm');
    expect(sm.paddingHorizontal).toBeLessThan(20);
    expect(sm.fontSize).toBeLessThan(16);
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: false,
      focusRingColor: FOCUS,
      size: 'sm',
    });
    expect(style.minWidth).toBe(MIN_HIT_TARGET);
    expect(style.minHeight).toBe(MIN_HIT_TARGET);
  });

  test('lg grows padding, font, and gap', () => {
    const md = resolveGlassButtonSize('md');
    const lg = resolveGlassButtonSize('lg');
    expect(lg.paddingHorizontal).toBeGreaterThan(md.paddingHorizontal);
    expect(lg.fontSize).toBeGreaterThan(md.fontSize);
    expect(lg.gap).toBeGreaterThan(md.gap);
  });

  test('defaults to md when size omitted', () => {
    expect(resolveGlassButtonSize()).toEqual(resolveGlassButtonSize('md'));
  });
});

describe('resolveGlassButtonColors', () => {
  const { aurora } = {
    aurora: {
      colors: {
        background: '#000',
        textPrimary: '#FFF',
        textSecondary: '#AAA',
        accent: '#1E9B82',
        onAccent: '#000',
        focusRing: '#A6F0E0',
        divider: '#333',
        danger: '#FF5A5F',
      },
    },
  };

  test('solid primary uses accent background + onAccent text', () => {
    const t = resolveGlassButtonColors({
      action: 'primary',
      variant: 'solid',
      colors: aurora.colors,
    });
    expect(t.background).toBe('#1E9B82');
    expect(t.foreground).toBe('#000');
    expect(t.useGlassSurface).toBe(true);
    expect(t.border).toBeUndefined();
    expect(t.underline).toBe(false);
  });

  test('solid danger uses the danger role', () => {
    const t = resolveGlassButtonColors({
      action: 'danger',
      variant: 'solid',
      colors: aurora.colors,
    });
    expect(t.background).toBe('#FF5A5F');
    expect(t.foreground).toBe('#000');
  });

  test('outline paints border in the action color, no background', () => {
    const t = resolveGlassButtonColors({
      action: 'primary',
      variant: 'outline',
      colors: aurora.colors,
    });
    expect(t.background).toBeUndefined();
    expect(t.border).toBe('#1E9B82');
    expect(t.foreground).toBe('#1E9B82');
    expect(t.useGlassSurface).toBe(true);
  });

  test('ghost drops the glass surface and has no background', () => {
    const t = resolveGlassButtonColors({
      action: 'primary',
      variant: 'ghost',
      colors: aurora.colors,
    });
    expect(t.useGlassSurface).toBe(false);
    expect(t.background).toBeUndefined();
    expect(t.border).toBeUndefined();
    expect(t.foreground).toBe('#1E9B82');
  });

  test('link drops the glass surface and underlines the text', () => {
    const t = resolveGlassButtonColors({
      action: 'primary',
      variant: 'link',
      colors: aurora.colors,
    });
    expect(t.useGlassSurface).toBe(false);
    expect(t.underline).toBe(true);
  });

  test('soft (default) uses body text color on glass', () => {
    const t = resolveGlassButtonColors({
      action: 'primary',
      variant: 'soft',
      colors: aurora.colors,
    });
    expect(t.background).toBeUndefined();
    expect(t.foreground).toBe('#FFF');
    expect(t.useGlassSurface).toBe(true);
  });

  test('neutral action picks textPrimary as the accent color', () => {
    const outline = resolveGlassButtonColors({
      action: 'neutral',
      variant: 'outline',
      colors: aurora.colors,
    });
    expect(outline.foreground).toBe('#FFF');
    expect(outline.border).toBe('#FFF');
  });
});

describe('buildGlassButtonPressableStyle variant wiring', () => {
  test('backgroundColor lands on the style when passed', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: false,
      focusRingColor: FOCUS,
      backgroundColor: '#1E9B82',
    });
    expect(style.backgroundColor).toBe('#1E9B82');
  });

  test('borderColor adds a hairline border at OUTLINE_BORDER_WIDTH', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: false,
      focusRingColor: FOCUS,
      borderColor: '#1E9B82',
    });
    expect(style.borderColor).toBe('#1E9B82');
    expect(style.borderWidth).toBe(OUTLINE_BORDER_WIDTH);
  });

  test('row layout + inter-slot gap enable Icon / Text / Spinner composition', () => {
    const style = buildGlassButtonPressableStyle({
      pressed: false,
      disabled: false,
      focusRingColor: FOCUS,
      size: 'md',
    });
    expect(style.flexDirection).toBe('row');
    expect(style.gap).toBe(resolveGlassButtonSize('md').gap);
  });
});

describe('buildGlassButtonTextStyle size + underline', () => {
  test('sm text scales down', () => {
    expect(buildGlassButtonTextStyle('#fff', 'sm').fontSize).toBe(14);
  });

  test('lg text scales up', () => {
    expect(buildGlassButtonTextStyle('#fff', 'lg').fontSize).toBe(18);
  });

  test('underline flag applies textDecorationLine', () => {
    expect(buildGlassButtonTextStyle('#fff', 'md', true).textDecorationLine).toBe('underline');
    expect(buildGlassButtonTextStyle('#fff', 'md', false).textDecorationLine).toBe('none');
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

/**
 * GlassInput unit tests — pure helpers only, same path as GlassButton.
 * The JSX layer (TextInput composition, focus state wiring) is
 * covered by Ladle interaction tests in a follow-up phase.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  ERROR_RING_WIDTH,
  FOCUS_RING_OFFSET,
  FOCUS_RING_WIDTH,
  MIN_HIT_TARGET,
  buildGlassInputContainerStyle,
  buildGlassInputHelperStyle,
  buildGlassInputLabelStyle,
  buildGlassInputTextStyle,
  isGlassInputInteractive,
  resolveGlassInputAccessibilityHint,
  resolveGlassInputAccessibilityLabel,
  resolveGlassInputAccessibilityState,
  resolveGlassInputPlaceholderColor,
  resolveGlassInputSize,
} from './style.js';

const FOCUS = '#A6F0E0';
const ERROR = '#E4572E';

describe('buildGlassInputContainerStyle', () => {
  test('enforces the 44dp minimum hit target', () => {
    const style = buildGlassInputContainerStyle({
      focused: false,
      disabled: false,
      invalid: false,
      focusRingColor: FOCUS,
      errorColor: ERROR,
    });
    expect(style.minHeight).toBe(MIN_HIT_TARGET);
    expect(MIN_HIT_TARGET).toBe(44);
  });

  test('idle state is fully opaque and has no outline', () => {
    const style = buildGlassInputContainerStyle({
      focused: false,
      disabled: false,
      invalid: false,
      focusRingColor: FOCUS,
      errorColor: ERROR,
    });
    expect(style.opacity).toBe(1);
    expect(style.outlineStyle).toBe('none');
    expect(style.outlineWidth).toBe(0);
  });

  test('disabled dims to 0.4 and suppresses any ring', () => {
    const focusedInvalidDisabled = buildGlassInputContainerStyle({
      focused: true,
      disabled: true,
      invalid: true,
      focusRingColor: FOCUS,
      errorColor: ERROR,
    });
    expect(focusedInvalidDisabled.opacity).toBe(0.4);
    expect(focusedInvalidDisabled.outlineStyle).toBe('none');
    expect(focusedInvalidDisabled.outlineWidth).toBe(0);
  });

  test('focus ring paints in focusRingColor', () => {
    const style = buildGlassInputContainerStyle({
      focused: true,
      disabled: false,
      invalid: false,
      focusRingColor: FOCUS,
      errorColor: ERROR,
    });
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineWidth).toBe(FOCUS_RING_WIDTH);
    expect(style.outlineColor).toBe(FOCUS);
    expect(style.outlineOffset).toBe(FOCUS_RING_OFFSET);
  });

  test('invalid (unfocused) paints the error ring in errorColor', () => {
    const style = buildGlassInputContainerStyle({
      focused: false,
      disabled: false,
      invalid: true,
      focusRingColor: FOCUS,
      errorColor: ERROR,
    });
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineWidth).toBe(ERROR_RING_WIDTH);
    expect(style.outlineColor).toBe(ERROR);
  });

  test('focus wins over invalid — focused+invalid shows the focus ring', () => {
    const style = buildGlassInputContainerStyle({
      focused: true,
      disabled: false,
      invalid: true,
      focusRingColor: FOCUS,
      errorColor: ERROR,
    });
    expect(style.outlineColor).toBe(FOCUS);
    expect(style.outlineWidth).toBe(FOCUS_RING_WIDTH);
  });
});

describe('text / placeholder / label / helper styles', () => {
  const themes = [
    ['aurora', aurora],
    ['obsidian', obsidian],
    ['frost', frost],
    ['sunset', sunset],
  ] as const;

  test.each(themes)('text style uses %s theme textPrimary', (_name, theme) => {
    const style = buildGlassInputTextStyle(theme.colors.textPrimary);
    expect(style.color).toBe(theme.colors.textPrimary);
    expect(style.fontSize).toBe(16);
    expect(style.fontWeight).toBe('400');
    expect(style.lineHeight).toBe(22);
  });

  test.each(themes)('placeholder uses %s theme textSecondary', (_name, theme) => {
    expect(resolveGlassInputPlaceholderColor(theme.colors.textSecondary)).toBe(
      theme.colors.textSecondary,
    );
  });

  test.each(themes)('label style uses %s theme textPrimary and is bold', (_name, theme) => {
    const style = buildGlassInputLabelStyle(theme.colors.textPrimary);
    expect(style.color).toBe(theme.colors.textPrimary);
    expect(style.fontWeight).toBe('600');
    expect(style.fontSize).toBe(13);
    expect(style.marginBottom).toBe(6);
  });

  test('helper style uses textSecondary when valid', () => {
    const style = buildGlassInputHelperStyle({
      textSecondary: '#888',
      errorColor: ERROR,
      invalid: false,
    });
    expect(style.color).toBe('#888');
  });

  test('helper style switches to errorColor when invalid', () => {
    const style = buildGlassInputHelperStyle({
      textSecondary: '#888',
      errorColor: ERROR,
      invalid: true,
    });
    expect(style.color).toBe(ERROR);
  });
});

describe('isGlassInputInteractive', () => {
  test('interactive requires editable AND non-disabled', () => {
    expect(isGlassInputInteractive({ disabled: false, editable: true })).toBe(true);
    expect(isGlassInputInteractive({ disabled: true, editable: true })).toBe(false);
    expect(isGlassInputInteractive({ disabled: false, editable: false })).toBe(false);
    expect(isGlassInputInteractive({ disabled: true, editable: false })).toBe(false);
  });
});

describe('resolveGlassInputAccessibilityLabel', () => {
  test('explicit accessibilityLabel wins', () => {
    expect(
      resolveGlassInputAccessibilityLabel({
        accessibilityLabel: 'Email address',
        label: 'Email',
        placeholder: 'you@example.com',
      }),
    ).toBe('Email address');
  });

  test('falls back to visible label', () => {
    expect(
      resolveGlassInputAccessibilityLabel({
        accessibilityLabel: undefined,
        label: 'Email',
        placeholder: 'you@example.com',
      }),
    ).toBe('Email');
  });

  test('falls back to placeholder when no label', () => {
    expect(
      resolveGlassInputAccessibilityLabel({
        accessibilityLabel: undefined,
        label: undefined,
        placeholder: 'you@example.com',
      }),
    ).toBe('you@example.com');
  });

  test('returns undefined when nothing is set', () => {
    expect(
      resolveGlassInputAccessibilityLabel({
        accessibilityLabel: undefined,
        label: undefined,
        placeholder: undefined,
      }),
    ).toBeUndefined();
  });

  test('empty string label is respected (not treated as missing)', () => {
    expect(
      resolveGlassInputAccessibilityLabel({
        accessibilityLabel: '',
        label: 'Email',
        placeholder: undefined,
      }),
    ).toBe('');
  });
});

describe('resolveGlassInputAccessibilityHint', () => {
  test('returns helper text when valid', () => {
    expect(
      resolveGlassInputAccessibilityHint({
        helperText: 'We never share your email.',
        errorText: undefined,
        invalid: false,
      }),
    ).toBe('We never share your email.');
  });

  test('returns error text when invalid', () => {
    expect(
      resolveGlassInputAccessibilityHint({
        helperText: undefined,
        errorText: 'Email is required',
        invalid: true,
      }),
    ).toBe('Email is required');
  });

  test('combines error and helper when both set, error first', () => {
    expect(
      resolveGlassInputAccessibilityHint({
        helperText: 'We never share your email.',
        errorText: 'Email is required',
        invalid: true,
      }),
    ).toBe('Email is required. We never share your email.');
  });

  test('ignores error text when invalid=false', () => {
    expect(
      resolveGlassInputAccessibilityHint({
        helperText: 'Hint',
        errorText: 'Stale error',
        invalid: false,
      }),
    ).toBe('Hint');
  });

  test('returns undefined when nothing to announce', () => {
    expect(
      resolveGlassInputAccessibilityHint({
        helperText: undefined,
        errorText: undefined,
        invalid: false,
      }),
    ).toBeUndefined();
  });

  test('ignores empty-string error when invalid', () => {
    expect(
      resolveGlassInputAccessibilityHint({
        helperText: 'Hint',
        errorText: '',
        invalid: true,
      }),
    ).toBe('Hint');
  });
});

describe('resolveGlassInputAccessibilityState', () => {
  test('editable + non-disabled → not disabled', () => {
    expect(resolveGlassInputAccessibilityState({ disabled: false, editable: true })).toEqual({
      disabled: false,
    });
  });

  test('disabled → disabled even if editable', () => {
    expect(resolveGlassInputAccessibilityState({ disabled: true, editable: true })).toEqual({
      disabled: true,
    });
  });

  test('non-editable → disabled even if not explicitly disabled', () => {
    expect(resolveGlassInputAccessibilityState({ disabled: false, editable: false })).toEqual({
      disabled: true,
    });
  });
});

describe('resolveGlassInputSize', () => {
  test('md defaults match the Phase 1 baseline', () => {
    const md = resolveGlassInputSize('md');
    expect(md.paddingHorizontal).toBe(16);
    expect(md.paddingVertical).toBe(12);
    expect(md.fontSize).toBe(16);
  });

  test('sm shrinks padding + font; 44pt minHeight preserved by container', () => {
    const sm = resolveGlassInputSize('sm');
    expect(sm.paddingHorizontal).toBeLessThan(16);
    expect(sm.fontSize).toBeLessThan(16);
    const container = buildGlassInputContainerStyle({
      focused: false,
      disabled: false,
      invalid: false,
      focusRingColor: FOCUS,
      errorColor: ERROR,
      size: 'sm',
    });
    expect(container.minHeight).toBe(MIN_HIT_TARGET);
  });

  test('lg grows padding + font + icon size', () => {
    const md = resolveGlassInputSize('md');
    const lg = resolveGlassInputSize('lg');
    expect(lg.paddingHorizontal).toBeGreaterThan(md.paddingHorizontal);
    expect(lg.fontSize).toBeGreaterThan(md.fontSize);
    expect(lg.iconSize).toBeGreaterThan(md.iconSize);
  });

  test('text lineHeight grows proportionally with fontSize', () => {
    const sm = buildGlassInputTextStyle('#fff', 'sm');
    const lg = buildGlassInputTextStyle('#fff', 'lg');
    expect(sm.lineHeight).toBeLessThan(lg.lineHeight);
  });

  test('container is laid out as a row so icon slots align with the text', () => {
    const style = buildGlassInputContainerStyle({
      focused: false,
      disabled: false,
      invalid: false,
      focusRingColor: FOCUS,
      errorColor: ERROR,
    });
    expect(style.flexDirection).toBe('row');
    expect(style.alignItems).toBe('center');
    expect(style.gap).toBeGreaterThan(0);
  });
});

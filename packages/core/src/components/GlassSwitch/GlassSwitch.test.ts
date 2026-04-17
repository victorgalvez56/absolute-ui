/**
 * GlassSwitch unit tests — pure helpers only. JSX wiring (Pressable,
 * focus callback) is covered by Ladle interaction tests in a
 * follow-up phase, same split GlassButton / GlassInput use.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  FOCUS_RING_OFFSET,
  FOCUS_RING_WIDTH,
  MIN_HIT_TARGET,
  THUMB_PADDING,
  THUMB_SIZE,
  TRACK_HEIGHT,
  TRACK_WIDTH,
  buildGlassSwitchLabelStyle,
  buildGlassSwitchThumbStyle,
  buildGlassSwitchTrackStyle,
  buildGlassSwitchWrapperStyle,
  isGlassSwitchInteractive,
  resolveGlassSwitchAccessibilityLabel,
  resolveGlassSwitchAccessibilityState,
  resolveNextSwitchValue,
} from './style.js';

const FOCUS = '#A6F0E0';
const CHECKED = '#4FD3B5';
const UNCHECKED = '#454957';
const THUMB = '#FFFFFF';

describe('track geometry', () => {
  test('track is a pill: borderRadius = half-height', () => {
    const style = buildGlassSwitchTrackStyle({
      checked: false,
      disabled: false,
      focused: false,
      checkedColor: CHECKED,
      uncheckedColor: UNCHECKED,
      focusRingColor: FOCUS,
    });
    expect(style.width).toBe(TRACK_WIDTH);
    expect(style.height).toBe(TRACK_HEIGHT);
    expect(style.borderRadius).toBe(TRACK_HEIGHT / 2);
  });

  test('unchecked paints the uncheckedColor', () => {
    expect(
      buildGlassSwitchTrackStyle({
        checked: false,
        disabled: false,
        focused: false,
        checkedColor: CHECKED,
        uncheckedColor: UNCHECKED,
        focusRingColor: FOCUS,
      }).backgroundColor,
    ).toBe(UNCHECKED);
  });

  test('checked paints the checkedColor', () => {
    expect(
      buildGlassSwitchTrackStyle({
        checked: true,
        disabled: false,
        focused: false,
        checkedColor: CHECKED,
        uncheckedColor: UNCHECKED,
        focusRingColor: FOCUS,
      }).backgroundColor,
    ).toBe(CHECKED);
  });
});

describe('track state priority (disabled > focused > idle)', () => {
  test('idle has no outline', () => {
    const style = buildGlassSwitchTrackStyle({
      checked: false,
      disabled: false,
      focused: false,
      checkedColor: CHECKED,
      uncheckedColor: UNCHECKED,
      focusRingColor: FOCUS,
    });
    expect(style.outlineStyle).toBe('none');
    expect(style.outlineWidth).toBe(0);
    expect(style.opacity).toBe(1);
  });

  test('focused paints the focus ring', () => {
    const style = buildGlassSwitchTrackStyle({
      checked: false,
      disabled: false,
      focused: true,
      checkedColor: CHECKED,
      uncheckedColor: UNCHECKED,
      focusRingColor: FOCUS,
    });
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineWidth).toBe(FOCUS_RING_WIDTH);
    expect(style.outlineColor).toBe(FOCUS);
    expect(style.outlineOffset).toBe(FOCUS_RING_OFFSET);
  });

  test('disabled dims to 0.4 and suppresses the focus ring', () => {
    const style = buildGlassSwitchTrackStyle({
      checked: true,
      disabled: true,
      focused: true,
      checkedColor: CHECKED,
      uncheckedColor: UNCHECKED,
      focusRingColor: FOCUS,
    });
    expect(style.opacity).toBe(0.4);
    expect(style.outlineStyle).toBe('none');
    expect(style.outlineWidth).toBe(0);
  });
});

describe('thumb geometry', () => {
  test('unchecked thumb sits padded from the left edge', () => {
    const style = buildGlassSwitchThumbStyle({ checked: false, thumbColor: THUMB });
    expect(style.position).toBe('absolute');
    expect(style.width).toBe(THUMB_SIZE);
    expect(style.height).toBe(THUMB_SIZE);
    expect(style.borderRadius).toBe(THUMB_SIZE / 2);
    expect(style.left).toBe(THUMB_PADDING);
  });

  test('checked thumb sits padded from the right edge', () => {
    const style = buildGlassSwitchThumbStyle({ checked: true, thumbColor: THUMB });
    expect(style.left).toBe(TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING);
  });

  test('thumb is vertically centered in the track', () => {
    const style = buildGlassSwitchThumbStyle({ checked: false, thumbColor: THUMB });
    expect(style.top).toBe((TRACK_HEIGHT - THUMB_SIZE) / 2);
  });

  test('thumb color is forwarded', () => {
    expect(
      buildGlassSwitchThumbStyle({ checked: false, thumbColor: '#FF5252' }).backgroundColor,
    ).toBe('#FF5252');
  });
});

describe('wrapper hit target', () => {
  test('enforces the 44dp floor on the tappable row', () => {
    const style = buildGlassSwitchWrapperStyle();
    expect(style.minHeight).toBe(MIN_HIT_TARGET);
    expect(MIN_HIT_TARGET).toBe(44);
  });

  test('lays label + track in a row with a gap', () => {
    const style = buildGlassSwitchWrapperStyle();
    expect(style.flexDirection).toBe('row');
    expect(style.alignItems).toBe('center');
    expect(style.gap).toBeGreaterThan(0);
  });
});

describe('label style across personalities', () => {
  const themes = [
    ['aurora', aurora],
    ['obsidian', obsidian],
    ['frost', frost],
    ['sunset', sunset],
  ] as const;

  test.each(themes)('%s label uses textPrimary', (_name, theme) => {
    const style = buildGlassSwitchLabelStyle(theme.colors.textPrimary);
    expect(style.color).toBe(theme.colors.textPrimary);
    expect(style.fontSize).toBe(15);
    expect(style.fontWeight).toBe('500');
  });
});

describe('isGlassSwitchInteractive', () => {
  test('requires both a handler and non-disabled', () => {
    expect(isGlassSwitchInteractive({ disabled: false, hasOnValueChange: true })).toBe(true);
    expect(isGlassSwitchInteractive({ disabled: true, hasOnValueChange: true })).toBe(false);
    expect(isGlassSwitchInteractive({ disabled: false, hasOnValueChange: false })).toBe(false);
    expect(isGlassSwitchInteractive({ disabled: true, hasOnValueChange: false })).toBe(false);
  });
});

describe('resolveGlassSwitchAccessibilityLabel', () => {
  test('explicit accessibilityLabel wins', () => {
    expect(
      resolveGlassSwitchAccessibilityLabel({
        accessibilityLabel: 'Toggle airplane mode',
        label: 'Airplane mode',
      }),
    ).toBe('Toggle airplane mode');
  });

  test('falls back to visible label', () => {
    expect(
      resolveGlassSwitchAccessibilityLabel({
        accessibilityLabel: undefined,
        label: 'Airplane mode',
      }),
    ).toBe('Airplane mode');
  });

  test('returns undefined when nothing is set', () => {
    expect(
      resolveGlassSwitchAccessibilityLabel({ accessibilityLabel: undefined, label: undefined }),
    ).toBeUndefined();
  });

  test('empty string label is respected', () => {
    expect(
      resolveGlassSwitchAccessibilityLabel({ accessibilityLabel: '', label: 'Airplane mode' }),
    ).toBe('');
  });
});

describe('resolveGlassSwitchAccessibilityState', () => {
  test('interactive + checked → checked true, disabled false', () => {
    expect(
      resolveGlassSwitchAccessibilityState({
        checked: true,
        disabled: false,
        hasOnValueChange: true,
      }),
    ).toEqual({ checked: true, disabled: false });
  });

  test('disabled flag forces disabled=true in a11y state', () => {
    expect(
      resolveGlassSwitchAccessibilityState({
        checked: true,
        disabled: true,
        hasOnValueChange: true,
      }),
    ).toEqual({ checked: true, disabled: true });
  });

  test('no handler is announced as disabled even if checked', () => {
    expect(
      resolveGlassSwitchAccessibilityState({
        checked: false,
        disabled: false,
        hasOnValueChange: false,
      }),
    ).toEqual({ checked: false, disabled: true });
  });
});

describe('resolveNextSwitchValue', () => {
  test('toggles when interactive', () => {
    expect(
      resolveNextSwitchValue({ checked: false, disabled: false, hasOnValueChange: true }),
    ).toBe(true);
    expect(resolveNextSwitchValue({ checked: true, disabled: false, hasOnValueChange: true })).toBe(
      false,
    );
  });

  test('returns current value unchanged when disabled', () => {
    expect(resolveNextSwitchValue({ checked: false, disabled: true, hasOnValueChange: true })).toBe(
      false,
    );
    expect(resolveNextSwitchValue({ checked: true, disabled: true, hasOnValueChange: true })).toBe(
      true,
    );
  });

  test('returns current value unchanged when decorative (no handler)', () => {
    expect(
      resolveNextSwitchValue({ checked: false, disabled: false, hasOnValueChange: false }),
    ).toBe(false);
  });
});

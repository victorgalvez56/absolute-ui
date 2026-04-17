/**
 * GlassSlider unit tests — pure helpers only, same split the rest of
 * Phase 3 uses. JSX wiring (onLayout measurement, keyboard handler)
 * is covered by Ladle interaction tests later.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  DEFAULT_STEP,
  FOCUS_RING_OFFSET,
  FOCUS_RING_WIDTH,
  MIN_HIT_TARGET,
  PAGE_MULTIPLIER,
  THUMB_SIZE,
  TRACK_HEIGHT,
  buildGlassSliderFilledStyle,
  buildGlassSliderLabelStyle,
  buildGlassSliderRowStyle,
  buildGlassSliderThumbStyle,
  buildGlassSliderTrackStyle,
  buildGlassSliderValueStyle,
  buildGlassSliderWrapperStyle,
  clampValue,
  computeFilledWidth,
  computeProgress,
  computeThumbLeft,
  deriveNextValueFromKey,
  isGlassSliderInteractive,
  keyPressMovedValue,
  resolveGlassSliderAccessibilityLabel,
  resolveGlassSliderAccessibilityState,
  resolveGlassSliderAccessibilityValue,
  snapToStep,
} from './style.js';

const FOCUS = '#A6F0E0';
const FILLED = '#4FD3B5';
const TRACK_BG = '#2C2F3A';
const THUMB = '#FFFFFF';

describe('clampValue', () => {
  test('returns value when inside range', () => {
    expect(clampValue({ value: 50, min: 0, max: 100 })).toBe(50);
  });
  test('clamps below min', () => {
    expect(clampValue({ value: -5, min: 0, max: 100 })).toBe(0);
  });
  test('clamps above max', () => {
    expect(clampValue({ value: 200, min: 0, max: 100 })).toBe(100);
  });
  test('returns min when caller inverts the bounds', () => {
    expect(clampValue({ value: 50, min: 100, max: 0 })).toBe(100);
  });
});

describe('snapToStep', () => {
  test('snaps to nearest step offset from min', () => {
    expect(snapToStep({ value: 23, min: 0, max: 100, step: 5 })).toBe(25);
    expect(snapToStep({ value: 22, min: 0, max: 100, step: 5 })).toBe(20);
  });
  test('snaps relative to min (not zero)', () => {
    expect(snapToStep({ value: 13, min: 10, max: 100, step: 5 })).toBe(15);
  });
  test('step=0 is treated as stepless (pass-through + clamp)', () => {
    expect(snapToStep({ value: 23.456, min: 0, max: 100, step: 0 })).toBe(23.456);
    expect(snapToStep({ value: 200, min: 0, max: 100, step: 0 })).toBe(100);
  });
  test('never pushes past the max stop even when step overshoots', () => {
    expect(snapToStep({ value: 99, min: 0, max: 100, step: 10 })).toBe(100);
  });
});

describe('computeProgress', () => {
  test('maps value to [0, 1] inside the range', () => {
    expect(computeProgress({ value: 0, min: 0, max: 100 })).toBe(0);
    expect(computeProgress({ value: 50, min: 0, max: 100 })).toBe(0.5);
    expect(computeProgress({ value: 100, min: 0, max: 100 })).toBe(1);
  });
  test('clamps out-of-range values into [0, 1]', () => {
    expect(computeProgress({ value: -10, min: 0, max: 100 })).toBe(0);
    expect(computeProgress({ value: 200, min: 0, max: 100 })).toBe(1);
  });
  test('degenerate range returns 0 (no NaN)', () => {
    expect(computeProgress({ value: 5, min: 5, max: 5 })).toBe(0);
  });
});

describe('computeThumbLeft', () => {
  test('progress=0 places the thumb on the left edge', () => {
    expect(computeThumbLeft({ progress: 0, trackWidth: 200 })).toBe(0);
  });
  test('progress=1 places the thumb against the right edge', () => {
    expect(computeThumbLeft({ progress: 1, trackWidth: 200 })).toBe(200 - THUMB_SIZE);
  });
  test('progress=0.5 centers the thumb', () => {
    const half = (200 - THUMB_SIZE) / 2;
    expect(computeThumbLeft({ progress: 0.5, trackWidth: 200 })).toBe(Math.round(half));
  });
  test('rounds to integer pixels', () => {
    const left = computeThumbLeft({ progress: 1 / 3, trackWidth: 200 });
    expect(Number.isInteger(left)).toBe(true);
  });
  test('clamps progress outside [0, 1]', () => {
    expect(computeThumbLeft({ progress: -0.2, trackWidth: 200 })).toBe(0);
    expect(computeThumbLeft({ progress: 1.5, trackWidth: 200 })).toBe(200 - THUMB_SIZE);
  });
});

describe('computeFilledWidth', () => {
  test('returns a CSS percentage string', () => {
    expect(computeFilledWidth({ progress: 0 })).toBe('0%');
    expect(computeFilledWidth({ progress: 0.25 })).toBe('25%');
    expect(computeFilledWidth({ progress: 1 })).toBe('100%');
  });
  test('clamps progress outside [0, 1]', () => {
    expect(computeFilledWidth({ progress: -0.5 })).toBe('0%');
    expect(computeFilledWidth({ progress: 2 })).toBe('100%');
  });
});

describe('deriveNextValueFromKey (WAI-ARIA slider pattern)', () => {
  const range = { min: 0, max: 100, step: 5 };

  test('ArrowRight / ArrowUp increment by step', () => {
    expect(deriveNextValueFromKey({ key: 'ArrowRight', current: 50, ...range })).toBe(55);
    expect(deriveNextValueFromKey({ key: 'ArrowUp', current: 50, ...range })).toBe(55);
  });

  test('ArrowLeft / ArrowDown decrement by step', () => {
    expect(deriveNextValueFromKey({ key: 'ArrowLeft', current: 50, ...range })).toBe(45);
    expect(deriveNextValueFromKey({ key: 'ArrowDown', current: 50, ...range })).toBe(45);
  });

  test('Home / End jump to bounds', () => {
    expect(deriveNextValueFromKey({ key: 'Home', current: 50, ...range })).toBe(0);
    expect(deriveNextValueFromKey({ key: 'End', current: 50, ...range })).toBe(100);
  });

  test('PageUp / PageDown nudge by 10*step', () => {
    expect(deriveNextValueFromKey({ key: 'PageUp', current: 50, ...range })).toBe(
      snapToStep({ value: 50 + 5 * PAGE_MULTIPLIER, ...range }),
    );
    expect(deriveNextValueFromKey({ key: 'PageDown', current: 50, ...range })).toBe(
      snapToStep({ value: 50 - 5 * PAGE_MULTIPLIER, ...range }),
    );
  });

  test('clamps at the end stops', () => {
    expect(deriveNextValueFromKey({ key: 'ArrowRight', current: 100, ...range })).toBe(100);
    expect(deriveNextValueFromKey({ key: 'ArrowLeft', current: 0, ...range })).toBe(0);
    expect(deriveNextValueFromKey({ key: 'PageUp', current: 95, ...range })).toBe(100);
  });

  test('unrecognized keys return the current value', () => {
    expect(deriveNextValueFromKey({ key: 'Enter', current: 50, ...range })).toBe(50);
    expect(deriveNextValueFromKey({ key: 'a', current: 50, ...range })).toBe(50);
    expect(deriveNextValueFromKey({ key: ' ', current: 50, ...range })).toBe(50);
  });

  test('default step is 1 when omitted', () => {
    expect(deriveNextValueFromKey({ key: 'ArrowRight', current: 50, min: 0, max: 100 })).toBe(
      50 + DEFAULT_STEP,
    );
  });
});

describe('keyPressMovedValue', () => {
  const range = { min: 0, max: 100, step: 5 };
  test('true when the key produced a different value', () => {
    expect(keyPressMovedValue({ key: 'ArrowRight', current: 50, ...range })).toBe(true);
  });
  test('false at the end stop', () => {
    expect(keyPressMovedValue({ key: 'ArrowRight', current: 100, ...range })).toBe(false);
  });
  test('false for unhandled keys', () => {
    expect(keyPressMovedValue({ key: 'Tab', current: 50, ...range })).toBe(false);
  });
});

describe('row style state priority (disabled > focused > idle)', () => {
  test('idle has no outline', () => {
    const style = buildGlassSliderRowStyle({
      disabled: false,
      focused: false,
      focusRingColor: FOCUS,
    });
    expect(style.outlineStyle).toBe('none');
    expect(style.opacity).toBe(1);
    expect(style.minHeight).toBe(MIN_HIT_TARGET);
  });

  test('focused paints the focus ring', () => {
    const style = buildGlassSliderRowStyle({
      disabled: false,
      focused: true,
      focusRingColor: FOCUS,
    });
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineWidth).toBe(FOCUS_RING_WIDTH);
    expect(style.outlineColor).toBe(FOCUS);
    expect(style.outlineOffset).toBe(FOCUS_RING_OFFSET);
  });

  test('disabled dims + suppresses the focus ring', () => {
    const style = buildGlassSliderRowStyle({
      disabled: true,
      focused: true,
      focusRingColor: FOCUS,
    });
    expect(style.opacity).toBe(0.4);
    expect(style.outlineStyle).toBe('none');
    expect(style.outlineWidth).toBe(0);
  });
});

describe('track / filled / thumb styles', () => {
  test('track is a pill with borderRadius = half-height', () => {
    const s = buildGlassSliderTrackStyle({ trackColor: TRACK_BG });
    expect(s.height).toBe(TRACK_HEIGHT);
    expect(s.borderRadius).toBe(TRACK_HEIGHT / 2);
    expect(s.backgroundColor).toBe(TRACK_BG);
    expect(s.overflow).toBe('hidden');
  });

  test('filled style reports width as a percentage string', () => {
    const s = buildGlassSliderFilledStyle({ progress: 0.6, filledColor: FILLED });
    expect(s.width).toBe('60%');
    expect(s.backgroundColor).toBe(FILLED);
    expect(s.height).toBe(TRACK_HEIGHT);
  });

  test('thumb is circular and absolutely positioned', () => {
    const s = buildGlassSliderThumbStyle({ thumbColor: THUMB, thumbLeft: 80 });
    expect(s.position).toBe('absolute');
    expect(s.width).toBe(THUMB_SIZE);
    expect(s.borderRadius).toBe(THUMB_SIZE / 2);
    expect(s.left).toBe(80);
    expect(s.top).toBe((MIN_HIT_TARGET - THUMB_SIZE) / 2);
  });
});

describe('wrapper style', () => {
  test('enforces the 44dp floor and stacks the rows with a gap', () => {
    const s = buildGlassSliderWrapperStyle();
    expect(s.minHeight).toBe(MIN_HIT_TARGET);
    expect(s.flexDirection).toBe('column');
    expect(s.gap).toBeGreaterThan(0);
  });
});

describe('themed text styles across personalities', () => {
  const themes = [
    ['aurora', aurora],
    ['obsidian', obsidian],
    ['frost', frost],
    ['sunset', sunset],
  ] as const;

  test.each(themes)('%s label style uses textPrimary', (_name, theme) => {
    const s = buildGlassSliderLabelStyle(theme.colors.textPrimary);
    expect(s.color).toBe(theme.colors.textPrimary);
    expect(s.fontWeight).toBe('600');
  });

  test.each(themes)('%s value style uses textSecondary', (_name, theme) => {
    const s = buildGlassSliderValueStyle(theme.colors.textSecondary);
    expect(s.color).toBe(theme.colors.textSecondary);
    expect(s.fontWeight).toBe('500');
  });
});

describe('isGlassSliderInteractive', () => {
  test('requires both a handler and non-disabled', () => {
    expect(isGlassSliderInteractive({ disabled: false, hasOnValueChange: true })).toBe(true);
    expect(isGlassSliderInteractive({ disabled: true, hasOnValueChange: true })).toBe(false);
    expect(isGlassSliderInteractive({ disabled: false, hasOnValueChange: false })).toBe(false);
  });
});

describe('resolveGlassSliderAccessibilityLabel', () => {
  test('explicit override > visible label > undefined', () => {
    expect(
      resolveGlassSliderAccessibilityLabel({
        accessibilityLabel: 'Volume',
        label: 'Output level',
      }),
    ).toBe('Volume');
    expect(
      resolveGlassSliderAccessibilityLabel({ accessibilityLabel: undefined, label: 'Volume' }),
    ).toBe('Volume');
    expect(
      resolveGlassSliderAccessibilityLabel({ accessibilityLabel: undefined, label: undefined }),
    ).toBeUndefined();
  });

  test('empty string label is respected', () => {
    expect(resolveGlassSliderAccessibilityLabel({ accessibilityLabel: '', label: 'Volume' })).toBe(
      '',
    );
  });
});

describe('resolveGlassSliderAccessibilityValue', () => {
  test('projects min/max/now directly', () => {
    expect(resolveGlassSliderAccessibilityValue({ value: 42, min: 0, max: 100 })).toEqual({
      min: 0,
      max: 100,
      now: 42,
    });
  });

  test('formatValue hook produces a text label', () => {
    expect(
      resolveGlassSliderAccessibilityValue({
        value: 42,
        min: 0,
        max: 100,
        formatValue: (v) => `${v}%`,
      }),
    ).toEqual({ min: 0, max: 100, now: 42, text: '42%' });
  });

  test('text is omitted when no formatter is given', () => {
    const out = resolveGlassSliderAccessibilityValue({ value: 0, min: 0, max: 100 });
    expect('text' in out).toBe(false);
  });
});

describe('resolveGlassSliderAccessibilityState', () => {
  test('interactive → disabled: false', () => {
    expect(
      resolveGlassSliderAccessibilityState({ disabled: false, hasOnValueChange: true }),
    ).toEqual({ disabled: false });
  });
  test('disabled → disabled: true', () => {
    expect(
      resolveGlassSliderAccessibilityState({ disabled: true, hasOnValueChange: true }),
    ).toEqual({ disabled: true });
  });
  test('no handler → disabled: true', () => {
    expect(
      resolveGlassSliderAccessibilityState({ disabled: false, hasOnValueChange: false }),
    ).toEqual({ disabled: true });
  });
});

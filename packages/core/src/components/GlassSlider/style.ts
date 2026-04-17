/**
 * Pure helpers for GlassSlider. No react-native imports — lives in
 * the node-only vitest surface, same split the rest of Phase 3 uses.
 *
 * Geometry: a horizontal 6dp pill track with a 24dp circular thumb
 * that sits on top of the track and moves along the filled portion.
 * The control is wrapped in a 44dp tappable row so the visible track
 * stays compact while the hit area meets the a11y floor.
 */

export const MIN_HIT_TARGET = 44;

/** Empty-track thickness. */
export const TRACK_HEIGHT = 6;

/** Thumb diameter. */
export const THUMB_SIZE = 24;

/** Focus ring stroke + offset, identical to GlassButton / GlassInput / GlassSwitch. */
export const FOCUS_RING_WIDTH = 3;
export const FOCUS_RING_OFFSET = 2;

/**
 * Default step resolution. When the caller omits `step`, arrow-key
 * adjustments move 1 unit. Page-up/down nudges are 10x the active
 * step, matching WAI-ARIA's recommendation for slider patterns.
 */
export const DEFAULT_STEP = 1;
export const PAGE_MULTIPLIER = 10;

export type SliderBounds = { min: number; max: number };

export type GlassSliderWrapperStyle = {
  minHeight: number;
  width: '100%';
  flexDirection: 'column';
  gap: number;
};

export type GlassSliderRowStyle = {
  minHeight: number;
  width: '100%';
  justifyContent: 'center';
  position: 'relative';
  outlineStyle: 'solid' | 'none';
  outlineWidth: number;
  outlineColor?: string;
  outlineOffset: number;
  opacity: number;
};

export type GlassSliderTrackStyle = {
  height: number;
  width: '100%';
  borderRadius: number;
  backgroundColor: string;
  overflow: 'hidden';
};

export type GlassSliderFilledStyle = {
  height: number;
  width: string;
  borderRadius: number;
  backgroundColor: string;
};

export type GlassSliderThumbStyle = {
  position: 'absolute';
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  top: number;
  left: number;
};

export type GlassSliderTextStyle = {
  color: string;
  fontSize: number;
  fontWeight: string;
};

/**
 * Clamp a numeric value to [min, max]. Returns min when min > max
 * (caller bug, fail closed to the low bound rather than leaking NaN).
 */
export function clampValue(options: { value: number; min: number; max: number }): number {
  const { value, min, max } = options;
  if (min > max) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Snap a value to the nearest step offset from `min`. When step is
 * 0 or negative (caller bug / stepless slider) the value passes
 * through unchanged. Clamps the result into the [min, max] window so
 * rounding never pushes the thumb past the end stop.
 */
export function snapToStep(options: {
  value: number;
  min: number;
  max: number;
  step: number;
}): number {
  const { value, min, max, step } = options;
  if (step <= 0) return clampValue({ value, min, max });
  const snapped = min + Math.round((value - min) / step) * step;
  return clampValue({ value: snapped, min, max });
}

/**
 * Fractional progress [0, 1] of `value` inside [min, max]. Returns 0
 * for a degenerate range so the filled bar and thumb don't jump to
 * NaN when min === max.
 */
export function computeProgress(options: { value: number; min: number; max: number }): number {
  const { value, min, max } = options;
  if (max <= min) return 0;
  const clamped = clampValue({ value, min, max });
  return (clamped - min) / (max - min);
}

/**
 * Horizontal pixel offset for the thumb center. The thumb is rendered
 * absolute-positioned, so its visual center at `progress=0` must sit
 * on the track's left edge (left: 0) and at `progress=1` on the right
 * edge (left: trackWidth - thumbSize). Interpolates linearly between.
 */
export function computeThumbLeft(options: {
  progress: number;
  trackWidth: number;
  thumbSize?: number;
}): number {
  const { progress, trackWidth } = options;
  const size = options.thumbSize ?? THUMB_SIZE;
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.round((trackWidth - size) * clamped);
}

/** Filled-portion width as a CSS percentage string. */
export function computeFilledWidth(options: { progress: number }): string {
  const clamped = Math.max(0, Math.min(1, options.progress));
  return `${clamped * 100}%`;
}

/**
 * Keyboard-driven next value, following the WAI-ARIA slider pattern:
 *   ArrowLeft / ArrowDown  → decrement by step
 *   ArrowRight / ArrowUp   → increment by step
 *   Home                   → min
 *   End                    → max
 *   PageDown               → decrement by 10*step
 *   PageUp                 → increment by 10*step
 * Any other key returns the current value unchanged so the caller can
 * `event.preventDefault()` only when the resolver actually produced a
 * new value.
 */
export function deriveNextValueFromKey(options: {
  key: string;
  current: number;
  min: number;
  max: number;
  step?: number;
}): number {
  const { key, current, min, max } = options;
  const step = options.step ?? DEFAULT_STEP;
  const nudge = step * PAGE_MULTIPLIER;
  let raw: number;
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      raw = current - step;
      break;
    case 'ArrowRight':
    case 'ArrowUp':
      raw = current + step;
      break;
    case 'Home':
      raw = min;
      break;
    case 'End':
      raw = max;
      break;
    case 'PageDown':
      raw = current - nudge;
      break;
    case 'PageUp':
      raw = current + nudge;
      break;
    default:
      return current;
  }
  return snapToStep({ value: raw, min, max, step });
}

/**
 * Whether a key press produced a distinct next value. Callers use this
 * to decide whether to `event.preventDefault()` — only swallow keys
 * that actually changed the slider, so page-level shortcuts (e.g. /
 * and ?) stay usable when the slider has no delta to apply.
 */
export function keyPressMovedValue(options: {
  key: string;
  current: number;
  min: number;
  max: number;
  step?: number;
}): boolean {
  return deriveNextValueFromKey(options) !== options.current;
}

/** Outer wrapper: label row above, track row below, stacked with a gap. */
export function buildGlassSliderWrapperStyle(): GlassSliderWrapperStyle {
  return {
    minHeight: MIN_HIT_TARGET,
    width: '100%',
    flexDirection: 'column',
    gap: 8,
  };
}

/**
 * Inner track-row style: 44dp tall (so the compact visible track
 * still has a 44dp tap area around it), relative-positioned so the
 * thumb can be absolutely placed, and carrying the focus ring for
 * keyboard users.
 */
export function buildGlassSliderRowStyle(options: {
  disabled: boolean;
  focused: boolean;
  focusRingColor: string;
}): GlassSliderRowStyle {
  const { disabled, focused, focusRingColor } = options;
  const base: GlassSliderRowStyle = {
    minHeight: MIN_HIT_TARGET,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineOffset: 0,
    opacity: disabled ? 0.4 : 1,
  };
  if (focused && !disabled) {
    return {
      ...base,
      outlineStyle: 'solid',
      outlineWidth: FOCUS_RING_WIDTH,
      outlineColor: focusRingColor,
      outlineOffset: FOCUS_RING_OFFSET,
    };
  }
  return base;
}

/** Empty track (the unfilled portion behind the filled bar + thumb). */
export function buildGlassSliderTrackStyle(options: { trackColor: string }): GlassSliderTrackStyle {
  return {
    height: TRACK_HEIGHT,
    width: '100%',
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: options.trackColor,
    overflow: 'hidden',
  };
}

/** Filled (accented) portion from the left edge to the thumb. */
export function buildGlassSliderFilledStyle(options: {
  progress: number;
  filledColor: string;
}): GlassSliderFilledStyle {
  return {
    height: TRACK_HEIGHT,
    width: computeFilledWidth({ progress: options.progress }),
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: options.filledColor,
  };
}

/**
 * Thumb style. Vertically centered on the track; horizontally placed
 * by the caller after measuring the track width.
 */
export function buildGlassSliderThumbStyle(options: {
  thumbColor: string;
  thumbLeft: number;
}): GlassSliderThumbStyle {
  return {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: options.thumbColor,
    top: (MIN_HIT_TARGET - THUMB_SIZE) / 2,
    left: options.thumbLeft,
  };
}

/** Themed visible label (above the track). */
export function buildGlassSliderLabelStyle(textPrimary: string): GlassSliderTextStyle {
  return {
    color: textPrimary,
    fontSize: 13,
    fontWeight: '600',
  };
}

/** Themed value readout (right-aligned, below the track or inline). */
export function buildGlassSliderValueStyle(textSecondary: string): GlassSliderTextStyle {
  return {
    color: textSecondary,
    fontSize: 12,
    fontWeight: '500',
  };
}

/** Interactive when not disabled AND a handler is attached. */
export function isGlassSliderInteractive(options: {
  disabled: boolean;
  hasOnValueChange: boolean;
}): boolean {
  return !options.disabled && options.hasOnValueChange;
}

/** A11y label resolver: explicit > visible label > undefined. */
export function resolveGlassSliderAccessibilityLabel(options: {
  accessibilityLabel: string | undefined;
  label: string | undefined;
}): string | undefined {
  if (options.accessibilityLabel !== undefined) return options.accessibilityLabel;
  if (options.label !== undefined) return options.label;
  return undefined;
}

/**
 * Accessibility value shape passed to the adjustable host element.
 * Mirrors aria-valuenow/min/max so both RN-web AT and native
 * AccessibilityInfo pick it up with the same contract.
 */
export function resolveGlassSliderAccessibilityValue(options: {
  value: number;
  min: number;
  max: number;
  formatValue?: (v: number) => string;
}): { min: number; max: number; now: number; text?: string } {
  const result: { min: number; max: number; now: number; text?: string } = {
    min: options.min,
    max: options.max,
    now: options.value,
  };
  if (options.formatValue) result.text = options.formatValue(options.value);
  return result;
}

/** A11y state: disabled flag collapses the two "non-interactive" cases. */
export function resolveGlassSliderAccessibilityState(options: {
  disabled: boolean;
  hasOnValueChange: boolean;
}): { disabled: boolean } {
  return { disabled: !isGlassSliderInteractive(options) };
}

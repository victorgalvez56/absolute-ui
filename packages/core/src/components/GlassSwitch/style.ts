/**
 * Pure helpers for GlassSwitch. No react-native imports so the
 * node-only vitest suite can exercise them without a DOM.
 *
 * Geometry: a 52x32 track with a 24dp circular thumb that slides
 * between 4dp-from-left (off) and 4dp-from-right (on). The whole
 * control sits inside a 44dp tappable wrapper so the visible track
 * stays compact while the hit area meets the a11y floor.
 */

/** Minimum hit target floor (dp). */
export const MIN_HIT_TARGET = 44;

/** Visible track dimensions. */
export const TRACK_WIDTH = 52;
export const TRACK_HEIGHT = 32;

/** Thumb diameter. */
export const THUMB_SIZE = 24;

/** Padding between thumb and track edge in either rest position. */
export const THUMB_PADDING = 4;

/** Focus ring stroke + offset, identical to GlassButton / GlassInput. */
export const FOCUS_RING_WIDTH = 3;
export const FOCUS_RING_OFFSET = 2;

export type GlassSwitchTrackStyle = {
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  opacity: number;
  justifyContent: 'center';
  outlineStyle: 'solid' | 'none';
  outlineWidth: number;
  outlineColor?: string;
  outlineOffset: number;
};

export type GlassSwitchThumbStyle = {
  position: 'absolute';
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  top: number;
  left: number;
};

export type GlassSwitchLabelStyle = {
  color: string;
  fontSize: number;
  fontWeight: '500';
};

export type GlassSwitchWrapperStyle = {
  minHeight: number;
  flexDirection: 'row';
  alignItems: 'center';
  gap: number;
};

/**
 * Track style. Background color switches between `checkedColor` (on)
 * and `uncheckedColor` (off). Disabled dims the whole track to 0.4
 * and suppresses the focus ring — same priority order GlassInput
 * uses (disabled > focused > idle).
 */
export function buildGlassSwitchTrackStyle(options: {
  checked: boolean;
  disabled: boolean;
  focused: boolean;
  checkedColor: string;
  uncheckedColor: string;
  focusRingColor: string;
}): GlassSwitchTrackStyle {
  const { checked, disabled, focused, checkedColor, uncheckedColor, focusRingColor } = options;
  const base: GlassSwitchTrackStyle = {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: checked ? checkedColor : uncheckedColor,
    opacity: disabled ? 0.4 : 1,
    justifyContent: 'center',
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineOffset: 0,
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

/**
 * Thumb style. Absolutely positioned inside the track, with a left
 * offset that flips between the two rest positions. When the motion
 * layer drives the slide, callers override `left` via an animated
 * style — the static builder still returns the checked-state rest
 * position so reduced-motion / no-animation tests see the final frame.
 */
export function buildGlassSwitchThumbStyle(options: {
  checked: boolean;
  thumbColor: string;
}): GlassSwitchThumbStyle {
  const { checked, thumbColor } = options;
  const top = (TRACK_HEIGHT - THUMB_SIZE) / 2;
  return {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: thumbColor,
    top,
    left: resolveSwitchThumbLeft(checked),
  };
}

/**
 * Horizontal rest position for the thumb. Exported so the motion
 * layer can seed a shared value with the current rest and animate to
 * the next one without reimplementing the geometry math.
 */
export function resolveSwitchThumbLeft(checked: boolean): number {
  const offLeft = THUMB_PADDING;
  const onLeft = TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING;
  return checked ? onLeft : offLeft;
}

/** Themed label style rendered next to the track. */
export function buildGlassSwitchLabelStyle(textPrimary: string): GlassSwitchLabelStyle {
  return {
    color: textPrimary,
    fontSize: 15,
    fontWeight: '500',
  };
}

/**
 * Outer tappable wrapper style. Enforces the 44dp hit target floor on
 * the whole row (label + track), and lays the two out horizontally
 * with a consistent gap.
 */
export function buildGlassSwitchWrapperStyle(): GlassSwitchWrapperStyle {
  return {
    minHeight: MIN_HIT_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  };
}

/**
 * A switch is interactive when it's not disabled AND has an
 * onValueChange handler. Decorative switches (no handler) announce
 * as disabled so the a11y tree matches the visual affordance.
 */
export function isGlassSwitchInteractive(options: {
  disabled: boolean;
  hasOnValueChange: boolean;
}): boolean {
  return !options.disabled && options.hasOnValueChange;
}

/**
 * Accessibility label resolver. Priority: explicit override > visible
 * label > undefined. Unlike GlassInput there's no placeholder fallback
 * because a switch doesn't carry inline text content.
 */
export function resolveGlassSwitchAccessibilityLabel(options: {
  accessibilityLabel: string | undefined;
  label: string | undefined;
}): string | undefined {
  if (options.accessibilityLabel !== undefined) return options.accessibilityLabel;
  if (options.label !== undefined) return options.label;
  return undefined;
}

/**
 * Accessibility state. `checked` reflects the current value so screen
 * readers announce "on" / "off". `disabled` collapses both the
 * caller's `disabled` flag and the "no handler" decorative case.
 */
export function resolveGlassSwitchAccessibilityState(options: {
  checked: boolean;
  disabled: boolean;
  hasOnValueChange: boolean;
}): { checked: boolean; disabled: boolean } {
  return {
    checked: options.checked,
    disabled: !isGlassSwitchInteractive({
      disabled: options.disabled,
      hasOnValueChange: options.hasOnValueChange,
    }),
  };
}

/**
 * Resolve the next value on press. A switch always toggles when
 * interactive; returns the current value unchanged when disabled or
 * decorative so callers can wire `onPress={() => onValueChange(next(checked))}`
 * without branching at the call site.
 */
export function resolveNextSwitchValue(options: {
  checked: boolean;
  disabled: boolean;
  hasOnValueChange: boolean;
}): boolean {
  return isGlassSwitchInteractive({
    disabled: options.disabled,
    hasOnValueChange: options.hasOnValueChange,
  })
    ? !options.checked
    : options.checked;
}

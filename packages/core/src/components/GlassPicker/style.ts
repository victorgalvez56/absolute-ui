/**
 * Pure helpers for GlassPicker. No react-native imports — lives in
 * the node-only vitest surface, same split the rest of Phase 3 uses.
 *
 * GlassPicker is a single-select segmented control. The whole group
 * announces as `radiogroup`, each segment as `radio` with its own
 * selected/disabled state. For >5 choices callers should reach for a
 * GlassSheet-based menu (Phase 4) instead of cramming the row.
 */

export const MIN_HIT_TARGET = 44;

export const FOCUS_RING_WIDTH = 3;
export const FOCUS_RING_OFFSET = 2;

export type GlassPickerItem<T> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type GlassPickerContainerStyle = {
  flexDirection: 'row';
  alignItems: 'center';
  gap: number;
  padding: number;
  borderRadius: number;
  backgroundColor: string;
  opacity: number;
};

export type GlassPickerSegmentStyle = {
  flex: 1;
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  borderRadius: number;
  alignItems: 'center';
  justifyContent: 'center';
  backgroundColor: string;
  opacity: number;
  outlineStyle: 'solid' | 'none';
  outlineWidth: number;
  outlineColor?: string;
  outlineOffset: number;
};

export type GlassPickerSegmentTextStyle = {
  color: string;
  fontSize: number;
  fontWeight: '600' | '500';
};

export type GlassPickerLabelStyle = {
  color: string;
  fontSize: number;
  fontWeight: '600';
  marginBottom: number;
};

/**
 * Locate the selected item's index. Returns -1 when no item matches
 * so the caller can distinguish "nothing selected" from "first item
 * is selected". Uses strict equality because picker values are
 * expected to be primitives (string | number | boolean); callers
 * passing object values should reuse the same reference per option.
 */
export function resolveSelectedIndex<T>(options: {
  items: readonly GlassPickerItem<T>[];
  selectedValue: T | undefined;
}): number {
  if (options.selectedValue === undefined) return -1;
  return options.items.findIndex((item) => item.value === options.selectedValue);
}

/**
 * Group is interactive when not disabled AND a handler is attached.
 * Individual segment interactivity is computed per item (an item can
 * be disabled even when the group is interactive).
 */
export function isGlassPickerInteractive(options: {
  disabled: boolean;
  hasOnValueChange: boolean;
}): boolean {
  return !options.disabled && options.hasOnValueChange;
}

/**
 * Whether a given segment is interactive. Combines the group's
 * interactivity flag with the item-level `disabled`.
 */
export function isGlassPickerSegmentInteractive<T>(options: {
  groupInteractive: boolean;
  item: GlassPickerItem<T>;
}): boolean {
  return options.groupInteractive && !options.item.disabled;
}

/**
 * Container (the pill that visually groups the segments). Uses the
 * theme divider as its subtle backdrop so segments can lift out with
 * the accent color without needing an opaque backplate.
 */
export function buildGlassPickerContainerStyle(options: {
  disabled: boolean;
  backgroundColor: string;
}): GlassPickerContainerStyle {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: 12,
    backgroundColor: options.backgroundColor,
    opacity: options.disabled ? 0.4 : 1,
  };
}

/**
 * Segment background + outline. Priority (same as the rest of Phase 3):
 *   disabled > focused > selected > idle
 *
 * A disabled segment ignores selection for the purposes of the focus
 * ring (still paints the selected background so users can tell which
 * option *was* chosen before the group went disabled) but suppresses
 * the outline.
 */
export function buildGlassPickerSegmentStyle(options: {
  selected: boolean;
  disabled: boolean;
  focused: boolean;
  selectedColor: string;
  unselectedColor: string;
  focusRingColor: string;
}): GlassPickerSegmentStyle {
  const { selected, disabled, focused, selectedColor, unselectedColor, focusRingColor } = options;
  const base: GlassPickerSegmentStyle = {
    flex: 1,
    minHeight: MIN_HIT_TARGET - 8, // outer container padding=4 each side, so floor is still 44dp row
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: selected ? selectedColor : unselectedColor,
    opacity: disabled ? 0.5 : 1,
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
 * Segment text style. Selected segment flips to `selectedTextColor`
 * (typically theme.onAccent) so contrast against the accent backdrop
 * holds up; unselected uses the unselected text color (textPrimary).
 */
export function buildGlassPickerSegmentTextStyle(options: {
  selected: boolean;
  selectedTextColor: string;
  unselectedTextColor: string;
}): GlassPickerSegmentTextStyle {
  return {
    color: options.selected ? options.selectedTextColor : options.unselectedTextColor,
    fontSize: 14,
    fontWeight: options.selected ? '600' : '500',
  };
}

/** Group label rendered above the segment row. */
export function buildGlassPickerLabelStyle(textPrimary: string): GlassPickerLabelStyle {
  return {
    color: textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  };
}

/**
 * Keyboard navigation inside the radiogroup. Follows the WAI-ARIA
 * radio pattern: ArrowLeft/Up select the previous item, ArrowRight/
 * Down the next, Home jumps to the first, End to the last.
 *
 * Skips disabled items. If every item is disabled the resolver
 * returns the current index unchanged so callers don't get stuck in
 * an infinite scan loop.
 *
 * Wraps around both ends: ArrowLeft from index 0 jumps to the last
 * enabled item. This matches native iOS segmented control + most
 * desktop radio groups users are already used to.
 */
export function deriveNextPickerIndexFromKey<T>(options: {
  key: string;
  currentIndex: number;
  items: readonly GlassPickerItem<T>[];
}): number {
  const { key, currentIndex, items } = options;
  if (items.length === 0) return -1;

  let delta: 1 | -1 | 0 = 0;
  let jumpTo: 'first' | 'last' | null = null;
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      delta = -1;
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      delta = 1;
      break;
    case 'Home':
      jumpTo = 'first';
      break;
    case 'End':
      jumpTo = 'last';
      break;
    default:
      return currentIndex;
  }

  const enabledIndices = items
    .map((item, index) => (item.disabled ? -1 : index))
    .filter((index) => index !== -1);
  if (enabledIndices.length === 0) return currentIndex;

  if (jumpTo === 'first') return enabledIndices[0] as number;
  if (jumpTo === 'last') return enabledIndices[enabledIndices.length - 1] as number;

  // Arrow navigation: find the current position inside enabledIndices,
  // then wrap delta around the enabled-only list.
  const cursor = enabledIndices.indexOf(currentIndex);
  if (cursor === -1) {
    // Current is disabled or unset → jump to the first enabled item
    // on a forward key, the last on a backward key.
    return (delta === 1 ? enabledIndices[0] : enabledIndices[enabledIndices.length - 1]) as number;
  }
  const nextCursor = (cursor + delta + enabledIndices.length) % enabledIndices.length;
  return enabledIndices[nextCursor] as number;
}

/**
 * Whether a key press produced a different index. Callers use this to
 * decide whether to `event.preventDefault()` — matches the GlassSlider
 * `keyPressMovedValue` contract.
 */
export function keyPressMovedPickerIndex<T>(options: {
  key: string;
  currentIndex: number;
  items: readonly GlassPickerItem<T>[];
}): boolean {
  return deriveNextPickerIndexFromKey(options) !== options.currentIndex;
}

/**
 * Group accessibility label resolver. Priority: explicit override >
 * visible label > undefined.
 */
export function resolveGlassPickerAccessibilityLabel(options: {
  accessibilityLabel: string | undefined;
  label: string | undefined;
}): string | undefined {
  if (options.accessibilityLabel !== undefined) return options.accessibilityLabel;
  if (options.label !== undefined) return options.label;
  return undefined;
}

/**
 * Per-segment accessibility state. Selected radios announce as
 * checked=true (the platform idiom for radios) — VoiceOver will say
 * "Selected" while TalkBack says "Checked". Disabled collapses both
 * the group and item-level disabled flags.
 */
export function resolveGlassPickerSegmentAccessibilityState(options: {
  selected: boolean;
  groupInteractive: boolean;
  itemDisabled: boolean;
}): { checked: boolean; disabled: boolean; selected: boolean } {
  const disabled = !options.groupInteractive || options.itemDisabled;
  return {
    checked: options.selected,
    selected: options.selected,
    disabled,
  };
}

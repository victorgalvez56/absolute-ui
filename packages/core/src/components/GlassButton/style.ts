/**
 * Pure helpers for GlassButton. Kept free of `react-native` imports so
 * node-only vitest can exercise them without jsdom or react-native-web —
 * the same split GlassSurface uses in its sibling `style.ts`.
 */

/**
 * Minimum hit target floor (in density-independent pixels) required by
 * the Absolute UI accessibility contract. Matches WCAG 2.5.5 / Apple HIG.
 */
export const MIN_HIT_TARGET = 44;

export type GlassButtonPressableStyle = {
  minWidth: number;
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  alignItems: 'center';
  justifyContent: 'center';
  opacity: number;
  /**
   * Web focus ring, rendered only when the Pressable reports
   * `focused: true`. On react-native-web these become real CSS
   * `outline` / `outline-offset` rules, so keyboard and switch
   * control users see a high-contrast indicator that the a11y
   * contract requires. On native, the `@absolute-ui/a11y`
   * `getFocusRing` helper will render an equivalent border View
   * (wired in Phase 2 when the motion layer lands).
   */
  outlineStyle?: 'solid' | 'none';
  outlineWidth?: number;
  outlineColor?: string;
  outlineOffset?: number;
};

export type GlassButtonTextStyle = {
  color: string;
  fontSize: number;
  fontWeight: '600';
  textAlign: 'center';
};

/**
 * Focus ring stroke width, in density-independent pixels. Matches the
 * `@absolute-ui/a11y` `defaultFocusRing.width` so the visible indicator
 * is consistent across primitives.
 */
export const FOCUS_RING_WIDTH = 3;

/**
 * Distance between the Pressable's edge and the focus ring stroke, in
 * density-independent pixels. Mirrors `defaultFocusRing.offset`.
 */
export const FOCUS_RING_OFFSET = 2;

/**
 * Resolve the Pressable's inline style for the given interaction state.
 *
 * Disabled wins over pressed — a disabled button must never flash the
 * pressed opacity even if the underlying touchable reports pressed=true.
 *
 * When `focused` is true (reported by react-native-web's Pressable
 * callback for keyboard and switch-control navigation), the style adds
 * a solid outline tinted with `focusRingColor`. This is the visible
 * focus indicator required by the Absolute UI accessibility contract.
 */
export function buildGlassButtonPressableStyle(options: {
  pressed: boolean;
  disabled: boolean;
  focused?: boolean;
  focusRingColor: string;
}): GlassButtonPressableStyle {
  const { pressed, disabled, focused = false, focusRingColor } = options;
  const base: GlassButtonPressableStyle = {
    minWidth: MIN_HIT_TARGET,
    minHeight: MIN_HIT_TARGET,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
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
 * Build the themed text style applied when the caller passes a plain
 * string child. Callers passing custom nodes opt out entirely.
 */
export function buildGlassButtonTextStyle(textPrimary: string): GlassButtonTextStyle {
  return {
    color: textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  };
}

/**
 * Decide whether GlassButton should auto-wrap its child in a themed
 * Text node. Only plain strings are auto-wrapped; nodes (icons, badges,
 * composed content) are rendered as-is so consumers keep full control.
 */
export function shouldWrapChildInText(child: unknown): child is string {
  return typeof child === 'string';
}

/**
 * Derive the interactive flag. A button is interactive only if it has
 * an onPress handler AND is not disabled. Decorative buttons (no
 * handler) are announced to screen readers as disabled buttons so the
 * a11y tree stays consistent with the visual state.
 */
export function isGlassButtonInteractive(options: {
  disabled: boolean;
  hasOnPress: boolean;
}): boolean {
  return !options.disabled && options.hasOnPress;
}

/**
 * Pick the accessibility label. Falls back to the string child when
 * the caller didn't set one explicitly — nodes never auto-populate.
 */
export function resolveGlassButtonAccessibilityLabel(options: {
  accessibilityLabel: string | undefined;
  child: unknown;
}): string | undefined {
  if (options.accessibilityLabel !== undefined) return options.accessibilityLabel;
  if (typeof options.child === 'string') return options.child;
  return undefined;
}

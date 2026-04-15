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
};

export type GlassButtonTextStyle = {
  color: string;
  fontSize: number;
  fontWeight: '600';
  textAlign: 'center';
};

/**
 * Resolve the Pressable's inline style for the given interaction state.
 * Disabled wins over pressed — a disabled button must never flash the
 * pressed opacity even if the underlying touchable reports pressed=true.
 */
export function buildGlassButtonPressableStyle(options: {
  pressed: boolean;
  disabled: boolean;
}): GlassButtonPressableStyle {
  const { pressed, disabled } = options;
  return {
    minWidth: MIN_HIT_TARGET,
    minHeight: MIN_HIT_TARGET,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
  };
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

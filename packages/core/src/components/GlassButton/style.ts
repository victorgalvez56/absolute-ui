/**
 * Pure helpers for GlassButton. Kept free of `react-native` imports so
 * node-only vitest can exercise them without jsdom or react-native-web —
 * the same split GlassSurface uses in its sibling `style.ts`.
 */

import type { ThemeColors } from '@absolute-ui/tokens';

/**
 * Minimum hit target floor (in density-independent pixels) required by
 * the Absolute UI accessibility contract. Matches WCAG 2.5.5 / Apple HIG.
 */
export const MIN_HIT_TARGET = 44;

/**
 * Semantic intent of a button. Each action maps to a theme color role
 * already guarded by the APCA contrast regression suite — no new color
 * tokens required.
 *
 *  - `primary`: `theme.colors.accent` (brand CTA)
 *  - `neutral`: `theme.colors.textPrimary` (secondary / non-CTA surfaces)
 *  - `danger`:  `theme.colors.danger`  (destructive)
 */
export type GlassButtonAction = 'primary' | 'neutral' | 'danger';

/**
 * Visual treatment.
 *
 *  - `solid`:   glass surface tinted with the action color, highest
 *               visual weight. Text uses the theme's `onAccent`.
 *  - `soft`:    glass surface + body text color — the original Phase 1
 *               default. Tranquil CTA on top of glass.
 *  - `outline`: glass surface with a 1.5pt border in the action color.
 *  - `ghost`:   no surface fill, text only, still has the 44pt target
 *               and focus ring.
 *  - `link`:    inline text-only, underlined on press. Reduces hit
 *               target to the text bounds (caller responsibility).
 */
export type GlassButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';

/**
 * Size token. Controls padding, font size, icon size, and inter-slot
 * gap. The 44pt hit-target floor is preserved at every size.
 */
export type GlassButtonSize = 'sm' | 'md' | 'lg';

export type GlassButtonPressableStyle = {
  minWidth: number;
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  alignItems: 'center';
  justifyContent: 'center';
  flexDirection: 'row';
  gap: number;
  opacity: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
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
  textDecorationLine?: 'underline' | 'none';
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
 * Outline variant border stroke width, in density-independent pixels.
 */
export const OUTLINE_BORDER_WIDTH = 1.5;

export type GlassButtonSizeTokens = {
  paddingHorizontal: number;
  paddingVertical: number;
  fontSize: number;
  /** Icon & spinner glyph box, in dp. */
  iconSize: number;
  /** Gap between slots (icon ↔ text ↔ spinner). */
  gap: number;
};

/**
 * Resolve the size token bundle for the given button size. Preserves
 * the 44pt minimum hit target at every size via the `minWidth` /
 * `minHeight` floor that `buildGlassButtonPressableStyle` applies.
 *
 * `md` matches the Phase 1 defaults (paddingH 20, paddingV 12,
 * fontSize 16) so existing callers and tests see no behavior change.
 */
export function resolveGlassButtonSize(size: GlassButtonSize = 'md'): GlassButtonSizeTokens {
  if (size === 'sm') {
    return {
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      iconSize: 16,
      gap: 6,
    };
  }
  if (size === 'lg') {
    return {
      paddingHorizontal: 24,
      paddingVertical: 16,
      fontSize: 18,
      iconSize: 22,
      gap: 10,
    };
  }
  return {
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    iconSize: 18,
    gap: 8,
  };
}

export type GlassButtonColorTokens = {
  /** Color the text + icon + spinner glyph paint in. */
  foreground: string;
  /** Background fill applied on top of the glass. `undefined` = glass-only. */
  background: string | undefined;
  /** Border stroke color. `undefined` = no border. */
  border: string | undefined;
  /** Whether to wrap in a `GlassSurface`. `ghost`/`link` opt out. */
  useGlassSurface: boolean;
  /** Whether the text renders with an underline (link variant). */
  underline: boolean;
};

/**
 * Map the (`action`, `variant`) pair onto the theme's already-guarded
 * color roles. No new tokens are introduced; the APCA regression suite
 * in `@absolute-ui/a11y` continues to gate all of these combinations.
 */
export function resolveGlassButtonColors(options: {
  action: GlassButtonAction;
  variant: GlassButtonVariant;
  colors: ThemeColors;
}): GlassButtonColorTokens {
  const { action, variant, colors } = options;
  const accentColor =
    action === 'primary' ? colors.accent : action === 'danger' ? colors.danger : colors.textPrimary;
  const onAccent = colors.onAccent;
  const textPrimary = colors.textPrimary;

  if (variant === 'solid') {
    return {
      foreground: action === 'neutral' ? colors.background : onAccent,
      background: accentColor,
      border: undefined,
      useGlassSurface: true,
      underline: false,
    };
  }
  if (variant === 'outline') {
    return {
      foreground: accentColor,
      background: undefined,
      border: accentColor,
      useGlassSurface: true,
      underline: false,
    };
  }
  if (variant === 'ghost') {
    return {
      foreground: accentColor,
      background: undefined,
      border: undefined,
      useGlassSurface: false,
      underline: false,
    };
  }
  if (variant === 'link') {
    return {
      foreground: accentColor,
      background: undefined,
      border: undefined,
      useGlassSurface: false,
      underline: true,
    };
  }
  // soft — glass-only with body text color
  return {
    foreground: textPrimary,
    background: undefined,
    border: undefined,
    useGlassSurface: true,
    underline: false,
  };
}

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
 *
 * Back-compat: the original Phase 1 signature {pressed, disabled,
 * focused?, focusRingColor} still works and returns the `md` size
 * defaults (paddingH 20, paddingV 12) so existing tests are unchanged.
 */
export function buildGlassButtonPressableStyle(options: {
  pressed: boolean;
  disabled: boolean;
  focused?: boolean;
  focusRingColor: string;
  size?: GlassButtonSize;
  backgroundColor?: string | undefined;
  borderColor?: string | undefined;
}): GlassButtonPressableStyle {
  const {
    pressed,
    disabled,
    focused = false,
    focusRingColor,
    size = 'md',
    backgroundColor,
    borderColor,
  } = options;
  const s = resolveGlassButtonSize(size);
  const base: GlassButtonPressableStyle = {
    minWidth: MIN_HIT_TARGET,
    minHeight: MIN_HIT_TARGET,
    paddingHorizontal: s.paddingHorizontal,
    paddingVertical: s.paddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: s.gap,
    opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineOffset: 0,
  };
  if (backgroundColor !== undefined) base.backgroundColor = backgroundColor;
  if (borderColor !== undefined) {
    base.borderColor = borderColor;
    base.borderWidth = OUTLINE_BORDER_WIDTH;
  }
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
 * Build the themed text style for the auto-wrapped string child or the
 * `<GlassButton.Text>` slot. Back-compat: the Phase 1 one-argument call
 * `buildGlassButtonTextStyle(color)` still works and yields the `md`
 * defaults (fontSize 16).
 */
export function buildGlassButtonTextStyle(
  color: string,
  size: GlassButtonSize = 'md',
  underline = false,
): GlassButtonTextStyle {
  const s = resolveGlassButtonSize(size);
  return {
    color,
    fontSize: s.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: underline ? 'underline' : 'none',
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
 * an onPress handler AND is not disabled AND is not loading. Decorative
 * buttons (no handler) are announced to screen readers as disabled
 * buttons so the a11y tree stays consistent with the visual state.
 */
export function isGlassButtonInteractive(options: {
  disabled: boolean;
  hasOnPress: boolean;
  loading?: boolean;
}): boolean {
  if (options.loading === true) return false;
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

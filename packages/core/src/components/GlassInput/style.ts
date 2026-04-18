/**
 * Pure helpers for GlassInput. No react-native imports — lives in the
 * node-only vitest surface, same split GlassButton and GlassSurface use.
 *
 * The JSX layer in GlassInput.tsx composes a GlassSurface around a
 * react-native TextInput; every styling / a11y / state-resolution
 * decision is delegated here so it can be exercised without a DOM.
 */

/**
 * Minimum hit target floor (dp). Matches the Absolute UI a11y contract
 * and mirrors GlassButton's MIN_HIT_TARGET.
 */
export const MIN_HIT_TARGET = 44;

/**
 * Focus ring stroke + offset — identical to GlassButton so keyboard
 * navigation between a button and an input produces a visually
 * consistent ring.
 */
export const FOCUS_RING_WIDTH = 3;
export const FOCUS_RING_OFFSET = 2;

/**
 * Error ring stroke width. Slightly narrower than the focus ring so a
 * focused-and-invalid input still reads as focused rather than invalid.
 */
export const ERROR_RING_WIDTH = 2;

export type GlassInputSize = 'sm' | 'md' | 'lg';

export type GlassInputSizeTokens = {
  paddingHorizontal: number;
  paddingVertical: number;
  fontSize: number;
  labelFontSize: number;
  helperFontSize: number;
  /** Icon glyph size, in dp. Used by leading / trailing icon slots. */
  iconSize: number;
  /** Gap between icon and input text. */
  gap: number;
};

/**
 * Resolve size-dependent geometry for the input. The 44pt minimum
 * height is preserved at every size via the container builder, so
 * `sm` shrinks padding + font without ever shrinking the hit target.
 */
export function resolveGlassInputSize(size: GlassInputSize = 'md'): GlassInputSizeTokens {
  if (size === 'sm') {
    return {
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      labelFontSize: 12,
      helperFontSize: 11,
      iconSize: 16,
      gap: 6,
    };
  }
  if (size === 'lg') {
    return {
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: 18,
      labelFontSize: 14,
      helperFontSize: 13,
      iconSize: 22,
      gap: 12,
    };
  }
  return {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    labelFontSize: 13,
    helperFontSize: 12,
    iconSize: 18,
    gap: 8,
  };
}

export type GlassInputContainerStyle = {
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  justifyContent: 'center';
  flexDirection: 'row';
  alignItems: 'center';
  gap: number;
  opacity: number;
  outlineStyle: 'solid' | 'none';
  outlineWidth: number;
  outlineColor?: string;
  outlineOffset: number;
};

export type GlassInputTextStyle = {
  color: string;
  fontSize: number;
  fontWeight: '400';
  // react-native-web accepts this; native ignores (Dynamic Type handles it)
  lineHeight: number;
};

export type GlassInputLabelStyle = {
  color: string;
  fontSize: number;
  fontWeight: '600';
  marginBottom: number;
};

export type GlassInputHelperStyle = {
  color: string;
  fontSize: number;
  fontWeight: '400';
  marginTop: number;
};

/**
 * Resolve the container style surrounding the TextInput. Handles the
 * three interaction axes that matter visually:
 *
 * 1. disabled — dims the whole field to 0.4, suppresses both rings.
 * 2. invalid — paints the error ring in `errorColor` (lower priority
 *    than the focus ring: a focused invalid field shows the focus
 *    ring, not the error ring, because focus is the more urgent
 *    affordance for the user actively editing).
 * 3. focused — paints the focus ring in `focusRingColor`.
 *
 * Disabled wins over everything. Focus wins over invalid. This is the
 * same priority order GlassButton uses for pressed-vs-focused.
 */
export function buildGlassInputContainerStyle(options: {
  focused: boolean;
  disabled: boolean;
  invalid: boolean;
  focusRingColor: string;
  errorColor: string;
  size?: GlassInputSize;
}): GlassInputContainerStyle {
  const { focused, disabled, invalid, focusRingColor, errorColor, size = 'md' } = options;
  const s = resolveGlassInputSize(size);
  const base: GlassInputContainerStyle = {
    minHeight: MIN_HIT_TARGET,
    paddingHorizontal: s.paddingHorizontal,
    paddingVertical: s.paddingVertical,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: s.gap,
    opacity: disabled ? 0.4 : 1,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineOffset: 0,
  };
  if (disabled) return base;
  if (focused) {
    return {
      ...base,
      outlineStyle: 'solid',
      outlineWidth: FOCUS_RING_WIDTH,
      outlineColor: focusRingColor,
      outlineOffset: FOCUS_RING_OFFSET,
    };
  }
  if (invalid) {
    return {
      ...base,
      outlineStyle: 'solid',
      outlineWidth: ERROR_RING_WIDTH,
      outlineColor: errorColor,
      outlineOffset: FOCUS_RING_OFFSET,
    };
  }
  return base;
}

/**
 * Themed text style for the TextInput itself. Uses textPrimary so the
 * APCA regression suite already covers contrast on every elevation.
 * lineHeight of 22 at fontSize 16 = ~1.375, which keeps Dynamic Type
 * up to the 200% accessibility size from clipping inside the 44pt
 * container.
 */
export function buildGlassInputTextStyle(
  textPrimary: string,
  size: GlassInputSize = 'md',
): GlassInputTextStyle {
  const s = resolveGlassInputSize(size);
  return {
    color: textPrimary,
    fontSize: s.fontSize,
    fontWeight: '400',
    // lineHeight must grow proportionally to fontSize so Dynamic Type
    // at 200% doesn't clip glyph ascenders inside the 44pt container.
    lineHeight: Math.round(s.fontSize * 1.375),
  };
}

/**
 * Placeholder color resolver — placeholders use textSecondary so they
 * sit one contrast step below the entered text, matching the
 * GlassCard header / body hierarchy.
 */
export function resolveGlassInputPlaceholderColor(textSecondary: string): string {
  return textSecondary;
}

/**
 * Label rendered above the input when the caller passes `label`.
 * Bold (600) so it visually outranks helper/error text below the field.
 */
export function buildGlassInputLabelStyle(
  textPrimary: string,
  size: GlassInputSize = 'md',
): GlassInputLabelStyle {
  return {
    color: textPrimary,
    fontSize: resolveGlassInputSize(size).labelFontSize,
    fontWeight: '600',
    marginBottom: 6,
  };
}

/**
 * Helper / error text rendered below the input. Color switches to
 * `errorColor` when the field is invalid so screen-reader users who
 * rely on aria-invalid also see a visual confirmation of the state.
 */
export function buildGlassInputHelperStyle(options: {
  textSecondary: string;
  errorColor: string;
  invalid: boolean;
  size?: GlassInputSize;
}): GlassInputHelperStyle {
  return {
    color: options.invalid ? options.errorColor : options.textSecondary,
    fontSize: resolveGlassInputSize(options.size ?? 'md').helperFontSize,
    fontWeight: '400',
    marginTop: 6,
  };
}

/**
 * A GlassInput is interactive when it's both editable AND not disabled.
 * Decorative / read-only inputs announce `disabled: true` to assistive
 * tech so the a11y tree reflects the visible affordance.
 */
export function isGlassInputInteractive(options: {
  disabled: boolean;
  editable: boolean;
}): boolean {
  return options.editable && !options.disabled;
}

/**
 * Pick the accessibility label. Priority order:
 *   1. explicit accessibilityLabel prop
 *   2. visible `label` prop (if any)
 *   3. placeholder (last resort — placeholders disappear on focus so
 *      they're the weakest a11y affordance, but still beat nothing).
 *   4. undefined — caller must supply one of the above.
 */
export function resolveGlassInputAccessibilityLabel(options: {
  accessibilityLabel: string | undefined;
  label: string | undefined;
  placeholder: string | undefined;
}): string | undefined {
  if (options.accessibilityLabel !== undefined) return options.accessibilityLabel;
  if (options.label !== undefined) return options.label;
  if (options.placeholder !== undefined) return options.placeholder;
  return undefined;
}

/**
 * Compose the helper text announced to screen readers. Combines the
 * visible helper text with the error message when invalid so a single
 * `accessibilityHint` string carries both contexts. Order: error first
 * (more urgent), helper second.
 */
export function resolveGlassInputAccessibilityHint(options: {
  helperText: string | undefined;
  errorText: string | undefined;
  invalid: boolean;
}): string | undefined {
  const { helperText, errorText, invalid } = options;
  if (invalid && errorText !== undefined && errorText.length > 0) {
    if (helperText !== undefined && helperText.length > 0) {
      return `${errorText}. ${helperText}`;
    }
    return errorText;
  }
  return helperText;
}

/**
 * Resolve the accessibility state for the TextInput. `disabled` covers
 * both the caller's `disabled` flag AND the editable flag — anything
 * non-interactive announces as disabled.
 */
export function resolveGlassInputAccessibilityState(options: {
  disabled: boolean;
  editable: boolean;
}): { disabled: boolean } {
  return { disabled: !isGlassInputInteractive(options) };
}

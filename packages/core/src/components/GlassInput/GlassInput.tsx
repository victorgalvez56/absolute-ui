import type { ReactNode } from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { spring } from '@absolute-ui/tokens';
import { useAbsoluteUI } from '../../theme-context.js';
import { AnimatedView } from '../../motion/animated.js';
import { instantTiming, toSpringConfig } from '../../motion/presets.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import {
  type GlassInputSize,
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

const gentleCfg = toSpringConfig(spring.gentle);
// Focus state adds a subtle 0.6% lift. Small enough that it never
// reflows siblings but perceptible enough to communicate "active".
const FOCUS_LIFT = 0.006;

export type GlassInputProps = {
  /**
   * Visible label rendered above the field. Optional but strongly
   * recommended — placeholders disappear on focus and are the weakest
   * a11y affordance. When a `label` is supplied it doubles as the
   * accessibility label unless `accessibilityLabel` is set explicitly.
   */
  label?: string;
  /**
   * Controlled value. Omit for uncontrolled mode with `defaultValue`.
   */
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /**
   * Fires on every keystroke. Prefer `value` + `onChangeText` for
   * validated fields; falls back to uncontrolled mode otherwise.
   */
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  /**
   * When true, the input visually dims to 0.4, suppresses both rings,
   * and announces `disabled: true` to assistive tech. Different from
   * `editable=false` only in visual weight — both are treated as
   * non-interactive by screen readers.
   */
  disabled?: boolean;
  /**
   * Lets the user tab through but not edit. The a11y tree still
   * reports `disabled: true` so assistive tech doesn't offer editing
   * affordances. Defaults to true.
   */
  editable?: boolean;
  /**
   * Mask characters (password fields). Combined with autoCapitalize=none.
   */
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  returnKeyType?: TextInputProps['returnKeyType'];
  /**
   * Validation flag. When true, the container paints the error ring
   * and the helper row switches to the error color. A focused invalid
   * field still shows the focus ring (focus wins over error), but the
   * helper text and `accessibilityHint` still reflect the error
   * state so screen readers announce it regardless of focus.
   */
  invalid?: boolean;
  /**
   * Helper text rendered below the field. Announced as
   * `accessibilityHint` when the field is valid.
   */
  helperText?: string;
  /**
   * Error message rendered below the field when `invalid` is true.
   * Announced as part of the `accessibilityHint` (prefixed before any
   * helper text).
   */
  errorText?: string;
  /**
   * Explicit a11y label override. When omitted, falls back to `label`
   * and then `placeholder`.
   */
  accessibilityLabel?: string;
  /**
   * Elevation forwarded to the underlying GlassSurface. Defaults to 1.
   */
  elevation?: GlassSurfaceProps['elevation'];
  /**
   * Corner radius token. Defaults to `md` — inputs use rectangular
   * corners rather than the pill shape buttons prefer.
   */
  radius?: GlassSurfaceProps['radius'];
  /**
   * Extra layout style for the outer wrapper (the View that holds
   * label + surface + helper). Use for margin / width. Do not pass
   * visual overrides — they bypass the theme contract.
   */
  style?: ViewStyle;
  /**
   * Size token. Controls container padding, text font, label font,
   * helper font, and icon size. Default `md`. The 44pt minimum hit
   * target is preserved at every size.
   */
  size?: GlassInputSize;
  /**
   * Leading slot rendered inside the surface, before the text input.
   * Typically an icon glyph (search, user, lock, …). The slot is
   * wrapped in a square box sized to the current `size` token so
   * callers don't have to hard-code dimensions.
   */
  leadingIcon?: ReactNode;
  /**
   * Trailing slot rendered inside the surface, after the text input.
   * Common uses: clear-input button, password visibility toggle,
   * validation indicator. Same sizing contract as `leadingIcon`.
   */
  trailingIcon?: ReactNode;
};

/**
 * Liquid-glass text input. Composes a GlassSurface around a
 * react-native TextInput, with optional visible label above and
 * helper/error text below.
 *
 * Interaction contract:
 *   - 44dp minimum height (via the container style helper).
 *   - Focus state is tracked locally (onFocus/onBlur) and projected
 *     into the container ring — not read from Pressable's focused
 *     callback, because TextInput doesn't emit one.
 *   - `disabled` wins over `focused` wins over `invalid` — same
 *     priority order GlassButton uses.
 *   - `allowFontScaling` is left at RN default (true) so Dynamic
 *     Type scales the text; the container's `minHeight: 44` +
 *     lineHeight 22 keeps the scaled text readable up to the 200%
 *     accessibility size without clipping.
 *   - Motion: the surface gently springs (scale 1→1.006) on focus and
 *     back on blur using the `gentle` spring token, communicating
 *     "active" without ever reflowing siblings. Reduced Motion swaps
 *     the spring for zero-duration timing so AT users see no
 *     transition at all.
 *
 * Every styling + a11y decision is delegated to `./style.ts` so the
 * node-only vitest suite can exercise them without a DOM.
 */
export const GlassInput = forwardRef<unknown, GlassInputProps>(function GlassInput(
  {
    label,
    value,
    defaultValue,
    placeholder,
    onChangeText,
    onFocus,
    onBlur,
    onSubmitEditing,
    disabled = false,
    editable = true,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    autoCorrect,
    autoFocus,
    maxLength,
    returnKeyType,
    invalid = false,
    helperText,
    errorText,
    accessibilityLabel,
    elevation = 1,
    radius = 'md',
    style,
    size = 'md',
    leadingIcon,
    trailingIcon,
  },
  _ref,
) {
  const { theme, preferences } = useAbsoluteUI();
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setFocused(true);
    onFocus?.();
  }, [onFocus]);
  const handleBlur = useCallback(() => {
    setFocused(false);
    onBlur?.();
  }, [onBlur]);

  // Motion: spring the focus intensity (0..1). `useAnimatedStyle`
  // reads it and drives a tiny `scale` lift so focused fields visibly
  // activate without shifting layout.
  const focusIntensity = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    const target = focused ? 1 : 0;
    focusIntensity.value = preferences.reducedMotion
      ? withTiming(target, instantTiming)
      : withSpring(target, gentleCfg);
  }, [focused, preferences.reducedMotion]);

  const surfaceAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + focusIntensity.value * FOCUS_LIFT }],
  }));

  const interactive = isGlassInputInteractive({ disabled, editable });
  const errorColor = theme.colors.danger;
  const containerStyle = buildGlassInputContainerStyle({
    focused,
    disabled,
    invalid,
    focusRingColor: theme.colors.focusRing,
    errorColor,
    size,
  }) as unknown as ViewStyle;
  const inputStyle = buildGlassInputTextStyle(
    theme.colors.textPrimary,
    size,
  ) as unknown as TextStyle;
  // `flex: 1` lets the TextInput expand to fill the row between any
  // leading / trailing icon slots. Without it a single-icon layout
  // would collapse the input to its intrinsic width.
  const inputStyleWithFlex: TextStyle = { ...inputStyle, flex: 1 };
  const placeholderColor = resolveGlassInputPlaceholderColor(theme.colors.textSecondary);
  const labelStyle = buildGlassInputLabelStyle(
    theme.colors.textPrimary,
    size,
  ) as unknown as TextStyle;
  const helperStyle = buildGlassInputHelperStyle({
    textSecondary: theme.colors.textSecondary,
    errorColor,
    invalid,
    size,
  }) as unknown as TextStyle;
  const iconSize = resolveGlassInputSize(size).iconSize;
  const iconBoxStyle: ViewStyle = {
    width: iconSize,
    height: iconSize,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const resolvedLabel = resolveGlassInputAccessibilityLabel({
    accessibilityLabel,
    label,
    placeholder,
  });
  const resolvedHint = resolveGlassInputAccessibilityHint({
    helperText,
    errorText,
    invalid,
  });
  const a11yState = resolveGlassInputAccessibilityState({ disabled, editable });

  const visibleHelper = invalid && errorText !== undefined ? errorText : helperText;

  return (
    <View style={style}>
      {label !== undefined ? <Text style={labelStyle}>{label}</Text> : null}
      <AnimatedView style={surfaceAnimStyle}>
        <GlassSurface elevation={elevation} radius={radius} style={containerStyle}>
          {leadingIcon !== undefined ? (
            <View accessibilityRole="none" style={iconBoxStyle}>
              {leadingIcon}
            </View>
          ) : null}
          <TextInput
            accessibilityLabel={resolvedLabel}
            accessibilityHint={resolvedHint}
            accessibilityState={a11yState}
            aria-invalid={invalid}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            editable={interactive}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            autoFocus={autoFocus}
            maxLength={maxLength}
            returnKeyType={returnKeyType}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={onSubmitEditing}
            style={inputStyleWithFlex}
          />
          {trailingIcon !== undefined ? (
            <View accessibilityRole="none" style={iconBoxStyle}>
              {trailingIcon}
            </View>
          ) : null}
        </GlassSurface>
      </AnimatedView>
      {visibleHelper !== undefined ? <Text style={helperStyle}>{visibleHelper}</Text> : null}
    </View>
  );
});

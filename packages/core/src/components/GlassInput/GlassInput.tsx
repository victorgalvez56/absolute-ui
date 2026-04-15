import { forwardRef, useCallback, useState } from 'react';
import {
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import {
  buildGlassInputContainerStyle,
  buildGlassInputHelperStyle,
  buildGlassInputLabelStyle,
  buildGlassInputTextStyle,
  isGlassInputInteractive,
  resolveGlassInputAccessibilityHint,
  resolveGlassInputAccessibilityLabel,
  resolveGlassInputAccessibilityState,
  resolveGlassInputPlaceholderColor,
} from './style.js';

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
  },
  _ref,
) {
  const { theme } = useAbsoluteUI();
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setFocused(true);
    onFocus?.();
  }, [onFocus]);
  const handleBlur = useCallback(() => {
    setFocused(false);
    onBlur?.();
  }, [onBlur]);

  const interactive = isGlassInputInteractive({ disabled, editable });
  const errorColor = theme.colors.focusRing; // palette lacks a dedicated danger token in Phase 3; reuse focusRing-strong until the tokens package ships a `danger` role. Tracked as Phase 3 debt.
  const containerStyle = buildGlassInputContainerStyle({
    focused,
    disabled,
    invalid,
    focusRingColor: theme.colors.focusRing,
    errorColor,
  }) as unknown as ViewStyle;
  const inputStyle = buildGlassInputTextStyle(theme.colors.textPrimary) as unknown as TextStyle;
  const placeholderColor = resolveGlassInputPlaceholderColor(theme.colors.textSecondary);
  const labelStyle = buildGlassInputLabelStyle(theme.colors.textPrimary) as unknown as TextStyle;
  const helperStyle = buildGlassInputHelperStyle({
    textSecondary: theme.colors.textSecondary,
    errorColor,
    invalid,
  }) as unknown as TextStyle;

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
      <GlassSurface elevation={elevation} radius={radius} style={containerStyle}>
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
          style={inputStyle}
        />
      </GlassSurface>
      {visibleHelper !== undefined ? <Text style={helperStyle}>{visibleHelper}</Text> : null}
    </View>
  );
});

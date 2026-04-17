import { forwardRef, useCallback, useState } from 'react';
import {
  Pressable,
  type PressableStateCallbackType,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import {
  buildGlassSwitchLabelStyle,
  buildGlassSwitchThumbStyle,
  buildGlassSwitchTrackStyle,
  buildGlassSwitchWrapperStyle,
  isGlassSwitchInteractive,
  resolveGlassSwitchAccessibilityLabel,
  resolveGlassSwitchAccessibilityState,
  resolveNextSwitchValue,
} from './style.js';

export type GlassSwitchProps = {
  /**
   * Controlled value. When both `value` and `defaultValue` are
   * omitted, the switch is uncontrolled and starts off.
   */
  value?: boolean;
  defaultValue?: boolean;
  /**
   * Fires with the next value on press. Omit to make the switch
   * decorative (rendered + announced as disabled but still reflects
   * `value` visually — useful for read-only settings rows).
   */
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
  /**
   * Visible label rendered to the left of the track. Doubles as the
   * accessibility label unless `accessibilityLabel` is set explicitly.
   * Tapping the label toggles the switch because the whole row is a
   * single Pressable.
   */
  label?: string;
  accessibilityLabel?: string;
  /**
   * Extra layout style for the outer wrapper. Use for margin / width,
   * not visual overrides — the track/thumb geometry is fixed.
   */
  style?: ViewStyle;
};

/**
 * Liquid-glass on/off switch. A single Pressable wraps an optional
 * text label plus a 52x32 pill-shaped track with a 24dp thumb that
 * flips between two rest positions. Every visual and a11y decision
 * delegates to `./style.ts` so the node-only vitest suite can
 * exercise them without a DOM.
 *
 * Interaction contract:
 *   - 44dp minimum hit target enforced by the outer wrapper so the
 *     compact visual track doesn't starve users of tap area.
 *   - Focus state comes from Pressable's `focused` callback so
 *     keyboard and switch-control navigation see the same themed
 *     ring GlassButton / GlassInput use.
 *   - `disabled` wins over `focused` wins over `idle`. Disabled +
 *     focused suppresses the ring — matches the rest of Phase 3.
 *   - No motion yet: the thumb snaps between positions. Reduced
 *     Motion is therefore a no-op; Phase 4's motion layer will add a
 *     spring and gate it on `preferences.reducedMotion`.
 *
 * Supports both controlled (`value` + `onValueChange`) and
 * uncontrolled (`defaultValue`) modes. In uncontrolled mode the
 * next-value resolver is the source of truth and `onValueChange`
 * still fires so consumers can observe without owning state.
 */
export const GlassSwitch = forwardRef<unknown, GlassSwitchProps>(function GlassSwitch(
  {
    value,
    defaultValue = false,
    onValueChange,
    disabled = false,
    label,
    accessibilityLabel,
    style,
  },
  _ref,
) {
  const { theme } = useAbsoluteUI();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const checked = value ?? internalValue;

  const hasOnValueChange = onValueChange !== undefined;
  const interactive = isGlassSwitchInteractive({ disabled, hasOnValueChange });

  const handlePress = useCallback(() => {
    const next = resolveNextSwitchValue({ checked, disabled, hasOnValueChange });
    if (next === checked) return;
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }, [checked, disabled, hasOnValueChange, onValueChange, value]);

  const wrapperStyle = buildGlassSwitchWrapperStyle() as unknown as ViewStyle;
  const labelStyle = buildGlassSwitchLabelStyle(theme.colors.textPrimary);
  const thumbStyle = buildGlassSwitchThumbStyle({
    checked,
    thumbColor: theme.colors.onAccent,
  }) as unknown as ViewStyle;

  const pressableStyle = useCallback(
    ({ focused }: PressableStateCallbackType): ViewStyle => {
      const track = buildGlassSwitchTrackStyle({
        checked,
        disabled,
        focused: focused ?? false,
        checkedColor: theme.colors.accent,
        uncheckedColor: theme.colors.divider,
        focusRingColor: theme.colors.focusRing,
      });
      return track as unknown as ViewStyle;
    },
    [checked, disabled, theme.colors.accent, theme.colors.divider, theme.colors.focusRing],
  );

  const resolvedLabel = resolveGlassSwitchAccessibilityLabel({ accessibilityLabel, label });
  const a11yState = resolveGlassSwitchAccessibilityState({
    checked,
    disabled,
    hasOnValueChange,
  });

  return (
    <View style={[wrapperStyle, style]}>
      {label !== undefined ? <Text style={labelStyle}>{label}</Text> : null}
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={resolvedLabel}
        accessibilityState={a11yState}
        disabled={!interactive}
        onPress={handlePress}
        style={pressableStyle}
      >
        <View style={thumbStyle} />
      </Pressable>
    </View>
  );
});

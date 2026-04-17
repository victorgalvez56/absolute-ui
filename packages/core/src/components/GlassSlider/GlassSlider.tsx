import { forwardRef, useCallback, useState } from 'react';
import {
  type KeyboardEventLike,
  type LayoutChangeEvent,
  Pressable,
  type PressableStateCallbackType,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import {
  buildGlassSliderFilledStyle,
  buildGlassSliderLabelStyle,
  buildGlassSliderRowStyle,
  buildGlassSliderThumbStyle,
  buildGlassSliderTrackStyle,
  buildGlassSliderValueStyle,
  buildGlassSliderWrapperStyle,
  clampValue,
  computeProgress,
  computeThumbLeft,
  deriveNextValueFromKey,
  isGlassSliderInteractive,
  keyPressMovedValue,
  resolveGlassSliderAccessibilityLabel,
  resolveGlassSliderAccessibilityState,
  resolveGlassSliderAccessibilityValue,
  snapToStep,
} from './style.js';

export type GlassSliderProps = {
  /**
   * Controlled value. When both `value` and `defaultValue` are
   * omitted, the slider starts at `minimumValue`.
   */
  value?: number;
  defaultValue?: number;
  /**
   * Fires with the next snapped value after every keyboard adjustment.
   * Omit to make the slider decorative — rendered + announced as
   * disabled but still reflects `value` visually.
   */
  onValueChange?: (next: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  /**
   * Step resolution. Defaults to 1. Step=0 is treated as stepless
   * (the value is clamped but not snapped), which is useful for
   * continuous sliders that read out a value via `formatValue`.
   */
  step?: number;
  disabled?: boolean;
  /**
   * Visible label rendered above the track. Doubles as the
   * accessibility label unless `accessibilityLabel` is set.
   */
  label?: string;
  accessibilityLabel?: string;
  /**
   * Optional value formatter used both for the inline readout (right
   * of the label) and for the `accessibilityValue.text` string that
   * screen readers announce. Receives the current numeric value.
   */
  formatValue?: (value: number) => string;
  /**
   * Whether to render the numeric readout next to the label. Defaults
   * to true when `formatValue` is provided so the visual readout
   * matches what AT announces.
   */
  showValue?: boolean;
  style?: ViewStyle;
};

/**
 * Liquid-glass continuous slider. A single Pressable owns the 44dp
 * track row; keyboard arrow / Page / Home / End keys adjust the value
 * following the WAI-ARIA slider pattern. Tap-to-position and pan
 * gestures are deferred to Phase 4 when the motion / gesture layer
 * lands — the keyboard path is enough to satisfy the Phase 3
 * accessibility contract on its own.
 *
 * Interaction contract:
 *   - 44dp min hit target on the outer row; the visible track sits
 *     centered inside so the tap area extends well past the 6dp pill
 *   - focus via Pressable.focused -> themed ring identical to the
 *     rest of the Phase 3 primitives
 *   - disabled > focused > idle priority; disabled suppresses the ring
 *   - no motion: the thumb snaps instantly between stepped positions,
 *     so Reduced Motion is already a no-op
 *   - accessibilityRole='adjustable' + accessibilityValue={min,max,
 *     now,text} so VoiceOver/TalkBack announce "Volume 42%, 42 of 100"
 *     and expose the standard increment/decrement actions
 *
 * Every numeric / styling / a11y decision is delegated to `./style.ts`
 * so the node-only vitest suite can exercise it without a DOM.
 */
export const GlassSlider = forwardRef<unknown, GlassSliderProps>(function GlassSlider(
  {
    value,
    defaultValue,
    onValueChange,
    minimumValue = 0,
    maximumValue = 100,
    step = 1,
    disabled = false,
    label,
    accessibilityLabel,
    formatValue,
    showValue,
    style,
  },
  _ref,
) {
  const { theme } = useAbsoluteUI();

  const initial = snapToStep({
    value: defaultValue ?? minimumValue,
    min: minimumValue,
    max: maximumValue,
    step,
  });
  const [internalValue, setInternalValue] = useState(initial);
  const raw = value ?? internalValue;
  const current = clampValue({ value: raw, min: minimumValue, max: maximumValue });

  const [trackWidth, setTrackWidth] = useState(0);
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const hasOnValueChange = onValueChange !== undefined;
  const interactive = isGlassSliderInteractive({ disabled, hasOnValueChange });

  const applyValue = useCallback(
    (next: number) => {
      if (next === current) return;
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [current, onValueChange, value],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEventLike) => {
      if (!interactive) return;
      const options = {
        key: event.key,
        current,
        min: minimumValue,
        max: maximumValue,
        step,
      };
      if (!keyPressMovedValue(options)) return;
      event.preventDefault();
      const next = deriveNextValueFromKey(options);
      applyValue(next);
    },
    [applyValue, current, interactive, maximumValue, minimumValue, step],
  );

  const progress = computeProgress({ value: current, min: minimumValue, max: maximumValue });
  const wrapperStyle = buildGlassSliderWrapperStyle() as unknown as ViewStyle;
  const trackStyle = buildGlassSliderTrackStyle({
    trackColor: theme.colors.divider,
  }) as unknown as ViewStyle;
  const filledStyle = buildGlassSliderFilledStyle({
    progress,
    filledColor: theme.colors.accent,
  }) as unknown as ViewStyle;
  const thumbStyle = buildGlassSliderThumbStyle({
    thumbColor: theme.colors.onAccent,
    thumbLeft: computeThumbLeft({ progress, trackWidth }),
  }) as unknown as ViewStyle;
  const labelStyle = buildGlassSliderLabelStyle(theme.colors.textPrimary);
  const valueStyle = buildGlassSliderValueStyle(theme.colors.textSecondary);

  const rowStyle = useCallback(
    ({ focused }: PressableStateCallbackType): ViewStyle => {
      const row = buildGlassSliderRowStyle({
        disabled,
        focused: focused ?? false,
        focusRingColor: theme.colors.focusRing,
      });
      return row as unknown as ViewStyle;
    },
    [disabled, theme.colors.focusRing],
  );

  const resolvedLabel = resolveGlassSliderAccessibilityLabel({ accessibilityLabel, label });
  const a11yValue = resolveGlassSliderAccessibilityValue(
    formatValue
      ? { value: current, min: minimumValue, max: maximumValue, formatValue }
      : { value: current, min: minimumValue, max: maximumValue },
  );
  const a11yState = resolveGlassSliderAccessibilityState({ disabled, hasOnValueChange });

  const shouldShowValue = showValue ?? formatValue !== undefined;
  const valueReadout = formatValue ? formatValue(current) : String(current);

  const headerVisible = label !== undefined || shouldShowValue;

  return (
    <View style={[wrapperStyle, style]}>
      {headerVisible ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          {label !== undefined ? <Text style={labelStyle}>{label}</Text> : <View />}
          {shouldShowValue ? <Text style={valueStyle}>{valueReadout}</Text> : null}
        </View>
      ) : null}
      <Pressable
        accessibilityRole="adjustable"
        accessibilityLabel={resolvedLabel}
        accessibilityValue={a11yValue}
        accessibilityState={a11yState}
        disabled={!interactive}
        onKeyDown={handleKeyDown}
        style={rowStyle}
      >
        <View style={trackStyle} onLayout={handleLayout}>
          <View style={filledStyle} />
        </View>
        <View style={thumbStyle} />
      </Pressable>
    </View>
  );
});

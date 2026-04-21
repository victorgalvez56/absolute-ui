import { spring } from '@absolute-ui/tokens';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type KeyboardEventLike,
  type LayoutChangeEvent,
  Pressable,
  type PressableStateCallbackType,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { AnimatedView } from '../../motion/animated.js';
import { instantTiming, toSpringConfig } from '../../motion/presets.js';
import { useAbsoluteUI } from '../../theme-context.js';
import {
  type GlassPickerItem,
  buildGlassPickerContainerStyle,
  buildGlassPickerIndicatorStyle,
  buildGlassPickerLabelStyle,
  buildGlassPickerSegmentStyle,
  buildGlassPickerSegmentTextStyle,
  deriveNextPickerIndexFromKey,
  isGlassPickerInteractive,
  isGlassPickerSegmentInteractive,
  keyPressMovedPickerIndex,
  resolveGlassPickerAccessibilityLabel,
  resolveGlassPickerSegmentAccessibilityState,
  resolveSelectedIndex,
} from './style.js';

const snappyCfg = toSpringConfig(spring.snappy);
type SegmentLayout = { x: number; width: number };

export type { GlassPickerItem };

export type GlassPickerProps<T> = {
  items: readonly GlassPickerItem<T>[];
  /**
   * Controlled selection. When both `value` and `defaultValue` are
   * omitted, nothing is selected until the user chooses.
   */
  value?: T;
  defaultValue?: T;
  /**
   * Fires with the next value after any user selection (tap or
   * keyboard). Omit to make the group decorative — rendered +
   * announced as disabled but still reflects `value` visually.
   */
  onValueChange?: (next: T) => void;
  disabled?: boolean;
  /**
   * Visible group label rendered above the row. Doubles as the
   * accessibility label unless `accessibilityLabel` is set.
   */
  label?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

/**
 * Liquid-glass segmented single-select. The group announces as
 * `radiogroup`, each segment as `radio` with its own selected and
 * disabled state. For >5 options callers should reach for a
 * GlassSheet-based menu (Phase 4) instead of cramming the row.
 *
 * Interaction contract:
 *   - 44dp hit target on the whole row (segment minHeight +
 *     container padding sums to exactly 44dp)
 *   - focus via Pressable.focused → themed ring identical to the
 *     rest of Phase 3
 *   - disabled > focused > selected > idle priority
 *   - keyboard: arrows navigate (with wrap + skip-disabled), Home
 *     jumps to the first enabled item, End to the last
 *   - selected text flips to theme.onAccent so the tinted selected
 *     segment keeps APCA contrast on every personality
 *   - motion: a single accent indicator slides between segments on
 *     selection change, driven by the `snappy` spring. First render
 *     snaps the indicator to the current selection. `preferences.
 *     reducedMotion` swaps the spring for zero-duration timing so the
 *     final frame is still correct for AT users.
 *
 * Generic over the item value type so callers can use string /
 * number / boolean unions without stringifying.
 */
export function GlassPicker<T>({
  items,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  label,
  accessibilityLabel,
  style,
}: GlassPickerProps<T>) {
  const { theme, preferences } = useAbsoluteUI();
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const selectedValue = value ?? internalValue;
  const selectedIndex = resolveSelectedIndex({ items, selectedValue });

  const hasOnValueChange = onValueChange !== undefined;
  const groupInteractive = isGlassPickerInteractive({ disabled, hasOnValueChange });

  // Sliding indicator: same pattern as GlassTabBar. Track per-segment
  // (x,width) from onLayout, then spring the indicator to the active
  // segment's layout whenever selectedIndex or layouts change.
  const [segmentLayouts, setSegmentLayouts] = useState<Record<number, SegmentLayout>>({});
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const initialPositioned = useRef(false);

  useEffect(() => {
    if (selectedIndex === -1) {
      // Collapse the indicator when nothing is selected.
      indicatorWidth.value = preferences.reducedMotion
        ? withTiming(0, instantTiming)
        : withSpring(0, snappyCfg);
      return;
    }
    const layout = segmentLayouts[selectedIndex];
    if (layout === undefined) return;
    if (!initialPositioned.current) {
      initialPositioned.current = true;
      indicatorX.value = layout.x;
      indicatorWidth.value = layout.width;
      return;
    }
    if (preferences.reducedMotion) {
      indicatorX.value = withTiming(layout.x, instantTiming);
      indicatorWidth.value = withTiming(layout.width, instantTiming);
    } else {
      indicatorX.value = withSpring(layout.x, snappyCfg);
      indicatorWidth.value = withSpring(layout.width, snappyCfg);
    }
  }, [selectedIndex, segmentLayouts, preferences.reducedMotion]);

  const indicatorAnimStyle = useAnimatedStyle(() => ({
    width: indicatorWidth.value,
    transform: [{ translateX: indicatorX.value }],
  }));

  const handleSegmentLayout = useCallback((index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setSegmentLayouts((prev) => ({ ...prev, [index]: { x, width } }));
  }, []);

  const applyIndex = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      if (item.disabled) return;
      if (item.value === selectedValue) return;
      if (value === undefined) setInternalValue(item.value);
      onValueChange?.(item.value);
    },
    [items, onValueChange, selectedValue, value],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEventLike) => {
      if (!groupInteractive) return;
      const keyInfo = { key: event.key, currentIndex: selectedIndex, items };
      if (!keyPressMovedPickerIndex(keyInfo)) return;
      event.preventDefault();
      applyIndex(deriveNextPickerIndexFromKey(keyInfo));
    },
    [applyIndex, groupInteractive, items, selectedIndex],
  );

  const containerStyle = buildGlassPickerContainerStyle({
    disabled,
    backgroundColor: theme.colors.divider,
  }) as unknown as ViewStyle;
  const labelStyle = buildGlassPickerLabelStyle(theme.colors.textPrimary);
  const indicatorBaseStyle = buildGlassPickerIndicatorStyle({
    accentColor: theme.colors.accent,
  }) as unknown as ViewStyle;
  const resolvedLabel = resolveGlassPickerAccessibilityLabel({ accessibilityLabel, label });

  return (
    <View style={style}>
      {label !== undefined ? <Text style={labelStyle}>{label}</Text> : null}
      <View
        style={[containerStyle, { position: 'relative' }]}
        accessibilityRole="radiogroup"
        accessibilityLabel={resolvedLabel}
      >
        {/* Sliding accent indicator — renders first so segments paint above it. */}
        <AnimatedView style={[indicatorBaseStyle, indicatorAnimStyle]} pointerEvents="none" />
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          const segmentInteractive = isGlassPickerSegmentInteractive({
            groupInteractive,
            item,
          });
          const textStyle = buildGlassPickerSegmentTextStyle({
            selected,
            selectedTextColor: theme.colors.onAccent,
            unselectedTextColor: theme.colors.textPrimary,
          });
          const a11yState = resolveGlassPickerSegmentAccessibilityState({
            selected,
            groupInteractive,
            itemDisabled: item.disabled === true,
          });

          const segmentStyle = ({ focused }: PressableStateCallbackType): ViewStyle => {
            // Segment bg stays transparent — the animated indicator
            // owns the selected tint so the crossing actually slides.
            const s = buildGlassPickerSegmentStyle({
              selected,
              disabled: !segmentInteractive,
              focused: focused ?? false,
              selectedColor: 'transparent',
              unselectedColor: 'transparent',
              focusRingColor: theme.colors.focusRing,
            });
            return s as unknown as ViewStyle;
          };

          return (
            <Pressable
              key={String(item.value)}
              accessibilityRole="radio"
              accessibilityLabel={item.label}
              accessibilityState={a11yState}
              disabled={!segmentInteractive}
              onPress={() => applyIndex(index)}
              onKeyDown={handleKeyDown}
              onLayout={(e) => handleSegmentLayout(index, e)}
              style={segmentStyle}
            >
              <Text style={textStyle}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

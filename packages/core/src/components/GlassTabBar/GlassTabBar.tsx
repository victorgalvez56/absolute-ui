import type { ReactNode } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { spring } from '@absolute-ui/tokens';
import { useAbsoluteUI } from '../../theme-context.js';
import { toSpringConfig, instantTiming } from '../../motion/presets.js';
import { usePressScale } from '../../motion/index.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import {
  buildTabBarContainerStyle,
  buildTabIndicatorBaseStyle,
  buildTabItemStyle,
  buildTabLabelStyle,
} from './style.js';

export type GlassTabBarItem = {
  /** Stable identifier used by `activeKey` and `onTabPress`. */
  key: string;
  /** Visible label rendered beneath any leading node. */
  label: string;
  /**
   * Optional custom accessibility label. Defaults to `label` plus
   * "tab" — e.g. "Home, tab". Override when the visible label
   * alone isn't descriptive (icons-only rows).
   */
  accessibilityLabel?: string;
  /**
   * Optional leading node, usually an icon. Rendered above the
   * label. Kept as a free ReactNode so consumers can drop in
   * SVG, emoji, or lottie without a constraint.
   */
  leading?: ReactNode;
};

export type GlassTabBarProps = {
  items: ReadonlyArray<GlassTabBarItem>;
  activeKey: string;
  onTabPress: (key: string) => void;
  elevation?: GlassSurfaceProps['elevation'];
  radius?: GlassSurfaceProps['radius'];
  style?: ViewStyle;
};

// ----- TabItem sub-component -----

type TabItemProps = {
  item: GlassTabBarItem;
  active: boolean;
  textColor: string;
  accentColor: string;
  onPress: (key: string) => void;
};

/**
 * Each tab item owns its own usePressScale hook so the hook rules
 * (no conditional calls) are respected. The press animation is
 * applied to an Animated.View wrapping the Pressable.
 */
function TabItem({ item, active, textColor, onPress }: TabItemProps) {
  const { onPressIn, onPressOut, pressStyle } = usePressScale();
  const itemStyle = buildTabItemStyle({ active });
  const labelStyle = buildTabLabelStyle({ color: textColor, active });
  const label = item.accessibilityLabel ?? `${item.label}, tab`;

  return (
    <Animated.View style={[itemStyle, pressStyle]}>
      <Pressable
        onPress={() => onPress(item.key)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: active }}
        style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        {item.leading ?? null}
        <Text style={labelStyle}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ----- GlassTabBar -----

type TabLayout = { x: number; width: number };
const snappyCfg = toSpringConfig(spring.snappy);

/**
 * Bottom tab bar with a sliding accent indicator and per-tab press
 * scale feedback.
 *
 * The indicator is an absolutely-positioned bar whose translateX and
 * width animate via the 'snappy' spring whenever activeKey changes.
 * On first layout the indicator snaps to the active tab position
 * without animating. Reduced Motion: instant jump instead of spring.
 *
 * Accessibility: container uses role="list", each tab uses role="button"
 * with accessibilityState.selected. The structural indicator (shape
 * change + weight change) is the non-color active-state cue.
 */
export const GlassTabBar = forwardRef<unknown, GlassTabBarProps>(function GlassTabBar(
  { items, activeKey, onTabPress, elevation = 2, radius = '2xl', style },
  _ref,
) {
  const { theme, preferences } = useAbsoluteUI();

  // Track each tab's x + width after layout.
  const [tabLayouts, setTabLayouts] = useState<Record<string, TabLayout>>({});
  // Whether the indicator has been positioned for the first time.
  const initialPositioned = useRef(false);

  // Animated shared values for the indicator.
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Slide the indicator whenever the active key changes or new
  // layouts arrive.
  useEffect(() => {
    const layout = tabLayouts[activeKey];
    if (layout === undefined) return;

    if (!initialPositioned.current) {
      // First time: snap to position, no spring.
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
  }, [activeKey, tabLayouts, preferences.reducedMotion]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidth.value,
    transform: [{ translateX: indicatorX.value }],
  }));

  const containerStyle = buildTabBarContainerStyle();
  const indicatorBaseStyle = buildTabIndicatorBaseStyle(theme.colors.accent);
  const styleProps = style !== undefined ? { style } : {};

  const handleTabLayout = (key: string, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [key]: { x, width } }));
  };

  return (
    <GlassSurface elevation={elevation} radius={radius} {...styleProps} accessibilityRole="none">
      <View style={[containerStyle, { position: 'relative' }]} accessibilityRole="list">
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <View
              key={item.key}
              style={{ flex: 1 }}
              onLayout={(e) => handleTabLayout(item.key, e)}
            >
              <TabItem
                item={item}
                active={active}
                textColor={theme.colors.textPrimary}
                accentColor={theme.colors.accent}
                onPress={onTabPress}
              />
            </View>
          );
        })}
        {/* Sliding indicator overlaid at the bottom of the row. */}
        <Animated.View style={[indicatorBaseStyle, indicatorStyle]} pointerEvents="none" />
      </View>
    </GlassSurface>
  );
});

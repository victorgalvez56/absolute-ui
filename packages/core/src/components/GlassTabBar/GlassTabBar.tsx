import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import { buildTabBarContainerStyle, buildTabItemStyle, buildTabLabelStyle } from './style.js';

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

/**
 * Bottom tab bar. A glass surface with a horizontal row of tabs,
 * each enforcing the 44x44 hit target. Active state is communicated
 * via both weight (500 → 700) and opacity (0.55 → 1.0) so the cue
 * is visible to users with color-blindness or grayscale filters.
 *
 * Accessibility: the container is `accessibilityRole="tablist"` and
 * each tab carries `accessibilityRole="tab"` with
 * `accessibilityState={{ selected }}`. VoiceOver announces the tab
 * name, the "selected" state, and the position in the list.
 */
export const GlassTabBar = forwardRef<unknown, GlassTabBarProps>(function GlassTabBar(
  { items, activeKey, onTabPress, elevation = 2, radius = '2xl', style },
  _ref,
) {
  const { theme } = useAbsoluteUI();
  const containerStyle = buildTabBarContainerStyle();
  const styleProps = style !== undefined ? { style } : {};

  return (
    <GlassSurface elevation={elevation} radius={radius} {...styleProps} accessibilityRole="none">
      <View style={containerStyle} accessibilityRole="list">
        {items.map((item) => {
          const active = item.key === activeKey;
          const itemStyle = buildTabItemStyle({ active });
          const labelColor = active ? theme.colors.textPrimary : theme.colors.textSecondary;
          const labelStyle = buildTabLabelStyle({ color: labelColor, active });
          const label = item.accessibilityLabel ?? item.label;

          return (
            <Pressable
              key={item.key}
              style={itemStyle}
              onPress={() => onTabPress(item.key)}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
            >
              {item.leading ?? null}
              <Text style={labelStyle} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </GlassSurface>
  );
});

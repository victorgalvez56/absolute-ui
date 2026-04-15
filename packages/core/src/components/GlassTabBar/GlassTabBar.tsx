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
 * via two non-color cues: the label weight steps from 500 to 700,
 * and the item renders a 2pt structural underline in the theme's
 * accent color (inactive tabs paint the same border in
 * `transparent` so the layout stays stable across state changes).
 *
 * Accessibility: `react-native`'s AccessibilityRole shim does not
 * include `tab` / `tablist`, so the container falls back to `list`
 * and each item to `button`. VoiceOver still announces the tab
 * name via the Pressable's label, and `accessibilityState.selected`
 * reports the active tab. When the shim gains `tab` / `tablist`,
 * swap both roles in one place without touching the behavior.
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
          const itemStyle = buildTabItemStyle({
            active,
            accentColor: theme.colors.accent,
          });
          // Always use textPrimary for the label. Dimming to textSecondary
          // previously broke the APCA Lc 60 floor on all four themes.
          // Active vs inactive is conveyed by weight + underline, not color.
          const labelStyle = buildTabLabelStyle({
            color: theme.colors.textPrimary,
            active,
          });
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
              <Text style={labelStyle}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </GlassSurface>
  );
});

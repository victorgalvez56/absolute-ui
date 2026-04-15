import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import {
  buildNavBarContainerStyle,
  buildNavBarLeadingSlotStyle,
  buildNavBarTitleStyle,
  buildNavBarTrailingSlotStyle,
} from './style.js';

export type GlassNavBarProps = {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  elevation?: GlassSurfaceProps['elevation'];
  radius?: GlassSurfaceProps['radius'];
  style?: ViewStyle;
};

/**
 * Top navigation bar. A glass surface with a fixed-height row
 * containing a leading slot, a centered title, and a trailing slot.
 * Slots have equal width so the title stays optically centered even
 * when only one side is populated.
 *
 * Default elevation is 2 (above inline surfaces but below modals)
 * and default radius is 'none' because the bar typically runs
 * edge-to-edge under the status bar. Both overridable.
 *
 * Accessibility: title is announced with role="header", container
 * uses role="none" so VO doesn't say "group" before the heading.
 */
export const GlassNavBar = forwardRef<unknown, GlassNavBarProps>(function GlassNavBar(
  { title, leading, trailing, elevation = 2, radius = 'none', style },
  _ref,
) {
  const { theme } = useAbsoluteUI();
  const containerStyle = buildNavBarContainerStyle();
  const leadingStyle = buildNavBarLeadingSlotStyle();
  const trailingStyle = buildNavBarTrailingSlotStyle();
  const titleStyle = buildNavBarTitleStyle(theme.colors.textPrimary);

  const styleProps = style !== undefined ? { style } : {};

  return (
    <GlassSurface elevation={elevation} radius={radius} {...styleProps} accessibilityRole="none">
      <View style={containerStyle}>
        <View style={leadingStyle}>{leading ?? null}</View>
        <Text style={titleStyle} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        <View style={trailingStyle}>{trailing ?? null}</View>
      </View>
    </GlassSurface>
  );
});

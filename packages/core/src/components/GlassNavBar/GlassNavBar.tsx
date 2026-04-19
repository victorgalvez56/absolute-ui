import type { ReactNode } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { spring } from '@absolute-ui/tokens';
import { useAbsoluteUI } from '../../theme-context.js';
import { toSpringConfig, instantTiming } from '../../motion/presets.js';
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

const gentleCfg = toSpringConfig(spring.gentle);

/**
 * Top navigation bar with a one-shot mount entrance animation.
 * Fades in and slides down from −8 px on first render using the
 * 'gentle' spring. Subsequent renders are not re-animated.
 * Reduced Motion: instant opacity only, no translate.
 */
export const GlassNavBar = forwardRef<unknown, GlassNavBarProps>(function GlassNavBar(
  { title, leading, trailing, elevation = 2, radius = 'none', style },
  _ref,
) {
  const { theme, preferences } = useAbsoluteUI();

  // Capture the preference at mount time — the entrance is a one-shot
  // event so we don't need to react to preference changes mid-flight.
  const reducedMotionAtMount = useRef(preferences.reducedMotion);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);

  useEffect(() => {
    if (reducedMotionAtMount.current) {
      opacity.value = withTiming(1, instantTiming);
      translateY.value = withTiming(0, instantTiming);
    } else {
      opacity.value = withSpring(1, gentleCfg);
      translateY.value = withSpring(0, gentleCfg);
    }
    // Empty deps — mount-only animation, intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mountStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const containerStyle = buildNavBarContainerStyle();
  const leadingStyle = buildNavBarLeadingSlotStyle();
  const trailingStyle = buildNavBarTrailingSlotStyle();
  const titleStyle = buildNavBarTitleStyle(theme.colors.textPrimary);
  const styleProps = style !== undefined ? { style } : {};

  return (
    <Animated.View style={mountStyle}>
      <GlassSurface elevation={elevation} radius={radius} {...styleProps} accessibilityRole="none">
        <View style={containerStyle}>
          <View style={leadingStyle}>{leading ?? null}</View>
          <Text style={titleStyle} accessibilityRole="header" numberOfLines={1}>
            {title}
          </Text>
          <View style={trailingStyle}>{trailing ?? null}</View>
        </View>
      </GlassSurface>
    </Animated.View>
  );
});

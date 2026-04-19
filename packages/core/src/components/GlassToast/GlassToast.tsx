import { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { AnimatedView } from '../../motion/animated.js';
import { useEnterExit } from '../../motion/index.js';
import { GlassSurface } from '../GlassSurface/index.js';
import {
  type ToastPosition,
  type ToastVariant,
  buildToastContainerStyle,
  buildToastMessageStyle,
  buildToastPillStyle,
  buildToastStripeStyle,
  resolveToastStripeColor,
} from './style.js';

export type GlassToastProps = {
  visible: boolean;
  message: string;
  /** Defaults to 'default' — the neutral theme-accent variant. */
  variant?: ToastVariant;
  /** Defaults to 'bottom'. */
  position?: ToastPosition;
  /**
   * Optional accessible label. When omitted, the visible `message`
   * is used as the accessible name. Override when the message is
   * truncated or contains shorthand that should be spelled out
   * for screen-reader users.
   */
  accessibilityLabel?: string;
};

/** Slide offset used for the enter/exit translation. */
const SLIDE_OFFSET = 24;

/**
 * Ephemeral notification toast with a slide+fade enter/exit animation.
 *
 * Bottom toast: slides up from below (+24 → 0).
 * Top toast:    slides down from above (−24 → 0).
 * Reduced Motion: instant opacity swap, no translate.
 */
export const GlassToast = forwardRef<unknown, GlassToastProps>(function GlassToast(
  { visible, message, variant = 'default', position = 'bottom', accessibilityLabel },
  _ref,
) {
  const { theme } = useAbsoluteUI();

  // Direction: bottom toast slides up (positive Y → 0), top slides down.
  const fromTranslateY = position === 'bottom' ? SLIDE_OFFSET : -SLIDE_OFFSET;

  const { rendered, contentStyle } = useEnterExit(visible, {
    springToken: 'standard',
    fromTranslateY,
  });

  if (!rendered) return null;

  const containerStyle = buildToastContainerStyle(position);
  const pillStyle = buildToastPillStyle();
  const stripeColor = resolveToastStripeColor(variant, theme.colors.accent);
  const stripeStyle = buildToastStripeStyle(stripeColor);
  const messageStyle = buildToastMessageStyle(theme.colors.textPrimary);
  const label = accessibilityLabel ?? message;

  return (
    <View style={containerStyle} pointerEvents="box-none">
      <AnimatedView style={contentStyle}>
        <GlassSurface
          elevation={2}
          radius="pill"
          style={pillStyle}
          accessibilityRole="none"
          accessibilityLabel={label}
        >
          <View style={stripeStyle} />
          <Text style={messageStyle}>{message}</Text>
        </GlassSurface>
      </AnimatedView>
    </View>
  );
});

import { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
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

/**
 * Ephemeral notification toast. Floats over content at the top or
 * bottom of the viewport without a scrim — consumers are expected
 * to drive `visible` via a timer or a result of an async action.
 *
 * The variant drives a small leading stripe (success / error /
 * info / default-accent). The stripe is a structural indicator;
 * assistive tech gets the full message via the Text child, not
 * via the color, so the component is not color-only.
 *
 * `accessibilityLiveRegion="polite"` would be ideal for native
 * RN but is not part of the type shim yet — track for a later
 * shim extension.
 */
export const GlassToast = forwardRef<unknown, GlassToastProps>(function GlassToast(
  { visible, message, variant = 'default', position = 'bottom', accessibilityLabel },
  _ref,
) {
  const { theme } = useAbsoluteUI();
  if (!visible) return null;

  const containerStyle = buildToastContainerStyle(position);
  const pillStyle = buildToastPillStyle();
  const stripeColor = resolveToastStripeColor(variant, theme.colors.accent);
  const stripeStyle = buildToastStripeStyle(stripeColor);
  const messageStyle = buildToastMessageStyle(theme.colors.textPrimary);
  const label = accessibilityLabel ?? message;

  return (
    <View style={containerStyle} pointerEvents="box-none">
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
    </View>
  );
});

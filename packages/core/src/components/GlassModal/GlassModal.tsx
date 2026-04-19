import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { AnimatedView } from '../../motion/animated.js';
import { useEnterExit } from '../../motion/index.js';
import { GlassSurface } from '../GlassSurface/index.js';
import {
  buildModalBackdropStyle,
  buildModalDescriptionStyle,
  buildModalOverlayStyle,
  buildModalSurfaceStyle,
  buildModalTitleStyle,
  resolveModalScrimColor,
} from './style.js';

export type GlassModalProps = {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  description?: string;
  /**
   * Optional override label used only when neither `title` nor
   * `description` is set. Ignored when either is present because
   * the title already serves as the accessible name.
   */
  accessibilityLabel?: string;
  children?: ReactNode;
};

/**
 * Centered dialog modal with a scale+fade enter/exit animation.
 *
 * Enter: content scales from 0.92→1 and fades in; backdrop fades in.
 * Exit:  both reverse, then the component unmounts once the spring
 *        completes (so it never blocks interaction while invisible).
 * Reduced Motion: instant opacity swap, no scale transform.
 */
export const GlassModal = forwardRef<unknown, GlassModalProps>(function GlassModal(
  { visible, onDismiss, title, description, accessibilityLabel, children },
  _ref,
) {
  const { theme, preferences } = useAbsoluteUI();

  const { rendered, contentStyle, backdropAnimStyle } = useEnterExit(visible, {
    springToken: 'snappy',
    fromScale: 0.92,
  });

  if (!rendered) return null;

  const scrimColor = resolveModalScrimColor(theme.dark, preferences.reducedTransparency);
  const overlayStyle = buildModalOverlayStyle();
  const backdropStyle = buildModalBackdropStyle(scrimColor);
  const surfaceStyle = buildModalSurfaceStyle();
  const titleStyle = buildModalTitleStyle(theme.colors.textPrimary);
  const descriptionStyle = buildModalDescriptionStyle(theme.colors.textSecondary);

  const wrapperLabel = title !== undefined ? undefined : accessibilityLabel;
  const wrapperLabelProps = wrapperLabel !== undefined ? { accessibilityLabel: wrapperLabel } : {};

  return (
    <View style={overlayStyle}>
      {/* Backdrop fades in/out independently — no scale transform on the scrim. */}
      <AnimatedView style={[backdropStyle, backdropAnimStyle]}>
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss dialog"
        />
      </AnimatedView>

      {/* Content surface scales + fades. */}
      <AnimatedView style={contentStyle} accessibilityRole="none" {...wrapperLabelProps}>
        <GlassSurface elevation={3} radius="xl" style={surfaceStyle}>
          {title !== undefined ? (
            <Text style={titleStyle} accessibilityRole="header">
              {title}
            </Text>
          ) : null}
          {description !== undefined ? <Text style={descriptionStyle}>{description}</Text> : null}
          {children !== undefined ? <View style={{ gap: 12 }}>{children}</View> : null}
        </GlassSurface>
      </AnimatedView>
    </View>
  );
});

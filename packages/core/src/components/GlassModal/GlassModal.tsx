import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
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
 * Centered dialog modal. Companion to GlassSheet — same scrim
 * contract, same Reduced Transparency alpha bump, same "tap scrim
 * to dismiss" escape route with an explicit screen-reader button,
 * but the content sits in the middle of the viewport instead of
 * the bottom.
 *
 * Phase 2 ships with no animation (instant mount/unmount). The
 * motion layer will wire the theme's `motion.overlay` spring for
 * a scale+fade transition when it lands.
 */
export const GlassModal = forwardRef<unknown, GlassModalProps>(function GlassModal(
  { visible, onDismiss, title, description, accessibilityLabel, children },
  _ref,
) {
  const { theme, preferences } = useAbsoluteUI();
  if (!visible) return null;

  const scrimColor = resolveModalScrimColor(theme.dark, preferences.reducedTransparency);
  const overlayStyle = buildModalOverlayStyle();
  const backdropStyle = buildModalBackdropStyle(scrimColor);
  const surfaceStyle = buildModalSurfaceStyle();
  const titleStyle = buildModalTitleStyle(theme.colors.textPrimary);
  const descriptionStyle = buildModalDescriptionStyle(theme.colors.textSecondary);

  // When a `title` is present, the header Text inside the surface
  // is the accessible name — setting the same label on the wrapper
  // would duplicate the announcement. Use `accessibilityLabel` only
  // as a fallback for title-less dialogs.
  const wrapperLabel = title !== undefined ? undefined : accessibilityLabel;
  const wrapperLabelProps = wrapperLabel !== undefined ? { accessibilityLabel: wrapperLabel } : {};

  return (
    <View style={overlayStyle}>
      <Pressable
        style={backdropStyle}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss dialog"
      />
      <View accessibilityRole="none" {...wrapperLabelProps}>
        <GlassSurface elevation={3} radius="xl" style={surfaceStyle}>
          {title !== undefined ? (
            <Text style={titleStyle} accessibilityRole="header">
              {title}
            </Text>
          ) : null}
          {description !== undefined ? <Text style={descriptionStyle}>{description}</Text> : null}
          {children !== undefined ? <View style={{ gap: 12 }}>{children}</View> : null}
        </GlassSurface>
      </View>
    </View>
  );
});

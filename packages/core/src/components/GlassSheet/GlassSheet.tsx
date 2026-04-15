import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface } from '../GlassSurface/index.js';
import {
  buildSheetBackdropStyle,
  buildSheetContainerStyle,
  buildSheetHandleStyle,
  buildSheetTitleStyle,
  resolveSheetScrimColor,
} from './style.js';

export type GlassSheetProps = {
  /**
   * Whether the sheet is visible. When false, the component renders
   * nothing — there is no fade/slide animation in Phase 1. Phase 2
   * will wire the motion layer via the theme's `motion.overlay`
   * spring so mounting and unmounting become real transitions.
   */
  visible: boolean;
  /**
   * Fires when the user taps the backdrop scrim. Consumers are
   * responsible for setting `visible` to `false` — the component
   * does not own the visibility state.
   */
  onDismiss: () => void;
  /**
   * Optional title rendered above the body. Announced as a header
   * to assistive technology so screen-reader users know which
   * sheet just became active.
   */
  title?: string;
  /**
   * Optional accessible label for the sheet container when no
   * title is supplied. Ignored when `title` is set.
   */
  accessibilityLabel?: string;
  children: ReactNode;
};

/**
 * Bottom-anchored liquid-glass sheet. Composes a GlassSurface at
 * elevation 3 (the plan's reserved slot for modal-adjacent
 * surfaces) with a top drag-handle and a scrim backdrop that
 * dismisses the sheet on tap.
 *
 * Phase 1 contract: no animation. The sheet mounts when `visible`
 * becomes true and unmounts when it becomes false. Phase 2 will
 * add the motion layer.
 *
 * Focus management: the a11y manual test script at
 * `TESTING.md` covers the focus-trap requirement. The scrim carries
 * `accessibilityRole="button"` with an explicit "Dismiss sheet"
 * label so VoiceOver users can escape the sheet without reaching
 * the swipe-out gesture.
 */
export const GlassSheet = forwardRef<unknown, GlassSheetProps>(function GlassSheet(
  { visible, onDismiss, title, accessibilityLabel, children },
  _ref,
) {
  const { theme } = useAbsoluteUI();
  if (!visible) return null;

  const scrimColor = resolveSheetScrimColor(theme.dark);
  const backdropStyle = buildSheetBackdropStyle(scrimColor);
  const containerStyle = buildSheetContainerStyle();
  const handleStyle = buildSheetHandleStyle(theme.colors.divider);
  const titleStyle = buildSheetTitleStyle(theme.colors.textPrimary);

  const sheetLabel = title ?? accessibilityLabel;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      accessibilityRole="none"
    >
      <Pressable
        style={backdropStyle}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss sheet"
      />
      <View style={containerStyle} accessibilityLabel={sheetLabel} accessibilityRole="none">
        <GlassSurface elevation={3} radius="2xl">
          <View style={handleStyle} />
          {title !== undefined ? (
            <Text style={titleStyle} accessibilityRole="header">
              {title}
            </Text>
          ) : null}
          <View style={{ padding: 20 }}>{children}</View>
        </GlassSurface>
      </View>
    </View>
  );
});

import type { ReactNode } from 'react';
import { forwardRef, useCallback } from 'react';
import { Pressable, type PressableStateCallbackType, Text, type ViewStyle } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import {
  buildGlassButtonPressableStyle,
  buildGlassButtonTextStyle,
  isGlassButtonInteractive,
  resolveGlassButtonAccessibilityLabel,
  shouldWrapChildInText,
} from './style.js';

export type GlassButtonProps = {
  /**
   * Accessible label. Required — every button must announce its
   * purpose to screen readers. Falls back to the string child when
   * the consumer passes a single string, but you should still set
   * this explicitly for clarity.
   */
  accessibilityLabel?: string;
  /**
   * Optional hint describing what happens on press (e.g.
   * "opens the share sheet"). Announced after the label.
   */
  accessibilityHint?: string;
  /**
   * Fires on press. Omit to make the button decorative (no press
   * target, no pressed state, but still rendered in the a11y tree
   * as a button with `disabled: true`).
   */
  onPress?: () => void;
  disabled?: boolean;
  /**
   * Elevation forwarded to the underlying GlassSurface.
   * Defaults to 1 — buttons float one step above base surfaces.
   */
  elevation?: GlassSurfaceProps['elevation'];
  /**
   * Corner radius token. Defaults to 'pill' for the classic
   * liquid-glass capsule.
   */
  radius?: GlassSurfaceProps['radius'];
  /**
   * Extra style for the surface wrapper. Prefer `minWidth` and
   * `margin` — avoid fixed `width` / `height`. When the user's
   * Dynamic Type setting scales the label, a fixed width will
   * clip the text. The button's `minWidth: 44` + flex padding
   * already handle the common case without caller overrides.
   */
  style?: ViewStyle;
  /**
   * Children. When a string is passed we render a styled Text
   * node in the theme's onAccent-friendly color. When anything
   * else is passed, we render it as-is so callers can compose
   * icons + labels.
   */
  children: ReactNode;
};

/**
 * Interactive liquid-glass button. Composes a GlassSurface as its
 * outer container and wraps a Pressable inside so the press target,
 * focus ring, and accessibility state live on the same element the
 * screen reader announces.
 *
 * The 44x44 minimum hit target is enforced via minWidth / minHeight
 * on the Pressable, which is the Absolute UI a11y contract floor.
 * On press the surface dims slightly (opacity 0.7) instead of
 * animating; Phase 1 keeps this minimal so Reduced Motion is a
 * no-op. A richer spring-based interaction arrives with the
 * motion layer in Phase 2.
 *
 * All non-JSX behavior (pressable style, text-wrap decision,
 * interactivity, a11y label fallback) lives in `./style.ts` so
 * the node-only vitest suite can exercise it without a DOM.
 */
export const GlassButton = forwardRef<unknown, GlassButtonProps>(function GlassButton(
  {
    accessibilityLabel,
    accessibilityHint,
    onPress,
    disabled = false,
    elevation = 1,
    radius = 'pill',
    style,
    children,
  },
  _ref,
) {
  const { theme } = useAbsoluteUI();
  const interactive = isGlassButtonInteractive({
    disabled,
    hasOnPress: onPress !== undefined,
  });

  const renderContent = useCallback(() => {
    if (shouldWrapChildInText(children)) {
      return <Text style={buildGlassButtonTextStyle(theme.colors.textPrimary)}>{children}</Text>;
    }
    return children;
  }, [children, theme]);

  const focusRingColor = theme.colors.focusRing;
  const pressableStyle = useCallback(
    ({ pressed, focused }: PressableStateCallbackType): ViewStyle =>
      buildGlassButtonPressableStyle({
        pressed,
        disabled,
        focused: focused ?? false,
        focusRingColor,
      }),
    [disabled, focusRingColor],
  );

  return (
    <GlassSurface elevation={elevation} radius={radius} style={style} accessibilityRole="none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={resolveGlassButtonAccessibilityLabel({
          accessibilityLabel,
          child: children,
        })}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !interactive }}
        disabled={!interactive}
        onPress={onPress}
        hitSlop={0}
        style={pressableStyle}
      >
        {renderContent()}
      </Pressable>
    </GlassSurface>
  );
});

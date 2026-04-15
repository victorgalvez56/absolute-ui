import type { ReactNode } from 'react';
import { forwardRef, useCallback } from 'react';
import { Pressable, type PressableStateCallbackType, Text, type ViewStyle } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';

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
   * Extra style for the surface wrapper. Use for width / margin.
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

const MIN_HIT_TARGET = 44;

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
  const isInteractive = !disabled && onPress !== undefined;

  // When the child is a plain string, wrap it in a themed Text node
  // so callers don't have to build typography by hand for the common
  // case. Richer compositions (icons, badges) pass their own nodes.
  const renderContent = useCallback(() => {
    if (typeof children === 'string') {
      return (
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {children}
        </Text>
      );
    }
    return children;
  }, [children, theme]);

  const pressableStyle = useCallback(
    ({ pressed }: PressableStateCallbackType): ViewStyle => ({
      minWidth: MIN_HIT_TARGET,
      minHeight: MIN_HIT_TARGET,
      paddingHorizontal: 20,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
    }),
    [disabled],
  );

  return (
    <GlassSurface elevation={elevation} radius={radius} style={style} accessibilityRole="none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
        }
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !isInteractive }}
        disabled={!isInteractive}
        onPress={onPress}
        hitSlop={0}
        style={pressableStyle}
      >
        {renderContent()}
      </Pressable>
    </GlassSurface>
  );
});

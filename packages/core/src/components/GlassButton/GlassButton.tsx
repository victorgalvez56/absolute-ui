import type { ReactNode } from 'react';
import { createContext, forwardRef, useCallback, useContext } from 'react';
import {
  Pressable,
  type PressableStateCallbackType,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import {
  type GlassButtonAction,
  type GlassButtonSize,
  type GlassButtonVariant,
  buildGlassButtonPressableStyle,
  buildGlassButtonTextStyle,
  isGlassButtonInteractive,
  resolveGlassButtonAccessibilityLabel,
  resolveGlassButtonColors,
  resolveGlassButtonSize,
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
   * When true, a spinner replaces the text/icon slots visually and
   * `accessibilityState.busy` is announced to screen readers. The
   * button becomes non-interactive even with an `onPress`.
   */
  loading?: boolean;
  /**
   * Semantic intent. `primary` = brand CTA (accent), `neutral` =
   * secondary (textPrimary), `danger` = destructive. Default `primary`.
   */
  action?: GlassButtonAction;
  /**
   * Visual treatment. Default `soft` matches the Phase 1 look
   * (glass-only with body text color).
   */
  variant?: GlassButtonVariant;
  /**
   * Vertical rhythm. Default `md`. Every size preserves the 44pt
   * hit-target floor.
   */
  size?: GlassButtonSize;
  /**
   * Elevation forwarded to the underlying GlassSurface. Defaults
   * to 1 — buttons float one step above base surfaces. Ignored by
   * `ghost` / `link` variants which do not render a GlassSurface.
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
   * node in the resolved variant color. When a node is passed,
   * it is rendered as-is so callers can freely compose the
   * `GlassButton.Icon` / `GlassButton.Text` / `GlassButton.Spinner`
   * slots.
   */
  children: ReactNode;
};

/**
 * Interactive liquid-glass button. Composes a GlassSurface as its
 * outer container and wraps a Pressable inside so the press target,
 * focus ring, and accessibility state live on the same element the
 * screen reader announces.
 *
 * Compound slots for opinionated composition:
 *
 *   <GlassButton action="primary" variant="solid">
 *     <GlassButton.Icon>{iconNode}</GlassButton.Icon>
 *     <GlassButton.Text>Save</GlassButton.Text>
 *   </GlassButton>
 *
 * Or loading:
 *
 *   <GlassButton loading>
 *     <GlassButton.Spinner />
 *     <GlassButton.Text>Saving…</GlassButton.Text>
 *   </GlassButton>
 *
 * The 44×44 minimum hit target is enforced via minWidth / minHeight
 * on the Pressable. On press the surface dims slightly (opacity 0.7)
 * instead of animating; Phase 1 keeps this minimal so Reduced Motion
 * is a no-op. A richer spring-based interaction arrives with the
 * motion layer in Phase 2.
 *
 * All non-JSX behavior (pressable style, variant color resolution,
 * size tokens, interactivity, a11y label fallback) lives in
 * `./style.ts` so the node-only vitest suite can exercise it without
 * a DOM.
 */
const GlassButtonRoot = forwardRef<unknown, GlassButtonProps>(function GlassButton(
  {
    accessibilityLabel,
    accessibilityHint,
    onPress,
    disabled = false,
    loading = false,
    action = 'primary',
    variant = 'soft',
    size = 'md',
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
    loading,
  });

  const colors = resolveGlassButtonColors({ action, variant, colors: theme.colors });

  const renderContent = useCallback(() => {
    if (shouldWrapChildInText(children)) {
      return (
        <Text style={buildGlassButtonTextStyle(colors.foreground, size, colors.underline)}>
          {children}
        </Text>
      );
    }
    return (
      <ButtonSlotContext.Provider value={{ size, color: colors.foreground }}>
        {children}
      </ButtonSlotContext.Provider>
    );
  }, [children, colors.foreground, colors.underline, size]);

  const focusRingColor = theme.colors.focusRing;
  const pressableStyle = useCallback(
    ({ pressed, focused }: PressableStateCallbackType): ViewStyle =>
      buildGlassButtonPressableStyle({
        pressed,
        disabled: disabled || loading,
        focused: focused ?? false,
        focusRingColor,
        size,
        backgroundColor: colors.background,
        borderColor: colors.border,
      }) as unknown as ViewStyle,
    [disabled, loading, focusRingColor, size, colors.background, colors.border],
  );

  const pressable = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={resolveGlassButtonAccessibilityLabel({
        accessibilityLabel,
        child: children,
      })}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !interactive, busy: loading }}
      disabled={!interactive}
      onPress={onPress}
      hitSlop={0}
      style={pressableStyle}
    >
      {renderContent()}
    </Pressable>
  );

  if (!colors.useGlassSurface) {
    return style !== undefined ? <View style={style}>{pressable}</View> : pressable;
  }

  const styleProps = style !== undefined ? { style } : {};
  return (
    <GlassSurface elevation={elevation} radius={radius} accessibilityRole="none" {...styleProps}>
      {pressable}
    </GlassSurface>
  );
});

/* ---------- Compound slots ---------- */

type SlotCtx = { size: GlassButtonSize; color: string };
const ButtonSlotContext = createContext<SlotCtx>({ size: 'md', color: '#fff' });

function useButtonSlot(): SlotCtx {
  return useContext(ButtonSlotContext);
}

export type GlassButtonTextProps = {
  children: ReactNode;
  /** Override the inherited variant color (rare). */
  color?: string;
  /** Override the inherited size. */
  size?: GlassButtonSize;
  /** Render with an underline. Link variants opt in automatically. */
  underline?: boolean;
};

/**
 * Named text slot for the button. Inherits the resolved variant color
 * and size from its parent `GlassButton`; overrides are escape hatches.
 */
function GlassButtonText({ children, color, size, underline = false }: GlassButtonTextProps) {
  const slot = useButtonSlot();
  return (
    <Text style={buildGlassButtonTextStyle(color ?? slot.color, size ?? slot.size, underline)}>
      {children}
    </Text>
  );
}

export type GlassButtonIconProps = {
  /** Icon node. Caller controls the glyph. */
  children: ReactNode;
  /** Override icon box size (defaults to the size-derived value). */
  size?: number;
};

/**
 * Named icon slot. Sets a square box sized to match the current button
 * size so callers don't have to hard-code dimensions, and aligns it
 * visually with the text baseline via center alignment.
 */
function GlassButtonIcon({ children, size }: GlassButtonIconProps) {
  const slot = useButtonSlot();
  const iconSize = size ?? resolveGlassButtonSize(slot.size).iconSize;
  return (
    <View
      accessibilityRole="none"
      style={{
        width: iconSize,
        height: iconSize,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}

export type GlassButtonSpinnerProps = {
  /** Override spinner glyph size. Defaults to the size-derived value. */
  size?: number;
  /**
   * Optional label announced to screen readers (e.g. "Saving"). The
   * parent button already sets `accessibilityState.busy: true` when
   * `loading` is true, so this is typically redundant.
   */
  accessibilityLabel?: string;
};

/**
 * Minimal spinner glyph: a circle with a gap. Rendered as a View with
 * a border so it works without external icon libs. Phase 2 replaces
 * this with a Reanimated rotation. Today it is a static hint.
 */
function GlassButtonSpinner({ size, accessibilityLabel }: GlassButtonSpinnerProps) {
  const slot = useButtonSlot();
  const s = size ?? resolveGlassButtonSize(slot.size).iconSize;
  return (
    <View
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
      style={{
        width: s,
        height: s,
        borderRadius: s / 2,
        borderWidth: 2,
        borderColor: slot.color,
        borderTopColor: 'transparent',
      }}
    />
  );
}

type GlassButtonType = typeof GlassButtonRoot & {
  Text: typeof GlassButtonText;
  Icon: typeof GlassButtonIcon;
  Spinner: typeof GlassButtonSpinner;
};

export const GlassButton = GlassButtonRoot as GlassButtonType;
GlassButton.Text = GlassButtonText;
GlassButton.Icon = GlassButtonIcon;
GlassButton.Spinner = GlassButtonSpinner;

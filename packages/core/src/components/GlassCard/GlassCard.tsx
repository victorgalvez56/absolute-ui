import type { ReactNode } from 'react';
import { createContext, forwardRef, useContext } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import {
  type GlassCardAction,
  type GlassCardSize,
  type GlassCardVariant,
  buildCardBodyStyle,
  buildCardDividerStyle,
  buildCardFooterStyle,
  buildCardHeaderStyle,
  buildCardSubtitleStyle,
  buildCardTitleStyle,
  resolveGlassCardColors,
} from './style.js';

export type GlassCardProps = {
  elevation?: GlassSurfaceProps['elevation'];
  radius?: GlassSurfaceProps['radius'];
  /**
   * Visual treatment. Default `filled` matches Phase 1 behavior.
   */
  variant?: GlassCardVariant;
  /**
   * Semantic intent. Used by `outline` to pick the border color.
   * Default `neutral`.
   */
  action?: GlassCardAction;
  /**
   * Size token. Controls header / body / footer padding, title font,
   * and divider margins. Default `md` preserves the Phase 1 rhythm.
   */
  size?: GlassCardSize;
  style?: ViewStyle;
  accessibilityLabel?: string;
  children: ReactNode;
};

export type GlassCardHeaderProps = {
  title: string;
  subtitle?: string;
  /**
   * Optional trailing slot, typically an icon button rendered to
   * the right of the title. When supplied, the header becomes a
   * two-column row with the text block on the left.
   */
  trailing?: ReactNode;
};

export type GlassCardBodyProps = { children: ReactNode };
export type GlassCardFooterProps = { children: ReactNode };
export type GlassCardDividerProps = Record<string, never>;

type CardSlotCtx = { size: GlassCardSize };
const CardSlotContext = createContext<CardSlotCtx>({ size: 'md' });

/**
 * GlassCard is a compound primitive. The outer `GlassCard` renders
 * the liquid-glass surface; `GlassCard.Header`, `GlassCard.Body`,
 * `GlassCard.Footer`, and `GlassCard.Divider` are the composable
 * slots. This mirrors the API shown in the plan (§3.2) and keeps
 * consumer code readable without a thousand-prop configuration.
 *
 * Slots read the active `size` from a slot context so each sub-
 * component picks consistent padding + font without consumers
 * repeating the size prop on every slot.
 */
const GlassCardRoot = forwardRef<unknown, GlassCardProps>(function GlassCard(
  {
    elevation = 1,
    radius = 'lg',
    variant = 'filled',
    action = 'neutral',
    size = 'md',
    style,
    accessibilityLabel,
    children,
  },
  _ref,
) {
  const { theme } = useAbsoluteUI();
  const colors = resolveGlassCardColors({ variant, action, colors: theme.colors });

  const labelProps = accessibilityLabel !== undefined ? { accessibilityLabel } : {};
  const styleProps = style !== undefined ? { style } : {};

  const contextBody = (
    <CardSlotContext.Provider value={{ size }}>{children}</CardSlotContext.Provider>
  );

  if (!colors.useGlassSurface) {
    // Ghost variant: no surface, just padding context.
    return (
      <View accessibilityRole="none" {...labelProps} {...styleProps}>
        {contextBody}
      </View>
    );
  }

  // Outline variant overlays an extra border on top of the glass
  // tint without disturbing the recipe's own borderColor (the
  // specular highlight). `borderRadius: 999` is intentionally out of
  // range so GlassSurface's own radius token wins — the outline only
  // contributes width + color.
  const outlineStyle: ViewStyle | undefined =
    colors.border !== undefined ? { borderWidth: 1.5, borderColor: colors.border } : undefined;

  const merged: ViewStyle | undefined =
    outlineStyle !== undefined || style !== undefined
      ? { ...(outlineStyle ?? {}), ...(style ?? {}) }
      : undefined;
  const finalStyleProps = merged !== undefined ? { style: merged } : {};

  return (
    <GlassSurface
      elevation={elevation}
      radius={radius}
      accessibilityRole="none"
      {...labelProps}
      {...finalStyleProps}
    >
      {contextBody}
    </GlassSurface>
  );
});

function useCardSlot(): CardSlotCtx {
  return useContext(CardSlotContext);
}

function GlassCardHeader({ title, subtitle, trailing }: GlassCardHeaderProps) {
  const { theme } = useAbsoluteUI();
  const { size } = useCardSlot();
  const headerStyle = buildCardHeaderStyle(size);
  const titleStyle = buildCardTitleStyle(theme.colors.textPrimary, size);
  const subtitleStyle = buildCardSubtitleStyle(theme.colors.textSecondary, size);

  const textBlock = (
    <View style={{ gap: headerStyle.gap, flexShrink: 1 }}>
      <Text
        style={titleStyle}
        accessibilityRole="header"
        accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      >
        {title}
      </Text>
      {subtitle !== undefined ? <Text style={subtitleStyle}>{subtitle}</Text> : null}
    </View>
  );

  if (trailing === undefined) {
    return <View style={headerStyle}>{textBlock}</View>;
  }

  return (
    <View
      style={{
        ...headerStyle,
        flexDirection: 'row',
        // flex-start (not center) so the trailing node stays anchored
        // to the top of the row when the title wraps at large Dynamic
        // Type sizes. Center alignment would visually collide with
        // multi-line titles.
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      {textBlock}
      <View>{trailing}</View>
    </View>
  );
}

function GlassCardBody({ children }: GlassCardBodyProps) {
  const { size } = useCardSlot();
  return <View style={buildCardBodyStyle(size)}>{children}</View>;
}

function GlassCardFooter({ children }: GlassCardFooterProps) {
  const { size } = useCardSlot();
  return <View style={buildCardFooterStyle(size)}>{children}</View>;
}

function GlassCardDivider(_: GlassCardDividerProps) {
  const { theme } = useAbsoluteUI();
  const { size } = useCardSlot();
  return <View style={buildCardDividerStyle(theme.colors.divider, size)} />;
}

type GlassCardType = typeof GlassCardRoot & {
  Header: typeof GlassCardHeader;
  Body: typeof GlassCardBody;
  Footer: typeof GlassCardFooter;
  Divider: typeof GlassCardDivider;
};

export const GlassCard = GlassCardRoot as GlassCardType;
GlassCard.Header = GlassCardHeader;
GlassCard.Body = GlassCardBody;
GlassCard.Footer = GlassCardFooter;
GlassCard.Divider = GlassCardDivider;

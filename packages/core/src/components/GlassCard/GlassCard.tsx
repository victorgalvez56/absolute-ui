import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface/index.js';
import {
  buildCardBodyStyle,
  buildCardDividerStyle,
  buildCardFooterStyle,
  buildCardHeaderStyle,
  buildCardSubtitleStyle,
  buildCardTitleStyle,
} from './style.js';

export type GlassCardProps = {
  elevation?: GlassSurfaceProps['elevation'];
  radius?: GlassSurfaceProps['radius'];
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

/**
 * GlassCard is a compound primitive. The outer `GlassCard` renders
 * the liquid-glass surface; `GlassCard.Header`, `GlassCard.Body`,
 * `GlassCard.Footer`, and `GlassCard.Divider` are the composable
 * slots. This mirrors the API shown in the plan (§3.2) and keeps
 * consumer code readable without a thousand-prop configuration.
 *
 * Default elevation is 1 and default radius is `lg`. Both can be
 * overridden to promote the card to elevation 2/3 (modal-adjacent
 * surfaces) or to tighten the corner radius.
 */
const GlassCardRoot = forwardRef<unknown, GlassCardProps>(function GlassCard(
  { elevation = 1, radius = 'lg', style, accessibilityLabel, children },
  _ref,
) {
  // Avoid passing `accessibilityLabel: undefined` through GlassSurface's
  // exactOptionalPropertyTypes boundary.
  const labelProps = accessibilityLabel !== undefined ? { accessibilityLabel } : {};
  const styleProps = style !== undefined ? { style } : {};
  return (
    <GlassSurface
      elevation={elevation}
      radius={radius}
      {...styleProps}
      accessibilityRole="none"
      {...labelProps}
    >
      {children}
    </GlassSurface>
  );
});

function GlassCardHeader({ title, subtitle, trailing }: GlassCardHeaderProps) {
  const { theme } = useAbsoluteUI();
  const headerStyle = buildCardHeaderStyle();
  const titleStyle = buildCardTitleStyle(theme.colors.textPrimary);
  const subtitleStyle = buildCardSubtitleStyle(theme.colors.textSecondary);

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
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {textBlock}
      <View>{trailing}</View>
    </View>
  );
}

function GlassCardBody({ children }: GlassCardBodyProps) {
  return <View style={buildCardBodyStyle()}>{children}</View>;
}

function GlassCardFooter({ children }: GlassCardFooterProps) {
  return <View style={buildCardFooterStyle()}>{children}</View>;
}

function GlassCardDivider(_: GlassCardDividerProps) {
  const { theme } = useAbsoluteUI();
  return <View style={buildCardDividerStyle(theme.colors.divider)} />;
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

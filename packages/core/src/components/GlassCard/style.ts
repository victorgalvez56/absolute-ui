/**
 * Pure layout helpers for GlassCard and its compound sub-components.
 * No `react-native` imports so the node-only vitest suite can
 * exercise them directly — same split as the other primitives.
 */

export type CardSectionStyle = {
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
};

export type CardBodyStyle = CardSectionStyle;
export type CardFooterStyle = CardSectionStyle & {
  flexDirection: 'row';
  justifyContent: 'flex-end';
  alignItems: 'center';
};

/**
 * React Native does NOT scale `lineHeight` with the user's Dynamic
 * Type / font scale — only `fontSize` is multiplied at render time.
 * Setting a hard `lineHeight` therefore clips glyph ascenders and
 * descenders when the user enlarges system text. The fix is to
 * omit `lineHeight` entirely and let the Text layer use its
 * built-in default (roughly fontSize * 1.2 across platforms),
 * which scales naturally. Exposed here as a type comment so a
 * future agent auditing the helpers can see the reasoning.
 */
export type CardTitleStyle = {
  color: string;
  fontSize: number;
  fontWeight: '600';
};

export type CardSubtitleStyle = {
  color: string;
  fontSize: number;
  fontWeight: '400';
};

export type CardDividerStyle = {
  height: number;
  backgroundColor: string;
  marginHorizontal: number;
};

const H_PADDING = 20;
const V_PADDING = 16;
const SECTION_GAP = 8;

export function buildCardHeaderStyle(): CardSectionStyle {
  return {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING,
    gap: SECTION_GAP / 2,
  };
}

export function buildCardBodyStyle(): CardBodyStyle {
  return {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING,
    gap: SECTION_GAP,
  };
}

export function buildCardFooterStyle(): CardFooterStyle {
  return {
    paddingHorizontal: H_PADDING,
    paddingVertical: V_PADDING,
    gap: SECTION_GAP,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  };
}

export function buildCardTitleStyle(textPrimary: string): CardTitleStyle {
  return {
    color: textPrimary,
    fontSize: 18,
    fontWeight: '600',
  };
}

export function buildCardSubtitleStyle(textSecondary: string): CardSubtitleStyle {
  return {
    color: textSecondary,
    fontSize: 14,
    fontWeight: '400',
  };
}

export function buildCardDividerStyle(dividerColor: string): CardDividerStyle {
  return {
    height: 1,
    backgroundColor: dividerColor,
    marginHorizontal: H_PADDING,
  };
}

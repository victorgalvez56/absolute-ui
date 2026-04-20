/**
 * Pure layout helpers for GlassCard and its compound sub-components.
 * No `react-native` imports so the node-only vitest suite can
 * exercise them directly — same split as the other primitives.
 */

import type { ThemeColors } from '@absolute-ui/tokens';

/**
 * Visual treatment for a card.
 *
 *  - `filled`:  glass surface + default tint (the Phase 1 look).
 *  - `soft`:    glass surface with a lightened tint — lowest visual
 *               weight, useful for informational/secondary cards.
 *  - `outline`: glass surface + an accent-colored border stroke.
 *               Good for status / highlighted cards.
 *  - `ghost`:   no surface fill and no border, only padding + text.
 *               Useful for nested cards inside an already-glass parent.
 */
export type GlassCardVariant = 'filled' | 'soft' | 'outline' | 'ghost';

/**
 * Semantic intent. `neutral` is the default and uses body copy colors.
 * `primary` and `danger` switch the outline / accent stripe to pull
 * from the already-guarded `accent` / `danger` theme roles, so no new
 * color tokens are introduced.
 */
export type GlassCardAction = 'neutral' | 'primary' | 'danger';

export type GlassCardSize = 'sm' | 'md' | 'lg';

export type GlassCardSectionPadding = {
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
};

/**
 * Resolve the padding + gap for the card's sections at each size.
 * Header/body/footer read from the same token bundle so the vertical
 * rhythm stays consistent inside a single card.
 */
export function resolveGlassCardSize(size: GlassCardSize = 'md'): GlassCardSectionPadding {
  if (size === 'sm') return { paddingHorizontal: 14, paddingVertical: 12, gap: 6 };
  if (size === 'lg') return { paddingHorizontal: 24, paddingVertical: 20, gap: 10 };
  return { paddingHorizontal: 20, paddingVertical: 16, gap: 8 };
}

export type GlassCardColorTokens = {
  /**
   * Border stroke color. `undefined` = use the recipe's default glass
   * border (no override). Outline variants paint this with the action color.
   */
  border: string | undefined;
  /**
   * Whether to render a GlassSurface under the card. `ghost` opts out
   * so the card is just a padded container inherited from its parent.
   */
  useGlassSurface: boolean;
  /**
   * Multiplier applied to the glass recipe's tint alpha. `soft` lightens
   * the tint (alpha * 0.6); others leave it unchanged (1.0).
   */
  tintAlphaMultiplier: number;
};

/** Resolve the (variant, action) pair onto the card's visual tokens. */
export function resolveGlassCardColors(options: {
  variant: GlassCardVariant;
  action: GlassCardAction;
  colors: ThemeColors;
}): GlassCardColorTokens {
  const { variant, action, colors } = options;
  const actionColor =
    action === 'primary' ? colors.accent : action === 'danger' ? colors.danger : undefined;

  if (variant === 'outline') {
    return {
      border: actionColor ?? colors.textPrimary,
      useGlassSurface: true,
      tintAlphaMultiplier: 1,
    };
  }
  if (variant === 'ghost') {
    return { border: undefined, useGlassSurface: false, tintAlphaMultiplier: 1 };
  }
  if (variant === 'soft') {
    return { border: undefined, useGlassSurface: true, tintAlphaMultiplier: 0.6 };
  }
  // filled — the Phase 1 default.
  return { border: undefined, useGlassSurface: true, tintAlphaMultiplier: 1 };
}

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

/**
 * Back-compat shortcuts — callers pass an optional size and get the
 * resolved padding/gap. Omitting `size` yields the Phase 1 `md`
 * defaults (H 20, V 16, gap 8) so existing tests are unchanged.
 */
export function buildCardHeaderStyle(size: GlassCardSize = 'md'): CardSectionStyle {
  const t = resolveGlassCardSize(size);
  return {
    paddingHorizontal: t.paddingHorizontal,
    paddingVertical: t.paddingVertical,
    gap: Math.round(t.gap / 2),
  };
}

export function buildCardBodyStyle(size: GlassCardSize = 'md'): CardBodyStyle {
  const t = resolveGlassCardSize(size);
  return {
    paddingHorizontal: t.paddingHorizontal,
    paddingVertical: t.paddingVertical,
    gap: t.gap,
  };
}

export function buildCardFooterStyle(size: GlassCardSize = 'md'): CardFooterStyle {
  const t = resolveGlassCardSize(size);
  return {
    paddingHorizontal: t.paddingHorizontal,
    paddingVertical: t.paddingVertical,
    gap: t.gap,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  };
}

export function buildCardTitleStyle(
  textPrimary: string,
  size: GlassCardSize = 'md',
): CardTitleStyle {
  return {
    color: textPrimary,
    fontSize: size === 'sm' ? 16 : size === 'lg' ? 20 : 18,
    fontWeight: '600',
  };
}

export function buildCardSubtitleStyle(
  textSecondary: string,
  size: GlassCardSize = 'md',
): CardSubtitleStyle {
  return {
    color: textSecondary,
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 15 : 14,
    fontWeight: '400',
  };
}

export function buildCardDividerStyle(
  dividerColor: string,
  size: GlassCardSize = 'md',
): CardDividerStyle {
  return {
    height: 1,
    backgroundColor: dividerColor,
    marginHorizontal: resolveGlassCardSize(size).paddingHorizontal,
  };
}

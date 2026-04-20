/**
 * Pure style helpers for the `Box` / `HStack` / `VStack` layout
 * primitives. Every spacing prop is resolved against the shared
 * `@absolute-ui/tokens` `spacing` scale so layout rhythm stays
 * consistent across every composition. Kept free of `react-native`
 * imports so node-only vitest can exercise the resolver directly.
 */

import { type SpacingToken, spacing } from '@absolute-ui/tokens';

/**
 * A spacing prop accepts either a token (`'md'`, `'lg'`, …) or a
 * raw number for escape-hatch overrides. Callers should default to
 * tokens — raw numbers skip the token contract and are only for
 * cases where a design calls for an off-scale value.
 */
export type SpacingValue = SpacingToken | number;

export type LayoutStyle = {
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  margin?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  gap?: number;
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  backgroundColor?: string;
  borderRadius?: number;
};

export type BoxLayoutProps = {
  /** Shorthand for `padding`. */
  p?: SpacingValue;
  /** Shorthand for `paddingHorizontal`. */
  px?: SpacingValue;
  /** Shorthand for `paddingVertical`. */
  py?: SpacingValue;
  /** Shorthand for `paddingTop`. */
  pt?: SpacingValue;
  /** Shorthand for `paddingBottom`. */
  pb?: SpacingValue;
  /** Shorthand for `paddingLeft`. */
  pl?: SpacingValue;
  /** Shorthand for `paddingRight`. */
  pr?: SpacingValue;
  /** Shorthand for `margin`. */
  m?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  mt?: SpacingValue;
  mb?: SpacingValue;
  ml?: SpacingValue;
  mr?: SpacingValue;
  /** Gap between flex children. Applies to HStack/VStack. */
  gap?: SpacingValue;
  flex?: number;
  alignItems?: LayoutStyle['alignItems'];
  justifyContent?: LayoutStyle['justifyContent'];
  alignSelf?: LayoutStyle['alignSelf'];
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  /**
   * Solid background color. For the liquid-glass aesthetic prefer a
   * `GlassSurface` wrapper; this prop is for non-glass utility rows.
   */
  backgroundColor?: string;
  borderRadius?: number;
};

/**
 * Resolve a spacing shorthand to pixels. Accepts either a token
 * (`'md'`) or a raw number (`12`). Unknown tokens fall back to the
 * `none` spacing step (0) so a typo can never break layout.
 */
export function resolveSpacing(value: SpacingValue | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  const token = spacing[value as SpacingToken];
  return token ?? spacing.none;
}

/**
 * Same shape as BoxLayoutProps, but every field is allowed to be
 * `undefined` at the type level so we can destructure a
 * BoxLayoutProps and pass the spread back in without running afoul
 * of `exactOptionalPropertyTypes: true`.
 */
export type BoxLayoutPropsInput = {
  [K in keyof BoxLayoutProps]: BoxLayoutProps[K] | undefined;
};

/**
 * Build the inline style for a `Box` from its spacing shorthands.
 * Only the keys the caller provided are emitted so the returned
 * style merges cleanly with any caller-supplied `style` override.
 */
export function buildBoxStyle(props: BoxLayoutPropsInput): LayoutStyle {
  const out: LayoutStyle = {};
  const p = resolveSpacing(props.p);
  const px = resolveSpacing(props.px);
  const py = resolveSpacing(props.py);
  const pt = resolveSpacing(props.pt);
  const pb = resolveSpacing(props.pb);
  const pl = resolveSpacing(props.pl);
  const pr = resolveSpacing(props.pr);
  const m = resolveSpacing(props.m);
  const mx = resolveSpacing(props.mx);
  const my = resolveSpacing(props.my);
  const mt = resolveSpacing(props.mt);
  const mb = resolveSpacing(props.mb);
  const ml = resolveSpacing(props.ml);
  const mr = resolveSpacing(props.mr);
  const gap = resolveSpacing(props.gap);

  if (p !== undefined) out.padding = p;
  if (px !== undefined) out.paddingHorizontal = px;
  if (py !== undefined) out.paddingVertical = py;
  if (pt !== undefined) out.paddingTop = pt;
  if (pb !== undefined) out.paddingBottom = pb;
  if (pl !== undefined) out.paddingLeft = pl;
  if (pr !== undefined) out.paddingRight = pr;
  if (m !== undefined) out.margin = m;
  if (mx !== undefined) out.marginHorizontal = mx;
  if (my !== undefined) out.marginVertical = my;
  if (mt !== undefined) out.marginTop = mt;
  if (mb !== undefined) out.marginBottom = mb;
  if (ml !== undefined) out.marginLeft = ml;
  if (mr !== undefined) out.marginRight = mr;
  if (gap !== undefined) out.gap = gap;
  if (props.flex !== undefined) out.flex = props.flex;
  if (props.alignItems !== undefined) out.alignItems = props.alignItems;
  if (props.justifyContent !== undefined) out.justifyContent = props.justifyContent;
  if (props.alignSelf !== undefined) out.alignSelf = props.alignSelf;
  if (props.width !== undefined) out.width = props.width;
  if (props.height !== undefined) out.height = props.height;
  if (props.minWidth !== undefined) out.minWidth = props.minWidth;
  if (props.minHeight !== undefined) out.minHeight = props.minHeight;
  if (props.maxWidth !== undefined) out.maxWidth = props.maxWidth;
  if (props.maxHeight !== undefined) out.maxHeight = props.maxHeight;
  if (props.backgroundColor !== undefined) out.backgroundColor = props.backgroundColor;
  if (props.borderRadius !== undefined) out.borderRadius = props.borderRadius;
  return out;
}

/**
 * Build the style for an `HStack`: horizontal row with a default gap
 * of `md` (12pt) and cross-axis centered alignment. Callers can
 * override any individual axis through `BoxLayoutProps`.
 */
export function buildHStackStyle(props: BoxLayoutPropsInput): LayoutStyle {
  const box = buildBoxStyle(props);
  return {
    ...box,
    flexDirection: 'row',
    alignItems: box.alignItems ?? 'center',
    gap: box.gap ?? spacing.md,
  };
}

/**
 * Build the style for a `VStack`: vertical column with a default gap
 * of `md` (12pt) and cross-axis stretched alignment (so children
 * take the full available width by default).
 */
export function buildVStackStyle(props: BoxLayoutPropsInput): LayoutStyle {
  const box = buildBoxStyle(props);
  return {
    ...box,
    flexDirection: 'column',
    alignItems: box.alignItems ?? 'stretch',
    gap: box.gap ?? spacing.md,
  };
}

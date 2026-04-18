import type { GlassElevation, GlassRecipe } from '@absolute-ui/tokens';

/**
 * The resolved style object a GlassSurface renders. Kept as a plain
 * record instead of `react-native`'s `ViewStyle` so it has no native
 * import — node-only vitest can exercise this file without pulling
 * in react-native-web or a jsdom environment.
 */
export type GlassSurfaceStyle = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  backdropFilter: string;
  WebkitBackdropFilter: string;
  /**
   * Composite shadow string with three layers:
   *  1. Inset highlight at the top edge — the specular "sheen" of
   *     real liquid glass. Pulled from the recipe's borderColor so
   *     it tracks the theme (teal on Aurora, pink-rose on Sunset).
   *  2. Inset subtle darken at the bottom — simulates the refraction
   *     shadow where light exits the glass edge.
   *  3. Outer drop shadow — elevation. Grows with the elevation token
   *     so 0 sits inline, 1 floats (buttons), 2 lifts (cards), 3
   *     projects (modals).
   *
   * Kept as a single CSS string because both `boxShadow` (RN 0.76+
   * and RN-web) and the web CSS engine accept the multi-layer shape
   * natively. When the native `UIGlassEffect` module lands in Phase 2
   * it will consume these same values via a separate resolver.
   */
  boxShadow: string;
};

const TOP_HIGHLIGHT_PX = 1;
const BOTTOM_INSET_PX = 1;

/** Drop shadow Y-offset per elevation step, in dp. */
const ELEVATION_SHADOW_Y: Record<GlassElevation, number> = {
  0: 0,
  1: 2,
  2: 6,
  3: 14,
};
/** Drop shadow blur per elevation step, in dp. */
const ELEVATION_SHADOW_BLUR: Record<GlassElevation, number> = {
  0: 0,
  1: 8,
  2: 18,
  3: 32,
};
/** Drop shadow opacity per elevation step (0-1). */
const ELEVATION_SHADOW_ALPHA: Record<GlassElevation, number> = {
  0: 0,
  1: 0.18,
  2: 0.28,
  3: 0.4,
};

function toRgba(color: string, alpha: number): string {
  // Accept #RRGGBB and return rgba(...). Hex with alpha is forwarded unchanged
  // because recipe.borderColor already encodes an alpha in its final two hex
  // digits — we only rewrite here when we explicitly compose a drop shadow.
  if (!color.startsWith('#') || color.length !== 7) return color;
  const r = Number.parseInt(color.slice(1, 3), 16);
  const g = Number.parseInt(color.slice(3, 5), 16);
  const b = Number.parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Resolve the composite `boxShadow` string for a glass surface.
 *
 * Broken out so the glass polish can be unit-tested and so the
 * eventual native layer can reuse the elevation curve.
 */
export function buildGlassShadow(recipe: GlassRecipe, elevation: GlassElevation): string {
  const highlight = `inset 0 ${TOP_HIGHLIGHT_PX}px 0 ${recipe.borderColor}`;
  const bottomInset = `inset 0 -${BOTTOM_INSET_PX}px 0 rgba(0, 0, 0, 0.12)`;
  const y = ELEVATION_SHADOW_Y[elevation];
  const blur = ELEVATION_SHADOW_BLUR[elevation];
  const alpha = ELEVATION_SHADOW_ALPHA[elevation];
  if (blur === 0) return `${highlight}, ${bottomInset}`;
  const drop = `0 ${y}px ${blur}px ${toRgba('#000000', alpha)}`;
  return `${highlight}, ${bottomInset}, ${drop}`;
}

/**
 * Build the resolved style for a glass recipe. Extracted so tests and
 * the eventual native UIGlassEffect platform layer reuse the same math.
 */
export function buildGlassSurfaceStyle(
  recipe: GlassRecipe,
  cornerRadius: number,
  elevation: GlassElevation = 1,
): GlassSurfaceStyle {
  const filter = `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`;
  return {
    backgroundColor: recipe.tint,
    borderColor: recipe.borderColor,
    borderWidth: recipe.borderWidth,
    borderRadius: cornerRadius,
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
    boxShadow: buildGlassShadow(recipe, elevation),
  };
}

/**
 * Glass recipe — the set of parameters that describe a liquid-glass surface.
 * A theme defines recipes for each elevation level (0 = inline, 3 = modal).
 * The runtime picks a recipe by elevation and resolves it through the
 * platform layer (native UIGlassEffect on iOS 26, blur view elsewhere).
 */
export type GlassRecipe = {
  /** Tint color overlaid on the blurred backdrop (hex with alpha). */
  tint: string;
  /** Blur radius in points. Fallback used when native effect unavailable. */
  blurRadius: number;
  /** Saturation multiplier applied to the backdrop (1 = unchanged). */
  saturation: number;
  /** Border color for the specular highlight edge. */
  borderColor: string;
  /** Border width in points. */
  borderWidth: number;
  /** Optional noise texture opacity (0–1) layered for grain. */
  noiseOpacity: number;
};

export type GlassElevation = 0 | 1 | 2 | 3;

export type GlassRecipes = Record<GlassElevation, GlassRecipe>;

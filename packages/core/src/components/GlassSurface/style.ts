import type { GlassRecipe } from '@absolute-ui/tokens';

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
};

/**
 * Build the resolved style for a glass recipe. Extracted so tests and
 * the eventual native UIGlassEffect platform layer reuse the same math.
 */
export function buildGlassSurfaceStyle(
  recipe: GlassRecipe,
  cornerRadius: number,
): GlassSurfaceStyle {
  const filter = `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`;
  return {
    backgroundColor: recipe.tint,
    borderColor: recipe.borderColor,
    borderWidth: recipe.borderWidth,
    borderRadius: cornerRadius,
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
  };
}

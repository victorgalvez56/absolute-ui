/**
 * CSS helpers that translate the real `GlassRecipe` tokens into
 * web-compatible style objects. Keeping this boundary thin lets the
 * docs playground stay a faithful visual mirror of the React Native
 * primitives without shipping `react-native-web` into the docs bundle.
 *
 * Every helper consumes tokens from `@absolute-ui/tokens` and returns
 * a `CSSProperties` object — call sites pass them straight into a
 * `style` attribute so the resulting DOM looks like the production
 * liquid-glass surface (real blur, real tint, real border, real noise).
 */

import type { GlassElevation, GlassRecipe, Theme } from '@absolute-ui/tokens';
import type { CSSProperties } from 'react';

/** Map from our radius tokens to concrete pixel values. */
export const RADIUS_PX: Record<string, number> = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  pill: 999,
};

const NOISE_DATA_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>\")";

/**
 * Build the CSS for a liquid-glass surface given a recipe + radius
 * token. The result is applied to a wrapping element; content can sit
 * on top unaffected.
 */
export function glassSurfaceStyle(
  recipe: GlassRecipe,
  radiusToken: keyof typeof RADIUS_PX | number = 'md',
): CSSProperties {
  const radius =
    typeof radiusToken === 'number' ? radiusToken : (RADIUS_PX[radiusToken] ?? RADIUS_PX.md);
  return {
    position: 'relative',
    backgroundColor: recipe.tint,
    backdropFilter: `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`,
    WebkitBackdropFilter: `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`,
    border: `${recipe.borderWidth}px solid ${recipe.borderColor}`,
    borderRadius: radius,
    overflow: 'hidden',
  };
}

/**
 * Noise overlay — a separate absolutely-positioned layer so the
 * blur filter doesn't get cached with the grain.
 */
export function glassNoiseStyle(recipe: GlassRecipe): CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    backgroundImage: NOISE_DATA_URL,
    backgroundSize: '160px 160px',
    opacity: recipe.noiseOpacity,
    pointerEvents: 'none',
    mixBlendMode: 'overlay',
  };
}

/**
 * Resolve the glass recipe for a given theme + elevation. Mirrors
 * `resolveGlassRecipe` in `@absolute-ui/a11y` but without the a11y
 * Reduced Transparency collapse — the docs playground is an
 * illustration surface, not a runtime target.
 */
export function recipeFor(theme: Theme, elevation: GlassElevation): GlassRecipe {
  return theme.glass[elevation];
}

/**
 * Full style for a glass surface at a given elevation. Shortcut used
 * by the playground previews that do not need the recipe explicitly.
 */
export function glassStyleFor(
  theme: Theme,
  elevation: GlassElevation = 1,
  radiusToken: keyof typeof RADIUS_PX | number = 'md',
): CSSProperties {
  return glassSurfaceStyle(recipeFor(theme, elevation), radiusToken);
}

/** Noise overlay for an elevation — companion to `glassStyleFor`. */
export function noiseStyleFor(theme: Theme, elevation: GlassElevation = 1): CSSProperties {
  return glassNoiseStyle(recipeFor(theme, elevation));
}

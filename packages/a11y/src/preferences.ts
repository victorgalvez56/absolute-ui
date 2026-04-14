import type { GlassRecipe, SpringConfig } from '@absolute-ui/tokens';

/**
 * User accessibility preferences read from the OS. Platform-agnostic
 * — React Native binds this type to `AccessibilityInfo` in
 * `@absolute-ui/core`, the web docs site binds it to `matchMedia`.
 */
export type AccessibilityPreferences = {
  reducedMotion: boolean;
  reducedTransparency: boolean;
  boldText: boolean;
  highContrast: boolean;
};

export const defaultPreferences: AccessibilityPreferences = {
  reducedMotion: false,
  reducedTransparency: false,
  boldText: false,
  highContrast: false,
};

/**
 * When Reduced Transparency is on, a translucent glass recipe must
 * resolve to a solid surface built from the theme background. We
 * preserve the border for shape, drop the blur and noise, and set
 * the tint to the opaque background color supplied by the caller.
 */
export function resolveGlassRecipe(
  recipe: GlassRecipe,
  preferences: AccessibilityPreferences,
  opaqueBackground: string,
): GlassRecipe {
  if (!preferences.reducedTransparency) return recipe;
  return {
    ...recipe,
    tint: opaqueBackground,
    blurRadius: 0,
    saturation: 1,
    noiseOpacity: 0,
  };
}

/**
 * When Reduced Motion is on, springs collapse to an instant (overdamped,
 * zero-energy) response so transitions complete in one frame without
 * vestibular-trigger oscillation.
 */
const INSTANT: SpringConfig = { stiffness: 1000, damping: 1000, mass: 0.001 };

export function resolveSpring(
  spring: SpringConfig,
  preferences: AccessibilityPreferences,
): SpringConfig {
  return preferences.reducedMotion ? INSTANT : spring;
}

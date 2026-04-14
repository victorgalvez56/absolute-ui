import { resolveGlassRecipe } from '@absolute-ui/a11y';
import type { GlassElevation, GlassRecipe, Theme } from '@absolute-ui/tokens';
import { radius as radiusTokens } from '@absolute-ui/tokens';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useAbsoluteUI } from '../../theme-context.js';

export type GlassSurfaceProps = Omit<ViewProps, 'style'> & {
  /**
   * Elevation level of the glass surface. Higher elevations pick a
   * recipe with more blur, more saturation, and a stronger tint.
   * Defaults to 1.
   */
  elevation?: GlassElevation;
  /**
   * Corner radius token. Defaults to `md` (12pt).
   */
  radius?: keyof typeof radiusTokens;
  /**
   * Optional override for the theme. When omitted, reads from the
   * nearest `AbsoluteUIContext` provider (or the default theme when
   * rendered outside one).
   */
  theme?: Theme;
  /**
   * Extra style applied on top of the resolved glass style. Use for
   * layout (width / padding / margin), not for visual overrides —
   * visual overrides defeat the point of the theme contract.
   */
  style?: ViewStyle;
  children?: ReactNode;
};

/**
 * Build the resolved ViewStyle for a glass recipe. Extracted so that
 * tests and the native platform layer can reuse the same math.
 */
export function buildGlassSurfaceStyle(recipe: GlassRecipe, cornerRadius: number): ViewStyle {
  return {
    backgroundColor: recipe.tint,
    borderColor: recipe.borderColor,
    borderWidth: recipe.borderWidth,
    borderRadius: cornerRadius,
    // `backdropFilter` is picked up by react-native-web in browsers.
    // On native iOS 26, a future UIGlassEffect module will replace
    // this style entirely — the field is harmlessly ignored by RN.
    backdropFilter: `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`,
    WebkitBackdropFilter: `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`,
  } as ViewStyle;
}

/**
 * Base liquid-glass primitive. Every other Absolute UI glass
 * component (`GlassCard`, `GlassButton`, `GlassSheet`, …) composes
 * a `GlassSurface` as its outer container.
 */
export const GlassSurface = forwardRef<View, GlassSurfaceProps>(function GlassSurface(
  {
    elevation = 1,
    radius = 'md',
    theme: themeOverride,
    style,
    children,
    accessibilityRole,
    ...rest
  },
  ref,
) {
  const ctx = useAbsoluteUI();
  const theme = themeOverride ?? ctx.theme;
  const rawRecipe = theme.glass[elevation];
  const recipe = resolveGlassRecipe(rawRecipe, ctx.preferences, theme.colors.background);
  const resolved = buildGlassSurfaceStyle(recipe, radiusTokens[radius]);

  return (
    <View
      ref={ref}
      accessibilityRole={accessibilityRole ?? 'none'}
      style={[resolved, style]}
      {...rest}
    >
      {children}
    </View>
  );
});

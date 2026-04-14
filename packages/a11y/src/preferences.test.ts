import { aurora, spring } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import { defaultPreferences, resolveGlassRecipe, resolveSpring } from './preferences.js';

describe('resolveGlassRecipe', () => {
  const recipe = aurora.glass[1];
  const background = aurora.colors.background;

  test('returns the same recipe when transparency is allowed', () => {
    const out = resolveGlassRecipe(recipe, defaultPreferences, background);
    expect(out).toEqual(recipe);
  });

  test('collapses to an opaque surface when reduced transparency is on', () => {
    const out = resolveGlassRecipe(
      recipe,
      { ...defaultPreferences, reducedTransparency: true },
      background,
    );
    expect(out.tint).toBe(background);
    expect(out.blurRadius).toBe(0);
    expect(out.saturation).toBe(1);
    expect(out.noiseOpacity).toBe(0);
    // Shape is preserved so layout doesn't shift.
    expect(out.borderWidth).toBe(recipe.borderWidth);
    expect(out.borderColor).toBe(recipe.borderColor);
  });
});

describe('resolveSpring', () => {
  test('passes through when motion is allowed', () => {
    const out = resolveSpring(spring.gentle, defaultPreferences);
    expect(out).toEqual(spring.gentle);
  });

  test('collapses to instant when reduced motion is on', () => {
    const out = resolveSpring(spring.gentle, {
      ...defaultPreferences,
      reducedMotion: true,
    });
    expect(out.stiffness).toBeGreaterThan(spring.gentle.stiffness);
    expect(out.damping).toBeGreaterThan(spring.gentle.damping);
  });
});

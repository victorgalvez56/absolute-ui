import { aurora } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import { buildGlassSurfaceStyle } from './style.js';

describe('buildGlassSurfaceStyle', () => {
  const recipe = aurora.glass[2];

  test('maps recipe tint to backgroundColor', () => {
    const style = buildGlassSurfaceStyle(recipe, 12);
    expect(style.backgroundColor).toBe(recipe.tint);
  });

  test('maps recipe border to border fields', () => {
    const style = buildGlassSurfaceStyle(recipe, 12);
    expect(style.borderColor).toBe(recipe.borderColor);
    expect(style.borderWidth).toBe(recipe.borderWidth);
  });

  test('uses the supplied corner radius', () => {
    const style = buildGlassSurfaceStyle(recipe, 20);
    expect(style.borderRadius).toBe(20);
  });

  test('emits matching backdropFilter and WebkitBackdropFilter', () => {
    const style = buildGlassSurfaceStyle(recipe, 12);
    const expected = `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`;
    expect(style.backdropFilter).toBe(expected);
    expect(style.WebkitBackdropFilter).toBe(expected);
  });
});

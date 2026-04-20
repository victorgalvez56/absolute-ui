import { aurora } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import { buildGlassShadow, buildGlassSurfaceStyle } from './style.js';

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

  test('emits a boxShadow with specular highlight + drop shadow', () => {
    const style = buildGlassSurfaceStyle(recipe, 12, 2);
    // Highlight layer pulls the recipe border color so the sheen
    // tracks the theme (teal on Aurora, not a hard-coded white).
    expect(style.boxShadow).toContain(`inset 0 1px 0 ${recipe.borderColor}`);
    // Drop shadow layer opts in only at elevation > 0 and scales with level.
    expect(style.boxShadow).toContain('rgba(0, 0, 0,');
  });

  test('default elevation renders a floating (elevation 1) shadow', () => {
    const style = buildGlassSurfaceStyle(recipe, 12);
    expect(style.boxShadow).toBeDefined();
    expect(style.boxShadow.length).toBeGreaterThan(0);
  });
});

describe('buildGlassShadow (per elevation)', () => {
  const recipe = aurora.glass[1];

  test('elevation 0 has no outer drop shadow (inline surface)', () => {
    const shadow = buildGlassShadow(recipe, 0);
    // Inset highlight + inset bottom refraction are always present.
    // The outer drop shadow (non-inset `<offset>px <y>px <blur>px rgba(...)`
    // layer) only opts in at elevation >= 1.
    expect(shadow).not.toMatch(/(?:^|, )0 \d+px \d+px rgba/);
  });

  test('higher elevations grow the drop shadow blur', () => {
    const s1 = buildGlassShadow(recipe, 1);
    const s3 = buildGlassShadow(recipe, 3);
    // Match the outer drop shadow: `0 <y>px <blur>px rgba(...)`.
    const blur1 = Number(s1.match(/0 \d+px (\d+)px rgba/)?.[1] ?? 0);
    const blur3 = Number(s3.match(/0 \d+px (\d+)px rgba/)?.[1] ?? 0);
    expect(blur3).toBeGreaterThan(blur1);
  });

  test('highlight layer uses the recipe borderColor, not a hard-coded white', () => {
    const shadow = buildGlassShadow(recipe, 2);
    expect(shadow).toContain(recipe.borderColor);
    expect(shadow).not.toContain('#ffffff');
  });
});

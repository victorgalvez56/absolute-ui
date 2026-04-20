/**
 * Node-only tests for the layout primitives' pure style helpers.
 * Path mirrors the GlassButton / GlassSurface split — the JSX layer is
 * exercised later by Ladle / RNTL; here we lock down the spacing-token
 * resolver and default cross-axis behavior of Box / HStack / VStack.
 */

import { spacing } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import { buildBoxStyle, buildHStackStyle, buildVStackStyle, resolveSpacing } from './style.js';

describe('resolveSpacing', () => {
  test('resolves spacing tokens against the shared scale', () => {
    expect(resolveSpacing('md')).toBe(spacing.md);
    expect(resolveSpacing('none')).toBe(spacing.none);
    expect(resolveSpacing('2xl')).toBe(spacing['2xl']);
  });

  test('passes raw numbers through unchanged', () => {
    expect(resolveSpacing(7)).toBe(7);
    expect(resolveSpacing(0)).toBe(0);
  });

  test('undefined → undefined (no style key emitted)', () => {
    expect(resolveSpacing(undefined)).toBeUndefined();
  });
});

describe('buildBoxStyle', () => {
  test('emits only the keys the caller provided', () => {
    const style = buildBoxStyle({ p: 'md' });
    expect(style).toEqual({ padding: spacing.md });
  });

  test('maps every shorthand onto its RN property', () => {
    const style = buildBoxStyle({
      p: 'sm',
      px: 'md',
      py: 'lg',
      pt: 'xs',
      pb: 'xl',
      pl: '2xs',
      pr: '2xl',
      m: 'sm',
      mx: 'md',
      my: 'lg',
      mt: 'xs',
      mb: 'xl',
      ml: '2xs',
      mr: '2xl',
      gap: 'md',
    });
    expect(style.padding).toBe(spacing.sm);
    expect(style.paddingHorizontal).toBe(spacing.md);
    expect(style.paddingVertical).toBe(spacing.lg);
    expect(style.paddingTop).toBe(spacing.xs);
    expect(style.paddingBottom).toBe(spacing.xl);
    expect(style.paddingLeft).toBe(spacing['2xs']);
    expect(style.paddingRight).toBe(spacing['2xl']);
    expect(style.margin).toBe(spacing.sm);
    expect(style.marginHorizontal).toBe(spacing.md);
    expect(style.marginVertical).toBe(spacing.lg);
    expect(style.marginTop).toBe(spacing.xs);
    expect(style.marginBottom).toBe(spacing.xl);
    expect(style.marginLeft).toBe(spacing['2xs']);
    expect(style.marginRight).toBe(spacing['2xl']);
    expect(style.gap).toBe(spacing.md);
  });

  test('raw numbers win over tokens for off-scale overrides', () => {
    expect(buildBoxStyle({ p: 7 }).padding).toBe(7);
  });

  test('flex + alignment passthrough', () => {
    const style = buildBoxStyle({
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
    });
    expect(style.flex).toBe(1);
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('space-between');
    expect(style.alignSelf).toBe('stretch');
  });
});

describe('buildHStackStyle', () => {
  test('defaults to row, center cross-axis, gap md', () => {
    const style = buildHStackStyle({});
    expect(style.flexDirection).toBe('row');
    expect(style.alignItems).toBe('center');
    expect(style.gap).toBe(spacing.md);
  });

  test('caller gap wins over the default', () => {
    expect(buildHStackStyle({ gap: 'xs' }).gap).toBe(spacing.xs);
    expect(buildHStackStyle({ gap: 2 }).gap).toBe(2);
  });

  test('caller alignItems wins over the default', () => {
    expect(buildHStackStyle({ alignItems: 'flex-start' }).alignItems).toBe('flex-start');
  });

  test('flexDirection is locked to row even if caller passes none', () => {
    // BoxLayoutProps has no flexDirection prop, so there is no way for
    // a caller to override it through buildHStackStyle — this guards
    // that the final style never flips axis via a spread merge.
    const style = buildHStackStyle({ alignItems: 'baseline', gap: 'lg' });
    expect(style.flexDirection).toBe('row');
  });
});

describe('buildVStackStyle', () => {
  test('defaults to column, stretch cross-axis, gap md', () => {
    const style = buildVStackStyle({});
    expect(style.flexDirection).toBe('column');
    expect(style.alignItems).toBe('stretch');
    expect(style.gap).toBe(spacing.md);
  });

  test('caller gap wins over the default', () => {
    expect(buildVStackStyle({ gap: 'xl' }).gap).toBe(spacing.xl);
  });

  test('caller alignItems wins over the default', () => {
    expect(buildVStackStyle({ alignItems: 'center' }).alignItems).toBe('center');
  });

  test('flexDirection is locked to column', () => {
    const style = buildVStackStyle({ alignItems: 'baseline', gap: 'lg' });
    expect(style.flexDirection).toBe('column');
  });
});

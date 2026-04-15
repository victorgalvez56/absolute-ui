/**
 * GlassModal unit tests. Pure helpers in node, same split as GlassSheet:
 * vitest runs `*.test.ts` with no jsdom, JSX wiring is deferred to Ladle.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  MODAL_OUTER_PADDING,
  MODAL_SURFACE_GAP,
  MODAL_SURFACE_MAX_WIDTH,
  MODAL_SURFACE_PADDING,
  buildModalBackdropStyle,
  buildModalDescriptionStyle,
  buildModalOverlayStyle,
  buildModalSurfaceStyle,
  buildModalTitleStyle,
  resolveModalScrimColor,
} from './style.js';

const themes = [
  ['aurora', aurora],
  ['obsidian', obsidian],
  ['frost', frost],
  ['sunset', sunset],
] as const;

function expectFullBleed(s: {
  position: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
}) {
  expect(s.position).toBe('absolute');
  expect([s.top, s.left, s.right, s.bottom]).toEqual([0, 0, 0, 0]);
}

describe('buildModalOverlayStyle', () => {
  const style = buildModalOverlayStyle();

  test('pins all four edges at 0 and centers content on both axes', () => {
    expectFullBleed(style);
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('center');
  });

  test('paddingHorizontal matches MODAL_OUTER_PADDING (24)', () => {
    expect(MODAL_OUTER_PADDING).toBe(24);
    expect(style.paddingHorizontal).toBe(MODAL_OUTER_PADDING);
  });
});

describe('buildModalBackdropStyle', () => {
  test('pins all four edges at 0 and forwards scrim color verbatim', () => {
    const style = buildModalBackdropStyle('#ABCDEF12');
    expectFullBleed(style);
    expect(style.backgroundColor).toBe('#ABCDEF12');
  });
});

describe('buildModalSurfaceStyle', () => {
  const style = buildModalSurfaceStyle();

  test('fills available width up to MODAL_SURFACE_MAX_WIDTH (420)', () => {
    expect(MODAL_SURFACE_MAX_WIDTH).toBe(420);
    expect(style.width).toBe('100%');
    expect(style.maxWidth).toBe(MODAL_SURFACE_MAX_WIDTH);
  });

  test('uses MODAL_SURFACE_PADDING (24) and MODAL_SURFACE_GAP (12)', () => {
    expect(MODAL_SURFACE_PADDING).toBe(24);
    expect(MODAL_SURFACE_GAP).toBe(12);
    expect(style.padding).toBe(MODAL_SURFACE_PADDING);
    expect(style.gap).toBe(MODAL_SURFACE_GAP);
  });
});

describe('buildModalTitleStyle', () => {
  test('typography matches the title spec (18 / 600 / center)', () => {
    const style = buildModalTitleStyle('#000000');
    expect(style.fontSize).toBe(18);
    expect(style.fontWeight).toBe('600');
    expect(style.textAlign).toBe('center');
  });

  test('omits lineHeight for Dynamic Type safety', () => {
    expect((buildModalTitleStyle('#000') as Record<string, unknown>).lineHeight).toBeUndefined();
  });

  test.each(themes)('uses the %s theme textPrimary color verbatim', (_name, theme) => {
    expect(buildModalTitleStyle(theme.colors.textPrimary).color).toBe(theme.colors.textPrimary);
  });
});

describe('buildModalDescriptionStyle', () => {
  test('typography matches the description spec (14 / 400 / center)', () => {
    const style = buildModalDescriptionStyle('#000000');
    expect(style.fontSize).toBe(14);
    expect(style.fontWeight).toBe('400');
    expect(style.textAlign).toBe('center');
  });

  test('omits lineHeight for Dynamic Type safety', () => {
    const style = buildModalDescriptionStyle('#000') as Record<string, unknown>;
    expect(style.lineHeight).toBeUndefined();
  });

  test.each(themes)('uses the %s theme textSecondary color verbatim', (_name, theme) => {
    expect(buildModalDescriptionStyle(theme.colors.textSecondary).color).toBe(
      theme.colors.textSecondary,
    );
  });
});

describe('resolveModalScrimColor', () => {
  test('dark theme returns the light-tinted scrim', () => {
    expect(resolveModalScrimColor(true)).toBe('#FFFFFF26');
  });

  test('light theme returns the dark scrim', () => {
    expect(resolveModalScrimColor(false)).toBe('#00000066');
  });

  test.each(themes)('%s theme resolves to the correct polarity', (_name, theme) => {
    expect(resolveModalScrimColor(theme.dark)).toBe(theme.dark ? '#FFFFFF26' : '#00000066');
  });

  test('reduced transparency bumps both polarities', () => {
    expect(resolveModalScrimColor(true, true)).toBe('#FFFFFF66');
    expect(resolveModalScrimColor(false, true)).toBe('#000000A6');
  });

  test('reduced-transparency alpha is strictly higher than default alpha', () => {
    const alpha = (hex: string) => Number.parseInt(hex.slice(-2), 16);
    expect(alpha(resolveModalScrimColor(true, true))).toBeGreaterThan(
      alpha(resolveModalScrimColor(true, false)),
    );
    expect(alpha(resolveModalScrimColor(false, true))).toBeGreaterThan(
      alpha(resolveModalScrimColor(false, false)),
    );
  });
});

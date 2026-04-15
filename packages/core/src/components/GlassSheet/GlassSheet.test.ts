/**
 * GlassSheet unit tests.
 *
 * Same pure-helpers-in-node split as GlassButton / GlassSurface: the
 * workspace vitest runs against `*.test.ts` only (no jsdom), so we
 * test the layout helpers directly and defer JSX wiring to a later
 * Ladle interaction phase.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  SHEET_HANDLE_HEIGHT,
  SHEET_HANDLE_TOP_MARGIN,
  SHEET_HANDLE_WIDTH,
  SHEET_SAFE_BOTTOM,
  buildSheetBackdropStyle,
  buildSheetContainerStyle,
  buildSheetHandleStyle,
  buildSheetTitleStyle,
  resolveSheetScrimColor,
} from './style.js';

const themes = [
  ['aurora', aurora],
  ['obsidian', obsidian],
  ['frost', frost],
  ['sunset', sunset],
] as const;

describe('buildSheetBackdropStyle', () => {
  test('pins all four edges at 0 with absolute position', () => {
    const style = buildSheetBackdropStyle('#00000066');
    expect(style.position).toBe('absolute');
    expect(style.top).toBe(0);
    expect(style.left).toBe(0);
    expect(style.right).toBe(0);
    expect(style.bottom).toBe(0);
  });

  test('forwards scrim color verbatim', () => {
    expect(buildSheetBackdropStyle('#ABCDEF12').backgroundColor).toBe('#ABCDEF12');
  });
});

describe('buildSheetContainerStyle', () => {
  const style = buildSheetContainerStyle();

  test('bottom-anchored with left/right at 0 and top unset', () => {
    expect(style.position).toBe('absolute');
    expect(style.left).toBe(0);
    expect(style.right).toBe(0);
    expect(style.bottom).toBe(0);
    // Top is intentionally unset so the sheet hugs the bottom.
    expect((style as unknown as { top?: number }).top).toBeUndefined();
  });

  test('uses SHEET_SAFE_BOTTOM (24) and SHEET_HANDLE_TOP_MARGIN (12) for padding', () => {
    expect(SHEET_SAFE_BOTTOM).toBe(24);
    expect(SHEET_HANDLE_TOP_MARGIN).toBe(12);
    expect(style.paddingBottom).toBe(SHEET_SAFE_BOTTOM);
    expect(style.paddingTop).toBe(SHEET_HANDLE_TOP_MARGIN);
  });
});

describe('buildSheetHandleStyle', () => {
  test('handle geometry matches the 40x4 pill spec', () => {
    expect(SHEET_HANDLE_WIDTH).toBe(40);
    expect(SHEET_HANDLE_HEIGHT).toBe(4);
    const style = buildSheetHandleStyle('#000000');
    expect(style.width).toBe(SHEET_HANDLE_WIDTH);
    expect(style.height).toBe(SHEET_HANDLE_HEIGHT);
    expect(style.borderRadius).toBe(SHEET_HANDLE_HEIGHT / 2);
    expect(style.borderRadius).toBe(2);
    expect(style.alignSelf).toBe('center');
    expect(style.marginTop).toBe(12);
    expect(style.marginBottom).toBe(8);
  });

  test.each(themes)('forwards the %s theme divider color verbatim', (_name, theme) => {
    expect(buildSheetHandleStyle(theme.colors.divider).backgroundColor).toBe(theme.colors.divider);
  });
});

describe('buildSheetTitleStyle', () => {
  test('typography matches the header spec (18 / 600 / center)', () => {
    const style = buildSheetTitleStyle('#000000');
    expect(style.fontSize).toBe(18);
    expect(style.fontWeight).toBe('600');
    expect(style.textAlign).toBe('center');
  });

  test.each(themes)('uses the %s theme textPrimary color verbatim', (_name, theme) => {
    expect(buildSheetTitleStyle(theme.colors.textPrimary).color).toBe(theme.colors.textPrimary);
  });
});

describe('resolveSheetScrimColor', () => {
  test('dark theme returns the light-tinted scrim', () => {
    expect(resolveSheetScrimColor(true)).toBe('#FFFFFF26');
  });

  test('light theme returns the dark scrim', () => {
    expect(resolveSheetScrimColor(false)).toBe('#00000066');
  });

  test.each(themes)('%s theme resolves to the correct polarity', (_name, theme) => {
    const expected = theme.dark ? '#FFFFFF26' : '#00000066';
    expect(resolveSheetScrimColor(theme.dark)).toBe(expected);
  });
});

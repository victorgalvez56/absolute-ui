/**
 * GlassCard unit tests — pure helpers only.
 *
 * Same split as GlassButton/GlassSurface: the workspace vitest runs in
 * node against `*.test.ts`. The JSX wiring (compound sub-components,
 * GlassSurface composition) is deferred to Ladle `play()` + RNTL once
 * the native app exists.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  buildCardBodyStyle,
  buildCardDividerStyle,
  buildCardFooterStyle,
  buildCardHeaderStyle,
  buildCardSubtitleStyle,
  buildCardTitleStyle,
} from './style.js';

const themes = [
  ['aurora', aurora],
  ['obsidian', obsidian],
  ['frost', frost],
  ['sunset', sunset],
] as const;

describe('buildCardHeaderStyle', () => {
  const header = buildCardHeaderStyle();

  test('has horizontal and vertical padding', () => {
    expect(header.paddingHorizontal).toBeGreaterThan(0);
    expect(header.paddingVertical).toBeGreaterThan(0);
  });

  test('gap is half the body gap so title/subtitle stay tight', () => {
    expect(header.gap).toBe(buildCardBodyStyle().gap / 2);
  });
});

describe('buildCardBodyStyle', () => {
  const body = buildCardBodyStyle();
  const header = buildCardHeaderStyle();

  test('shares horizontal padding with header', () => {
    expect(body.paddingHorizontal).toBe(header.paddingHorizontal);
  });

  test('uses a larger gap than the header for body content spacing', () => {
    expect(body.gap).toBeGreaterThan(header.gap);
  });
});

describe('buildCardFooterStyle', () => {
  const footer = buildCardFooterStyle();

  test('lays children out in a row, right-aligned and vertically centered', () => {
    expect(footer.flexDirection).toBe('row');
    expect(footer.justifyContent).toBe('flex-end');
    expect(footer.alignItems).toBe('center');
  });

  test('padding matches body/header for consistent alignment', () => {
    const body = buildCardBodyStyle();
    const header = buildCardHeaderStyle();
    expect(footer.paddingHorizontal).toBe(body.paddingHorizontal);
    expect(footer.paddingHorizontal).toBe(header.paddingHorizontal);
    expect(footer.paddingVertical).toBe(body.paddingVertical);
    expect(footer.paddingVertical).toBe(header.paddingVertical);
  });
});

describe('buildCardTitleStyle across personality themes', () => {
  test.each(themes)('uses the %s theme textPrimary verbatim', (_name, theme) => {
    const style = buildCardTitleStyle(theme.colors.textPrimary);
    expect(style.color).toBe(theme.colors.textPrimary);
    expect(style.fontSize).toBe(18);
    expect(style.fontWeight).toBe('600');
  });

  test('does not hard-code lineHeight (Dynamic Type safety)', () => {
    // Setting a fixed lineHeight would clip glyphs when the user
    // enlarges system font size — RN does not scale lineHeight
    // even when fontScale scales fontSize. The helper omits it.
    const style = buildCardTitleStyle('#000') as Record<string, unknown>;
    expect(style.lineHeight).toBeUndefined();
  });
});

describe('buildCardSubtitleStyle across personality themes', () => {
  test.each(themes)('uses the %s theme textSecondary verbatim', (_name, theme) => {
    const style = buildCardSubtitleStyle(theme.colors.textSecondary);
    expect(style.color).toBe(theme.colors.textSecondary);
    expect(style.fontSize).toBe(14);
    expect(style.fontWeight).toBe('400');
  });

  test('does not hard-code lineHeight (Dynamic Type safety)', () => {
    const style = buildCardSubtitleStyle('#000') as Record<string, unknown>;
    expect(style.lineHeight).toBeUndefined();
  });
});

describe('buildCardDividerStyle across personality themes', () => {
  test.each(themes)('renders a 1px %s-themed line inset from the card edge', (_name, theme) => {
    const style = buildCardDividerStyle(theme.colors.divider);
    expect(style.height).toBe(1);
    expect(style.backgroundColor).toBe(theme.colors.divider);
    // Inset must match the section horizontal padding so the line
    // runs edge-aligned with header/body/footer content.
    expect(style.marginHorizontal).toBe(buildCardHeaderStyle().paddingHorizontal);
  });
});

describe('section alignment sanity', () => {
  test('header, body, and footer share the same horizontal padding', () => {
    const h = buildCardHeaderStyle().paddingHorizontal;
    expect(buildCardBodyStyle().paddingHorizontal).toBe(h);
    expect(buildCardFooterStyle().paddingHorizontal).toBe(h);
  });

  test('divider horizontal margin equals section horizontal padding', () => {
    expect(buildCardDividerStyle('#000').marginHorizontal).toBe(
      buildCardBodyStyle().paddingHorizontal,
    );
  });
});

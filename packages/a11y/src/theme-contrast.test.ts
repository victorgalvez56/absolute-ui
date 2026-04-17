/**
 * APCA regression guard for the shipped personality themes.
 *
 * Every theme must keep |Lc| >= 60 for both `textPrimary` and
 * `textSecondary` when the text sits on a composited elevation-1
 * glass surface — the composite is what the screen actually shows
 * once the glass tint is painted over the theme background.
 *
 * The a11y-auditor subagent computed these values by hand during
 * the GlassCard audit and found Aurora secondary at Lc 63.0 — a
 * tight margin. Any future tweak to a tint alpha, a secondary
 * color, or a background will fail this test before it ships.
 */
import { type Theme, aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import { MIN_BODY_LC, apcaContrast } from './apca.js';
import { parseHex } from './color.js';

/**
 * Composite an sRGB foreground with alpha channel onto an opaque
 * sRGB background using the standard source-over operator, then
 * return the resulting opaque hex. Works on 6- or 8-digit foreground
 * hex strings; 6-digit inputs are treated as fully opaque.
 */
function composite(foregroundHex: string, backgroundHex: string): string {
  const cleaned = foregroundHex.startsWith('#') ? foregroundHex.slice(1) : foregroundHex;
  const alpha = cleaned.length === 8 ? Number.parseInt(cleaned.slice(6, 8), 16) / 255 : 1;
  const fg = parseHex(`#${cleaned.slice(0, 6)}`);
  const bg = parseHex(backgroundHex);
  const r = Math.round((fg.r * alpha + bg.r * (1 - alpha)) * 255);
  const g = Math.round((fg.g * alpha + bg.g * (1 - alpha)) * 255);
  const b = Math.round((fg.b * alpha + bg.b * (1 - alpha)) * 255);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const themes: ReadonlyArray<readonly [string, Theme]> = [
  ['aurora', aurora],
  ['obsidian', obsidian],
  ['frost', frost],
  ['sunset', sunset],
];

describe('theme contrast on composited elevation-1 surfaces', () => {
  test.each(themes)('%s textPrimary meets the body contrast floor', (_name, theme) => {
    const surface = composite(theme.glass[1].tint, theme.colors.background);
    const lc = apcaContrast(theme.colors.textPrimary, surface);
    expect(Math.abs(lc)).toBeGreaterThanOrEqual(MIN_BODY_LC);
  });

  test.each(themes)('%s textSecondary meets the body contrast floor', (_name, theme) => {
    const surface = composite(theme.glass[1].tint, theme.colors.background);
    const lc = apcaContrast(theme.colors.textSecondary, surface);
    expect(Math.abs(lc)).toBeGreaterThanOrEqual(MIN_BODY_LC);
  });
});

/**
 * Elevation 2 is the default for GlassNavBar and for promoted
 * GlassCard variants. The tint is heavier than elevation 1, so the
 * composited background shifts further from the raw theme
 * background — verify both text roles still meet the floor.
 */
describe('theme contrast on composited elevation-2 surfaces', () => {
  test.each(themes)('%s textPrimary meets the body contrast floor', (_name, theme) => {
    const surface = composite(theme.glass[2].tint, theme.colors.background);
    const lc = apcaContrast(theme.colors.textPrimary, surface);
    expect(Math.abs(lc)).toBeGreaterThanOrEqual(MIN_BODY_LC);
  });

  test.each(themes)('%s textSecondary meets the body contrast floor', (_name, theme) => {
    const surface = composite(theme.glass[2].tint, theme.colors.background);
    const lc = apcaContrast(theme.colors.textSecondary, surface);
    expect(Math.abs(lc)).toBeGreaterThanOrEqual(MIN_BODY_LC);
  });
});

/**
 * Elevation 3 is the reserved slot for modal-adjacent surfaces —
 * GlassSheet, GlassModal — and carries the heaviest tint. These
 * are the surfaces users read longest (dialogs, confirmations,
 * settings sheets), so failing the contract here is the most
 * visible regression.
 */
describe('theme contrast on composited elevation-3 surfaces', () => {
  test.each(themes)('%s textPrimary meets the body contrast floor', (_name, theme) => {
    const surface = composite(theme.glass[3].tint, theme.colors.background);
    const lc = apcaContrast(theme.colors.textPrimary, surface);
    expect(Math.abs(lc)).toBeGreaterThanOrEqual(MIN_BODY_LC);
  });

  test.each(themes)('%s textSecondary meets the body contrast floor', (_name, theme) => {
    const surface = composite(theme.glass[3].tint, theme.colors.background);
    const lc = apcaContrast(theme.colors.textSecondary, surface);
    expect(Math.abs(lc)).toBeGreaterThanOrEqual(MIN_BODY_LC);
  });
});

/**
 * Danger role — used by GlassInput's error ring/helper text, and by
 * destructive controls. Runs against every composited elevation the
 * design system actually renders on, so an invalid input sitting on a
 * nested card (elevation 2) or a modal (elevation 3) is never
 * announced as error-colored while failing the readability floor.
 */
describe('theme contrast: danger', () => {
  const elevations = [1, 2, 3] as const;
  for (const elevation of elevations) {
    test.each(themes)(
      `%s danger meets the body contrast floor at elev ${elevation}`,
      (_name, theme) => {
        const surface = composite(theme.glass[elevation].tint, theme.colors.background);
        const lc = apcaContrast(theme.colors.danger, surface);
        expect(Math.abs(lc)).toBeGreaterThanOrEqual(MIN_BODY_LC);
      },
    );
  }
});

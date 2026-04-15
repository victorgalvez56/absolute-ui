/**
 * GlassNavBar unit tests.
 *
 * Same pure-helpers-in-node split as GlassCard / GlassButton / GlassSheet:
 * the workspace vitest runs against `*.test.ts` only (no jsdom), so we
 * test the layout helpers directly and defer JSX wiring to a later
 * Ladle interaction phase.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  NAV_BAR_HEIGHT,
  NAV_BAR_HORIZONTAL_PADDING,
  NAV_BAR_SLOT_WIDTH,
  buildNavBarContainerStyle,
  buildNavBarLeadingSlotStyle,
  buildNavBarTitleStyle,
  buildNavBarTrailingSlotStyle,
} from './style.js';

const themes = [
  ['aurora', aurora],
  ['obsidian', obsidian],
  ['frost', frost],
  ['sunset', sunset],
] as const;

describe('buildNavBarContainerStyle', () => {
  const style = buildNavBarContainerStyle();

  test('lays out children in a horizontal row, vertically centered', () => {
    expect(style.flexDirection).toBe('row');
    expect(style.alignItems).toBe('center');
  });

  test('container height matches the NAV_BAR_HEIGHT constant (56)', () => {
    expect(NAV_BAR_HEIGHT).toBe(56);
    expect(style.height).toBe(NAV_BAR_HEIGHT);
  });

  test('uses NAV_BAR_HORIZONTAL_PADDING (12) for left/right gutters', () => {
    expect(NAV_BAR_HORIZONTAL_PADDING).toBe(12);
    expect(style.paddingHorizontal).toBe(NAV_BAR_HORIZONTAL_PADDING);
  });
});

describe('buildNavBarLeadingSlotStyle', () => {
  const style = buildNavBarLeadingSlotStyle();

  test('fixed slot width with start-aligned, vertically centered content', () => {
    expect(style.width).toBe(NAV_BAR_SLOT_WIDTH);
    expect(style.alignItems).toBe('flex-start');
    expect(style.justifyContent).toBe('center');
  });
});

describe('buildNavBarTrailingSlotStyle', () => {
  const style = buildNavBarTrailingSlotStyle();

  test('fixed slot width with end-aligned, vertically centered content', () => {
    expect(style.width).toBe(NAV_BAR_SLOT_WIDTH);
    expect(style.alignItems).toBe('flex-end');
    expect(style.justifyContent).toBe('center');
  });
});

describe('slot symmetry invariant', () => {
  test('leading slot width equals trailing slot width so the title is optically centered', () => {
    const leading = buildNavBarLeadingSlotStyle();
    const trailing = buildNavBarTrailingSlotStyle();
    expect(leading.width).toBe(trailing.width);
  });
});

describe('buildNavBarTitleStyle', () => {
  test('typography matches the title spec (17 / 600 / center / flex 1)', () => {
    const style = buildNavBarTitleStyle('#000000');
    expect(style.flex).toBe(1);
    expect(style.textAlign).toBe('center');
    expect(style.fontSize).toBe(17);
    expect(style.fontWeight).toBe('600');
  });

  test.each(themes)('uses the %s theme textPrimary color verbatim', (_name, theme) => {
    expect(buildNavBarTitleStyle(theme.colors.textPrimary).color).toBe(theme.colors.textPrimary);
  });
});

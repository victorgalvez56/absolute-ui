/**
 * GlassTabBar unit tests.
 *
 * Same node-only vitest split as GlassButton / GlassSurface: cover the
 * pure layout helpers in `style.ts`. The JSX render itself is left for
 * Ladle interaction tests — adding jsdom + RTL is forbidden.
 */
import { describe, expect, test } from 'vitest';
import {
  TAB_ACTIVE_UNDERLINE_WIDTH,
  TAB_BAR_GAP,
  TAB_BAR_HORIZONTAL_PADDING,
  TAB_BAR_MIN_HEIGHT,
  TAB_BAR_VERTICAL_PADDING,
  TAB_ITEM_MIN_HIT,
  buildTabBarContainerStyle,
  buildTabItemStyle,
  buildTabLabelStyle,
} from './style.js';

const ACCENT = '#4FD3B5';

describe('buildTabBarContainerStyle', () => {
  const style = buildTabBarContainerStyle();

  test('lays out children in a stretched row', () => {
    expect(style.flexDirection).toBe('row');
    expect(style.alignItems).toBe('stretch');
  });

  test('uses minHeight (Dynamic Type safety) instead of a fixed height', () => {
    expect(style.minHeight).toBe(TAB_BAR_MIN_HEIGHT);
    expect(TAB_BAR_MIN_HEIGHT).toBe(64);
    expect((style as Record<string, unknown>).height).toBeUndefined();
  });

  test('forwards the token padding + gap', () => {
    expect(style.paddingHorizontal).toBe(TAB_BAR_HORIZONTAL_PADDING);
    expect(style.paddingVertical).toBe(TAB_BAR_VERTICAL_PADDING);
    expect(style.gap).toBe(TAB_BAR_GAP);
  });
});

describe('buildTabItemStyle', () => {
  test('every tab is an equal-flex, centered, 44pt-tall hit target', () => {
    const style = buildTabItemStyle({ active: false, accentColor: ACCENT });
    expect(style.flex).toBe(1);
    expect(style.minHeight).toBe(TAB_ITEM_MIN_HIT);
    expect(TAB_ITEM_MIN_HIT).toBe(44);
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('center');
    expect(style.paddingVertical).toBe(6);
    // No fixed height — Dynamic Type must be able to grow the row.
    expect((style as Record<string, unknown>).height).toBeUndefined();
  });

  test('active tab renders a structural underline in the accent color', () => {
    const style = buildTabItemStyle({ active: true, accentColor: ACCENT });
    expect(style.borderBottomWidth).toBe(TAB_ACTIVE_UNDERLINE_WIDTH);
    expect(TAB_ACTIVE_UNDERLINE_WIDTH).toBe(2);
    expect(style.borderBottomColor).toBe(ACCENT);
    expect(style.borderStyle).toBe('solid');
  });

  test('inactive tab keeps the border at the same width but transparent', () => {
    // Transparent border keeps the layout stable across state changes —
    // switching tabs must not reflow content by 2pt.
    const style = buildTabItemStyle({ active: false, accentColor: ACCENT });
    expect(style.borderBottomWidth).toBe(TAB_ACTIVE_UNDERLINE_WIDTH);
    expect(style.borderBottomColor).toBe('transparent');
  });

  test('item style no longer applies opacity', () => {
    // Opacity delta dimmed textSecondary past APCA Lc 60 on every theme.
    // The structural underline + fontWeight carry the state cue instead.
    const active = buildTabItemStyle({ active: true, accentColor: ACCENT });
    const inactive = buildTabItemStyle({ active: false, accentColor: ACCENT });
    expect((active as Record<string, unknown>).opacity).toBeUndefined();
    expect((inactive as Record<string, unknown>).opacity).toBeUndefined();
  });
});

describe('buildTabLabelStyle', () => {
  test.each(['#FFFFFF', '#0B0B0F', 'rgba(255,255,255,0.92)', '#A6F0E0'])(
    'forwards color %s verbatim',
    (color) => {
      expect(buildTabLabelStyle({ color, active: false }).color).toBe(color);
      expect(buildTabLabelStyle({ color, active: true }).color).toBe(color);
    },
  );

  test('label typography is centered 12pt', () => {
    const style = buildTabLabelStyle({ color: '#fff', active: false });
    expect(style.fontSize).toBe(12);
    expect(style.textAlign).toBe('center');
  });

  test.each([
    ['active', true, '700'],
    ['inactive', false, '500'],
  ] as const)('fontWeight when %s is %s', (_label, active, expected) => {
    expect(buildTabLabelStyle({ color: '#fff', active }).fontWeight).toBe(expected);
  });

  test('weight changes between states (one of two non-color state cues)', () => {
    const active = buildTabLabelStyle({ color: '#fff', active: true });
    const inactive = buildTabLabelStyle({ color: '#fff', active: false });
    expect(active.fontWeight).not.toBe(inactive.fontWeight);
  });
});

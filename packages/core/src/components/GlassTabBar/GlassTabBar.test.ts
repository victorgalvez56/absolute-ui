/**
 * GlassTabBar unit tests.
 *
 * Same node-only vitest split as GlassButton / GlassSurface: cover the
 * pure layout helpers in `style.ts`. The JSX render itself is left for
 * Ladle interaction tests — adding jsdom + RTL is forbidden.
 */
import { describe, expect, test } from 'vitest';
import {
  TAB_ACTIVE_OPACITY,
  TAB_BAR_GAP,
  TAB_BAR_HORIZONTAL_PADDING,
  TAB_BAR_MIN_HEIGHT,
  TAB_BAR_VERTICAL_PADDING,
  TAB_INACTIVE_OPACITY,
  TAB_ITEM_MIN_HIT,
  buildTabBarContainerStyle,
  buildTabItemStyle,
  buildTabLabelStyle,
} from './style.js';

describe('buildTabBarContainerStyle', () => {
  const style = buildTabBarContainerStyle();

  test('lays out children in a stretched row', () => {
    expect(style.flexDirection).toBe('row');
    expect(style.alignItems).toBe('stretch');
  });

  test('uses minHeight (Dynamic Type safety) instead of a fixed height', () => {
    expect(style.minHeight).toBe(TAB_BAR_MIN_HEIGHT);
    expect(TAB_BAR_MIN_HEIGHT).toBe(64);
    // The container must never lock height — labels/icons can grow with
    // the user's text-size preference.
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
    const style = buildTabItemStyle({ active: false });
    expect(style.flex).toBe(1);
    expect(style.minHeight).toBe(TAB_ITEM_MIN_HIT);
    expect(TAB_ITEM_MIN_HIT).toBe(44);
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('center');
    expect(style.paddingVertical).toBe(6);
    // No fixed height — Dynamic Type must be able to grow the row.
    expect((style as Record<string, unknown>).height).toBeUndefined();
  });

  test.each([
    ['active', true, TAB_ACTIVE_OPACITY],
    ['inactive', false, TAB_INACTIVE_OPACITY],
  ] as const)('opacity is %s', (_label, active, expected) => {
    expect(buildTabItemStyle({ active }).opacity).toBe(expected);
  });

  test('active opacity dominates inactive (color-blind / grayscale fallback cue)', () => {
    // State must not be encoded in color alone — opacity gap is the
    // accessibility fallback for users who lose the hue cue.
    expect(TAB_ACTIVE_OPACITY).toBeGreaterThan(TAB_INACTIVE_OPACITY);
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

  test('weight changes between states (complements the opacity cue)', () => {
    // A second non-color cue: bolder weight on the active tab so users
    // who flatten opacity (high-contrast modes) still see the state.
    const active = buildTabLabelStyle({ color: '#fff', active: true });
    const inactive = buildTabLabelStyle({ color: '#fff', active: false });
    expect(active.fontWeight).not.toBe(inactive.fontWeight);
  });
});

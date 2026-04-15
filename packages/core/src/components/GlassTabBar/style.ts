/**
 * Pure layout helpers for GlassTabBar. Same node-testable split.
 *
 * GlassTabBar is a bottom-anchored row of equally-sized tabs. Each
 * tab enforces the 44x44 minimum hit target, renders its label in
 * the theme's text color, and scales opacity by active state.
 */

export type TabBarContainerStyle = {
  flexDirection: 'row';
  alignItems: 'stretch';
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
};

export type TabItemStyle = {
  flex: 1;
  minHeight: number;
  alignItems: 'center';
  justifyContent: 'center';
  paddingVertical: number;
  /**
   * A bottom border rendered on the active tab as a structural
   * state indicator. Width of 0 collapses to nothing on inactive
   * tabs, width > 0 paints the border with the theme accent color
   * on the active tab. Not color-only: it's a shape change.
   */
  borderBottomWidth: number;
  borderBottomColor: string;
  /**
   * Transparent bottom border of the inactive width keeps the
   * layout identical whether or not the underline is visible,
   * so switching tabs doesn't shift content by 2pt.
   */
  borderStyle: 'solid';
};

export type TabLabelStyle = {
  color: string;
  fontSize: number;
  fontWeight: '500' | '700';
  textAlign: 'center';
};

export const TAB_BAR_MIN_HEIGHT = 64;
export const TAB_BAR_HORIZONTAL_PADDING = 12;
export const TAB_BAR_VERTICAL_PADDING = 8;
export const TAB_BAR_GAP = 4;
export const TAB_ITEM_MIN_HIT = 44;
/** Underline stroke width for the active-tab structural indicator. */
export const TAB_ACTIVE_UNDERLINE_WIDTH = 2;

export function buildTabBarContainerStyle(): TabBarContainerStyle {
  return {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: TAB_BAR_MIN_HEIGHT,
    paddingHorizontal: TAB_BAR_HORIZONTAL_PADDING,
    paddingVertical: TAB_BAR_VERTICAL_PADDING,
    gap: TAB_BAR_GAP,
  };
}

/**
 * Build the item style. Active vs inactive is communicated via an
 * underline stroke (structural, not color) and the label weight
 * (handled by buildTabLabelStyle). No opacity delta — dimming
 * `textSecondary` at 0.55 pushed inactive tab APCA below the Lc 60
 * floor on every theme.
 */
export function buildTabItemStyle(options: {
  active: boolean;
  accentColor: string;
}): TabItemStyle {
  return {
    flex: 1,
    minHeight: TAB_ITEM_MIN_HIT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderStyle: 'solid',
    borderBottomWidth: TAB_ACTIVE_UNDERLINE_WIDTH,
    borderBottomColor: options.active ? options.accentColor : 'transparent',
  };
}

export function buildTabLabelStyle(options: { color: string; active: boolean }): TabLabelStyle {
  return {
    color: options.color,
    fontSize: 12,
    fontWeight: options.active ? '700' : '500',
    textAlign: 'center',
  };
}

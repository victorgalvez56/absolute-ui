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
};

/**
 * The sliding indicator is an absolutely-positioned bar rendered
 * inside the container. Its translateX + width are animated by the
 * GlassTabBar component; only the static visual properties live here.
 */
export type TabIndicatorBaseStyle = {
  position: 'absolute';
  bottom: number;
  left: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
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
/** Stroke height of the animated sliding indicator. */
export const TAB_INDICATOR_HEIGHT = 2;

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
 * Build the item style. Active vs inactive is communicated via the
 * animated sliding indicator (structural, not color) and the label
 * weight (handled by buildTabLabelStyle).
 * No opacity delta — dimming textSecondary pushed inactive tab APCA
 * below the Lc 60 floor on every theme.
 * The `active` param is kept so callers don't need to change their
 * call-sites; it is unused here because the indicator handles state.
 */
export function buildTabItemStyle(_options: { active: boolean }): TabItemStyle {
  return {
    flex: 1,
    minHeight: TAB_ITEM_MIN_HIT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  };
}

/**
 * Static visual properties for the animated sliding indicator.
 * GlassTabBar drives `width` and `transform: [{translateX}]`
 * on top of this base via useAnimatedStyle.
 */
export function buildTabIndicatorBaseStyle(accentColor: string): TabIndicatorBaseStyle {
  return {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: TAB_INDICATOR_HEIGHT,
    borderRadius: TAB_INDICATOR_HEIGHT / 2,
    backgroundColor: accentColor,
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

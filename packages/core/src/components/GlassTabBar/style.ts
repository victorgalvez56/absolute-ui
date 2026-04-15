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
  opacity: number;
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
export const TAB_INACTIVE_OPACITY = 0.55;
export const TAB_ACTIVE_OPACITY = 1;

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

export function buildTabItemStyle(options: { active: boolean }): TabItemStyle {
  return {
    flex: 1,
    minHeight: TAB_ITEM_MIN_HIT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    opacity: options.active ? TAB_ACTIVE_OPACITY : TAB_INACTIVE_OPACITY,
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

/**
 * Pure layout helpers for GlassNavBar. Same node-testable split.
 *
 * GlassNavBar is a top-anchored glass bar with an optional leading slot
 * (usually a back button), a centered title, and an optional trailing
 * slot (usually an action button). Height and slot widths are fixed so
 * the title stays optically centered regardless of slot content.
 */

export type NavBarContainerStyle = {
  minHeight: number;
  flexDirection: 'row';
  alignItems: 'center';
  paddingHorizontal: number;
};

export type NavBarSlotStyle = {
  width: number;
  minHeight: number;
  alignItems: 'flex-start' | 'flex-end';
  justifyContent: 'center';
};

export type NavBarTitleStyle = {
  flex: 1;
  textAlign: 'center';
  color: string;
  fontSize: number;
  fontWeight: '600';
};

/**
 * Minimum bar height. Uses `minHeight` at render time so the bar
 * can grow when Dynamic Type scales the title past the box, which
 * prevents glyph clipping at the largest accessibility sizes. A
 * fixed `height` would trap the label inside 56pt at all scales.
 */
export const NAV_BAR_HEIGHT = 56;
export const NAV_BAR_HORIZONTAL_PADDING = 12;
export const NAV_BAR_SLOT_WIDTH = 56;
/**
 * Hit target floor for interactive children placed in the leading
 * and trailing slots. The slot itself applies `minHeight: 44` so a
 * caller that renders an icon-only Pressable still meets the
 * Absolute UI accessibility contract without extra configuration.
 */
export const NAV_BAR_SLOT_MIN_HIT = 44;

export function buildNavBarContainerStyle(): NavBarContainerStyle {
  return {
    minHeight: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: NAV_BAR_HORIZONTAL_PADDING,
  };
}

export function buildNavBarLeadingSlotStyle(): NavBarSlotStyle {
  return {
    width: NAV_BAR_SLOT_WIDTH,
    minHeight: NAV_BAR_SLOT_MIN_HIT,
    alignItems: 'flex-start',
    justifyContent: 'center',
  };
}

export function buildNavBarTrailingSlotStyle(): NavBarSlotStyle {
  return {
    width: NAV_BAR_SLOT_WIDTH,
    minHeight: NAV_BAR_SLOT_MIN_HIT,
    alignItems: 'flex-end',
    justifyContent: 'center',
  };
}

export function buildNavBarTitleStyle(textPrimary: string): NavBarTitleStyle {
  return {
    flex: 1,
    textAlign: 'center',
    color: textPrimary,
    fontSize: 17,
    fontWeight: '600',
  };
}

/**
 * Pure layout helpers for GlassSheet. Same node-testable split the
 * other primitives use.
 *
 * A "sheet" here is a bottom-anchored glass surface with a top handle,
 * a header, and a scrollable body. In Phase 1 the show/hide transition
 * is an instant mount/unmount — Phase 2 wires the motion layer via
 * the theme's `motion.overlay` spring.
 */

export type SheetBackdropStyle = {
  position: 'absolute';
  top: number;
  left: number;
  right: number;
  bottom: number;
  backgroundColor: string;
};

export type SheetContainerStyle = {
  position: 'absolute';
  left: number;
  right: number;
  bottom: number;
  paddingBottom: number;
  paddingTop: number;
};

export type SheetHandleStyle = {
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  alignSelf: 'center';
  marginTop: number;
  marginBottom: number;
};

export type SheetTitleStyle = {
  color: string;
  fontSize: number;
  fontWeight: '600';
  textAlign: 'center';
};

export const SHEET_HANDLE_WIDTH = 40;
export const SHEET_HANDLE_HEIGHT = 4;
export const SHEET_HORIZONTAL_PADDING = 20;
export const SHEET_SAFE_BOTTOM = 24;
export const SHEET_HANDLE_TOP_MARGIN = 12;
export const SHEET_HANDLE_BOTTOM_MARGIN = 8;

/**
 * Build the backdrop scrim style. The backdrop is a tappable element
 * that dismisses the sheet; the opacity is computed from the theme's
 * glass recipe so light themes use a darker scrim and dark themes use
 * a lighter one.
 */
export function buildSheetBackdropStyle(scrimColor: string): SheetBackdropStyle {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: scrimColor,
  };
}

export function buildSheetContainerStyle(): SheetContainerStyle {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: SHEET_SAFE_BOTTOM,
    paddingTop: SHEET_HANDLE_TOP_MARGIN,
  };
}

export function buildSheetHandleStyle(handleColor: string): SheetHandleStyle {
  return {
    width: SHEET_HANDLE_WIDTH,
    height: SHEET_HANDLE_HEIGHT,
    borderRadius: SHEET_HANDLE_HEIGHT / 2,
    backgroundColor: handleColor,
    alignSelf: 'center',
    marginTop: SHEET_HANDLE_TOP_MARGIN,
    marginBottom: SHEET_HANDLE_BOTTOM_MARGIN,
  };
}

export function buildSheetTitleStyle(textPrimary: string): SheetTitleStyle {
  return {
    color: textPrimary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  };
}

/**
 * Default scrim opacity, expressed as a hex alpha suffix. Dark themes
 * use a lighter tinted scrim; light themes use a dark scrim. The
 * caller composes the two values with the theme background.
 */
export function resolveSheetScrimColor(isDarkTheme: boolean): string {
  return isDarkTheme ? '#FFFFFF26' : '#00000066';
}

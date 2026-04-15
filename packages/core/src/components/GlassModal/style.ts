/**
 * Pure layout helpers for GlassModal.
 *
 * GlassModal is a centered dialog variant of the sheet pattern:
 * same scrim, same focus-escape contract, but the content surface
 * sits in the middle of the viewport instead of at the bottom.
 */

export type ModalOverlayStyle = {
  position: 'absolute';
  top: number;
  left: number;
  right: number;
  bottom: number;
  alignItems: 'center';
  justifyContent: 'center';
  paddingHorizontal: number;
};

export type ModalBackdropStyle = {
  position: 'absolute';
  top: number;
  left: number;
  right: number;
  bottom: number;
  backgroundColor: string;
};

export type ModalSurfaceStyle = {
  width: '100%';
  maxWidth: number;
  padding: number;
  gap: number;
};

export type ModalTitleStyle = {
  color: string;
  fontSize: number;
  fontWeight: '600';
  textAlign: 'center';
};

export type ModalDescriptionStyle = {
  color: string;
  fontSize: number;
  fontWeight: '400';
  textAlign: 'center';
};

export const MODAL_OUTER_PADDING = 24;
export const MODAL_SURFACE_PADDING = 24;
export const MODAL_SURFACE_GAP = 12;
export const MODAL_SURFACE_MAX_WIDTH = 420;

export function buildModalOverlayStyle(): ModalOverlayStyle {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: MODAL_OUTER_PADDING,
  };
}

export function buildModalBackdropStyle(scrimColor: string): ModalBackdropStyle {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: scrimColor,
  };
}

export function buildModalSurfaceStyle(): ModalSurfaceStyle {
  return {
    width: '100%',
    maxWidth: MODAL_SURFACE_MAX_WIDTH,
    padding: MODAL_SURFACE_PADDING,
    gap: MODAL_SURFACE_GAP,
  };
}

export function buildModalTitleStyle(textPrimary: string): ModalTitleStyle {
  return {
    color: textPrimary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  };
}

export function buildModalDescriptionStyle(textSecondary: string): ModalDescriptionStyle {
  return {
    color: textSecondary,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  };
}

/**
 * Reuse the same scrim polarity contract GlassSheet uses so the two
 * modal surfaces feel like one family. Dark themes get a lighter
 * scrim and light themes get a darker one; Reduced Transparency
 * bumps the alpha on both branches to preserve the modal cue when
 * the surface collapses to an opaque fallback.
 */
export function resolveModalScrimColor(isDarkTheme: boolean, reducedTransparency = false): string {
  if (reducedTransparency) {
    return isDarkTheme ? '#FFFFFF66' : '#000000A6';
  }
  return isDarkTheme ? '#FFFFFF26' : '#00000066';
}

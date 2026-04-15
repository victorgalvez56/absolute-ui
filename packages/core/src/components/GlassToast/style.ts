/**
 * Pure layout helpers for GlassToast.
 *
 * GlassToast is an ephemeral notification pill anchored to the top
 * or bottom of the viewport. No backdrop scrim — toasts float over
 * content without blocking interaction. Variant drives a small
 * leading stripe in the accent / success / error / info color.
 */

export type ToastVariant = 'default' | 'success' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

export type ToastContainerStyle = {
  position: 'absolute';
  left: number;
  right: number;
  alignItems: 'center';
  paddingHorizontal: number;
  top?: number;
  bottom?: number;
};

export type ToastPillStyle = {
  flexDirection: 'row';
  alignItems: 'center';
  gap: number;
  paddingHorizontal: number;
  paddingVertical: number;
  maxWidth: number;
};

export type ToastStripeStyle = {
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
};

export type ToastMessageStyle = {
  color: string;
  fontSize: number;
  fontWeight: '500';
  flexShrink: 1;
};

export const TOAST_OUTER_PADDING = 16;
export const TOAST_TOP_INSET = 24;
export const TOAST_BOTTOM_INSET = 32;
export const TOAST_PILL_PADDING_HORIZONTAL = 16;
export const TOAST_PILL_PADDING_VERTICAL = 12;
export const TOAST_PILL_GAP = 12;
export const TOAST_PILL_MAX_WIDTH = 480;
export const TOAST_STRIPE_WIDTH = 4;
export const TOAST_STRIPE_HEIGHT = 24;

export function buildToastContainerStyle(position: ToastPosition): ToastContainerStyle {
  const base = {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    alignItems: 'center' as const,
    paddingHorizontal: TOAST_OUTER_PADDING,
  };
  if (position === 'top') {
    return { ...base, top: TOAST_TOP_INSET };
  }
  return { ...base, bottom: TOAST_BOTTOM_INSET };
}

export function buildToastPillStyle(): ToastPillStyle {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TOAST_PILL_GAP,
    paddingHorizontal: TOAST_PILL_PADDING_HORIZONTAL,
    paddingVertical: TOAST_PILL_PADDING_VERTICAL,
    maxWidth: TOAST_PILL_MAX_WIDTH,
  };
}

export function buildToastStripeStyle(color: string): ToastStripeStyle {
  return {
    width: TOAST_STRIPE_WIDTH,
    height: TOAST_STRIPE_HEIGHT,
    borderRadius: TOAST_STRIPE_WIDTH / 2,
    backgroundColor: color,
  };
}

export function buildToastMessageStyle(textPrimary: string): ToastMessageStyle {
  return {
    color: textPrimary,
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  };
}

/**
 * Variant palette. Defaults to the theme accent for neutral toasts,
 * then three fixed hues for success / error / info so those
 * semantic states are recognizable across personality themes.
 * The stripe is a structural indicator (not the only signal) —
 * consumers are expected to pair it with meaningful message text.
 */
export function resolveToastStripeColor(variant: ToastVariant, themeAccent: string): string {
  switch (variant) {
    case 'success':
      return '#2FB26B';
    case 'error':
      return '#E05A3B';
    case 'info':
      return '#4A8EE0';
    default:
      return themeAccent;
  }
}

/**
 * Focus ring spec — produced by `getFocusRing(theme)` and consumed by
 * primitives to render a keyboard/switch-control focus indicator that
 * stays visible on every glass recipe. Width is deliberately high
 * because APCA on glass tolerates less fine detail than opaque text.
 */
export type FocusRing = {
  color: string;
  width: number;
  offset: number;
  radius: number;
};

export const defaultFocusRing = {
  width: 3,
  offset: 2,
  radius: 10,
} as const;

export function getFocusRing(color: string): FocusRing {
  return {
    color,
    width: defaultFocusRing.width,
    offset: defaultFocusRing.offset,
    radius: defaultFocusRing.radius,
  };
}

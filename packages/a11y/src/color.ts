/**
 * Parse a 6- or 8-digit sRGB hex string (with or without leading `#`)
 * into normalized 0–1 RGB components. Alpha is ignored — APCA operates
 * on the *resolved* opaque color, which the caller must pre-composite
 * when the surface has transparency.
 */
export function parseHex(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.startsWith('#') ? hex.slice(1) : hex;
  if (cleaned.length !== 6 && cleaned.length !== 8) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const r = Number.parseInt(cleaned.slice(0, 2), 16);
  const g = Number.parseInt(cleaned.slice(2, 4), 16);
  const b = Number.parseInt(cleaned.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return { r: r / 255, g: g / 255, b: b / 255 };
}

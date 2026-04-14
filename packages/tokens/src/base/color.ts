/**
 * Base color primitives. Themes reference these by name so personalities
 * can remix a shared palette instead of redefining raw hex values.
 *
 * All values are sRGB hex. APCA contrast checks happen at runtime against
 * the resolved glass backdrop, not against these primitives directly.
 */
export const palette = {
  // Neutrals — warm-leaning, usable under both light and dark glass
  neutral0: '#FFFFFF',
  neutral50: '#F7F7F8',
  neutral100: '#EDEEF1',
  neutral200: '#D9DBE1',
  neutral300: '#B8BBC4',
  neutral400: '#8D91A0',
  neutral500: '#636878',
  neutral600: '#454957',
  neutral700: '#2C2F3A',
  neutral800: '#1A1C24',
  neutral900: '#0D0E14',
  neutral1000: '#000000',

  // Aurora — teal/violet/green
  aurora200: '#A6F0E0',
  aurora400: '#4FD3B5',
  aurora600: '#1E9B82',
  violet200: '#D9C7FF',
  violet400: '#9A7AFF',
  violet600: '#5A3AE0',

  // Obsidian — deep indigo/magenta
  indigo200: '#C8CCFF',
  indigo400: '#6B74FF',
  indigo600: '#3A40C2',
  magenta200: '#FFC6E6',
  magenta400: '#FF5CA7',
  magenta600: '#C21E73',

  // Frost — ice blue/cyan
  ice200: '#CDE9FF',
  ice400: '#5FB7FF',
  ice600: '#1A73C9',
  cyan200: '#BFF4F3',
  cyan400: '#45D9D6',
  cyan600: '#0D8885',

  // Sunset — amber/coral/peach
  amber200: '#FFE2B3',
  amber400: '#FFB347',
  amber600: '#D07800',
  coral200: '#FFD0C2',
  coral400: '#FF785C',
  coral600: '#C4361A',
} as const;

export type PaletteToken = keyof typeof palette;

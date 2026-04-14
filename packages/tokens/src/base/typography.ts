export const fontSize = {
  '2xs': 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export type FontSizeToken = keyof typeof fontSize;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, string>;

export type FontWeightToken = keyof typeof fontWeight;

export const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.45,
  relaxed: 1.6,
} as const;

export type LineHeightToken = keyof typeof lineHeight;

export const letterSpacing = {
  tighter: -0.5,
  tight: -0.2,
  normal: 0,
  wide: 0.3,
  wider: 0.6,
} as const;

export type LetterSpacingToken = keyof typeof letterSpacing;
